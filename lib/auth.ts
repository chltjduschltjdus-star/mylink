import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { MOCK_USER } from "./mockData";

// 구글 인증 공급자 인스턴스
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

/**
 * 사용자 프로필 인터페이스 (Firestore users/{uid} 문서 모델)
 */
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  username: string;
  bio: string;
  photoURL: string | null;
  createdAt?: unknown;
  lastLoginAt?: unknown;
}

/**
 * 1. 구글 소셜 팝업 로그인
 */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // 로그인 시 Firestore users/{uid} 경로에 유저 기본 정보 동기화
    await syncUserProfileToFirestore(user);

    return user;
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (
      err?.code === "auth/popup-closed-by-user" ||
      err?.code === "auth/cancelled-popup-request"
    ) {
      throw error;
    }
    console.error("Google 로그인 실패:", error);
    throw error;
  }
}

/**
 * 2. 로그아웃
 */
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("로그아웃 실패:", error);
    throw error;
  }
}

/**
 * 3. onAuthStateChanged 기반 인증 상태 감지 리스너 구독
 */
export function subscribeAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * 4. username 중복 체크 함수
 * @param username 검사할 사용자 아이디
 * @param currentUserId 현재 로그인한 사용자의 UID (자신의 기존 username은 중복으로 판정하지 않음)
 * @returns 중복이면 true, 사용 가능하면 false
 */
export async function checkUsernameDuplicate(
  username: string,
  currentUserId?: string | null
): Promise<boolean> {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername) return false;

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", cleanUsername));
    const querySnapshot = await getDocs(q);

    // 검색된 문서 중 현재 사용자가 아닌 다른 사용자의 문서가 있는지 확인
    const isDuplicate = querySnapshot.docs.some((docSnap) => docSnap.id !== currentUserId);
    return isDuplicate;
  } catch (error) {
    console.warn("username 중복 확인 중 에러 (조회 실패):", error);
    return false;
  }
}

/**
 * 5. Firestore users/{uid} 및 users/{uid}/profile 문서에 유저 정보 동기화/저장
 * - 로그인 시 username은 이메일 앞부분으로 자동 생성
 * - displayName은 구글 이름을 기본값으로 설정 (구글 이름이 없을 경우 이메일 앞부분)
 */
export async function syncUserProfileToFirestore(user: FirebaseUser): Promise<void> {
  if (!user || !user.uid) return;

  try {
    const userDocRef = doc(db, "users", user.uid);
    const profileSubDocRef = doc(db, "users", user.uid, "profile", "profile");
    const docSnap = await getDoc(userDocRef);

    // username: 이메일 앞부분으로 자동 생성 (URL 안전 문자 정제)
    const emailPrefix = user.email ? user.email.split("@")[0] : "user";
    const initialUsername = emailPrefix.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase() || "user";

    // displayName: 구글 계정 이름을 기본값으로 설정
    const initialDisplayName = user.displayName?.trim() || emailPrefix;
    const initialBio = "안녕하세요! 나만의 링크 공간입니다.";

    if (!docSnap.exists()) {
      // 최초 로그인인 경우 기본 username, 구글 이름(displayName), bio 생성 및 저장
      const profileData = {
        uid: user.uid,
        email: user.email || "",
        displayName: initialDisplayName,
        displayname: initialDisplayName,
        username: initialUsername,
        bio: initialBio,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 1) users/{userId} 루트 문서 저장
      await setDoc(userDocRef, {
        ...profileData,
        profile: {
          username: initialUsername,
          displayName: initialDisplayName,
          displayname: initialDisplayName,
          bio: initialBio,
        },
      });

      // 2) users/{userId}/profile 서브컬렉션 문서 저장
      try {
        await setDoc(profileSubDocRef, {
          username: initialUsername,
          displayName: initialDisplayName,
          displayname: initialDisplayName,
          bio: initialBio,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (subErr) {
        console.warn("users/{userId}/profile 서브컬렉션 저장 경고:", subErr);
      }
    } else {
      // 기존 유저인 경우 로그인 시각 및 이메일 동기화 (기존 사용자가 커스텀한 username, displayName, bio는 유지)
      await updateDoc(userDocRef, {
        email: user.email || "",
        lastLoginAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.warn("Firestore 유저 정보 동기화 실패 (오프라인/권한 등):", error);
  }
}

/**
 * 6. Firestore users/{uid}/profile 및 users/{uid} 경로에서 유저 정보 조회
 */
export async function getUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  if (!uid) return null;

  try {
    // 1) users/{userId}/profile/profile 서브컬렉션 문서 먼저 조회
    const profileSubDocRef = doc(db, "users", uid, "profile", "profile");
    const subSnap = await getDoc(profileSubDocRef);

    // 2) users/{userId} 루트 문서 조회
    const userDocRef = doc(db, "users", uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists() && !subSnap.exists()) {
      return null;
    }

    const userData = userSnap.exists() ? (userSnap.data() as Record<string, unknown>) : {};
    const subData = subSnap.exists() ? (subSnap.data() as Record<string, unknown>) : {};
    const nestedProfile = (userData.profile as Record<string, unknown>) || {};

    const displayName =
      (subData.displayName as string) ||
      (subData.displayname as string) ||
      (nestedProfile.displayName as string) ||
      (nestedProfile.displayname as string) ||
      (userData.displayName as string) ||
      (userData.displayname as string) ||
      null;

    const username =
      (subData.username as string) ||
      (nestedProfile.username as string) ||
      (userData.username as string) ||
      "";

    const bio =
      (subData.bio as string) ??
      (nestedProfile.bio as string) ??
      (userData.bio as string) ??
      "";

    return {
      uid,
      email: (userData.email as string) || null,
      displayName,
      username,
      bio,
      photoURL: (userData.photoURL as string) || null,
      createdAt: userData.createdAt,
      lastLoginAt: userData.lastLoginAt,
    };
  } catch (error) {
    console.warn("Firestore 유저 정보 조회 실패:", error);
    return null;
  }
}

/**
 * 7. Firestore users/{userId}/profile 및 users/{userId} 사용자 프로필(username, displayName, bio) 수정 저장
 * - 저장 전 username 중복 체크 수행, 중복 시 에러 발생
 */
export async function updateUserProfileInFirestore(
  uid: string,
  data: { username: string; displayName: string; bio: string }
): Promise<void> {
  if (!uid) {
    throw new Error("유저 식별자(UID)가 유효하지 않습니다.");
  }

  // [보안 검증] 로그인한 본인만 프로필 정보 수정 가능
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    throw new Error("프로필 수정 권한이 없습니다. 본인 계정으로 로그인해주세요.");
  }

  const cleanUsername = data.username.trim().toLowerCase();
  const cleanDisplayName = data.displayName.trim();
  const cleanBio = data.bio.trim();

  if (!cleanUsername) {
    throw new Error("username(사용자 아이디)을 입력해주세요.");
  }
  if (!cleanDisplayName) {
    throw new Error("displayname(표시 이름)을 입력해주세요.");
  }

  // 1. username 중복 체크 (본인 UID 제외)
  const isDuplicate = await checkUsernameDuplicate(cleanUsername, uid);
  if (isDuplicate) {
    throw new Error(`이미 사용 중인 username (@${cleanUsername}) 입니다. 다른 아이디를 입력해주세요.`);
  }

  try {
    const timestamp = serverTimestamp();

    // 2. users/{userId}/profile/profile 문서에 저장
    const profileSubDocRef = doc(db, "users", uid, "profile", "profile");
    await setDoc(
      profileSubDocRef,
      {
        username: cleanUsername,
        displayName: cleanDisplayName,
        displayname: cleanDisplayName,
        bio: cleanBio,
        updatedAt: timestamp,
      },
      { merge: true }
    );

    // 3. users/{userId} 루트 문서에도 완벽 동기화 (루트 필드 및 profile 맵)
    const userDocRef = doc(db, "users", uid);
    await setDoc(
      userDocRef,
      {
        username: cleanUsername,
        displayName: cleanDisplayName,
        displayname: cleanDisplayName,
        bio: cleanBio,
        profile: {
          username: cleanUsername,
          displayName: cleanDisplayName,
          displayname: cleanDisplayName,
          bio: cleanBio,
          updatedAt: timestamp,
        },
        updatedAt: timestamp,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Firestore 유저 프로필 저장 실패:", error);
    throw error;
  }
}

/**
 * 8. displayName으로 Firestore 유저 검색 (where 쿼리)
 * - users (및 user) 컬렉션에서 where("displayName", "==", name) 쿼리
 * - 대소문자 및 필드명 (displayname, username)에 대한 스마트 폴백 검색 지원
 * - 일치하는 유저가 없으면 null 반환 (-> 404 페이지로 라우팅)
 */
export async function searchUserByDisplayName(queryName: string): Promise<UserProfile | null> {
  const cleanName = queryName.trim();
  if (!cleanName) return null;

  try {
    // 1. users 컬렉션에서 displayName where 쿼리 검색
    const usersRef = collection(db, "users");
    const q1 = query(usersRef, where("displayName", "==", cleanName));
    let snapshot = await getDocs(q1);

    // 2. 일치 문서가 없을 경우 displayname (소문자 필드) 검색
    if (snapshot.empty) {
      const q2 = query(usersRef, where("displayname", "==", cleanName));
      snapshot = await getDocs(q2);
    }

    // 3. 일치 문서가 없을 경우 username (소문자/원문) 검색 폴백
    if (snapshot.empty) {
      const q3 = query(usersRef, where("username", "==", cleanName.toLowerCase()));
      snapshot = await getDocs(q3);
    }

    if (snapshot.empty) {
      const q3Original = query(usersRef, where("username", "==", cleanName));
      snapshot = await getDocs(q3Original);
    }

    // 4. 'user' 단수형 컬렉션 존재 시 대비 검색
    if (snapshot.empty) {
      try {
        const userRef = collection(db, "user");
        const q4 = query(userRef, where("displayName", "==", cleanName));
        const snapUser = await getDocs(q4);
        if (!snapUser.empty) {
          snapshot = snapUser;
        } else {
          const q4Sub = query(userRef, where("displayname", "==", cleanName));
          const snapUserSub = await getDocs(q4Sub);
          if (!snapUserSub.empty) {
            snapshot = snapUserSub;
          }
        }
      } catch {
        // user 단수형 컬렉션 쿼리 실패 무시
      }
    }

    // 일치하는 문서를 찾은 경우 UserProfile 객체로 변환하여 반환
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const userData = docSnap.data() as Record<string, unknown>;
      const nestedProfile = (userData.profile as Record<string, unknown>) || {};

      const displayName =
        (userData.displayName as string) ||
        (userData.displayname as string) ||
        (nestedProfile.displayName as string) ||
        (nestedProfile.displayname as string) ||
        cleanName;

      const username =
        (userData.username as string) ||
        (nestedProfile.username as string) ||
        "";

      const bio =
        (userData.bio as string) ??
        (nestedProfile.bio as string) ??
        "";

      return {
        uid: docSnap.id,
        email: (userData.email as string) || null,
        displayName,
        username,
        bio,
        photoURL: (userData.photoURL as string) || null,
        createdAt: userData.createdAt,
        lastLoginAt: userData.lastLoginAt,
      };
    }

    // 5. 데모/모의 데이터 일치 여부 확인 (최서연 데모)
    if (
      cleanName === MOCK_USER.displayName ||
      cleanName === MOCK_USER.username ||
      cleanName.toLowerCase() === MOCK_USER.username.toLowerCase() ||
      cleanName === "최서연"
    ) {
      return {
        uid: MOCK_USER.id,
        email: "seoyeon@example.com",
        displayName: MOCK_USER.displayName,
        username: MOCK_USER.username,
        bio: MOCK_USER.bio,
        photoURL: MOCK_USER.avatarUrl,
        createdAt: MOCK_USER.createdAt,
      };
    }

    return null;
  } catch (error) {
    console.error("displayName 유저 검색 에러:", error);
    return null;
  }
}

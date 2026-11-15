import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { Block, TimestampLike } from "./mockData";

/**
 * Firestore 경로 헬퍼 함수
 * @param userId 사용자 uid (요구사항: user/{userId}/links)
 */
export function getUserLinksCollectionRef(userId: string) {
  const safeUid = userId || "anonymous";
  return collection(db, "user", safeUid, "links");
}

export interface CreateLinkInput {
  title: string;
  url: string;
  icon?: string;
  order?: number;
}

export interface FirestoreLinkDocument {
  id?: string;
  userId: string;
  type: "link";
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  order: number;
  clickCount: number;
  createdAt: TimestampLike;
}

/**
 * 타임스탬프 값을 밀리초 숫자로 변환 (최신순 정렬용)
 */
export function getMillisFromTimestamp(val: unknown): number {
  if (!val) return Date.now(); // 낙관적 업데이트 / 서버 타임스탬프 대기 중인 항목은 최상단 배치
  const obj = val as Record<string, unknown>;
  if (typeof obj.toMillis === "function") return (obj.toMillis as () => number)();
  if (typeof obj.toDate === "function") return (obj.toDate as () => Date)().getTime();
  if (val instanceof Date) return val.getTime();
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const t = new Date(val).getTime();
    return isNaN(t) ? 0 : t;
  }
  if (typeof obj.seconds === "number") {
    return obj.seconds * 1000 + ((obj.nanoseconds as number) || 0) / 1000000;
  }
  return 0;
}

/**
 * 블록 목록을 createdAt 기준 최신순(내림차순, Newest First)으로 정렬
 */
export function sortLinksByCreatedAtDesc(items: Block[]): Block[] {
  return [...items].sort((a, b) => {
    const timeA = getMillisFromTimestamp(a.createdAt);
    const timeB = getMillisFromTimestamp(b.createdAt);
    return timeB - timeA;
  });
}

function mapDocToBlock(d: QueryDocumentSnapshot<DocumentData>, safeUid: string): Block {
  const data = d.data() as Partial<FirestoreLinkDocument>;
  return {
    id: d.id,
    userId: data.userId || safeUid,
    type: "link",
    title: data.title || "",
    url: data.url || "",
    icon: data.icon || "globe",
    isActive: data.isActive !== undefined ? data.isActive : true,
    order: typeof data.order === "number" ? data.order : 0,
    clickCount: typeof data.clickCount === "number" ? data.clickCount : 0,
    createdAt: data.createdAt,
  };
}

/**
 * 1. Firestore `user/{userId}/links` 경로에 새 링크 문서 추가
 * (기존 데이터 호환을 위해 `users/{userId}/links`에도 병행 저장)
 */
export async function addLinkToFirestore(
  userId: string,
  input: CreateLinkInput
): Promise<Block> {
  // [보안 검증] 로그인한 본인만 링크 추가 가능
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    throw new Error("링크 추가 권한이 없습니다. 본인 계정으로 로그인해주세요.");
  }

  const safeUid = userId || "anonymous";
  const userLinksRef = collection(db, "user", safeUid, "links");
  const usersLinksRef = collection(db, "users", safeUid, "links");

  const newDocData: Omit<FirestoreLinkDocument, "id"> = {
    userId: safeUid,
    type: "link",
    title: input.title.trim(),
    url: input.url.trim(),
    icon: input.icon || "globe",
    isActive: true,
    order: input.order ?? 0,
    clickCount: 0,
    createdAt: serverTimestamp(),
  };

  // 1) user/{userId}/links에 추가
  const docRef = await addDoc(userLinksRef, newDocData);

  // 2) users/{userId}/links에도 동기화 저장
  try {
    await setDoc(doc(usersLinksRef, docRef.id), newDocData);
  } catch (syncErr) {
    console.warn("users/{userId}/links 동기화 저장 알림:", syncErr);
  }

  return {
    id: docRef.id,
    userId: safeUid,
    type: "link",
    title: newDocData.title,
    url: newDocData.url,
    icon: newDocData.icon,
    isActive: newDocData.isActive,
    order: newDocData.order,
    clickCount: 0,
    createdAt: new Date(),
  };
}

/**
 * 2. Firestore `user/{userId}/links` (및 users/{userId}/links) 링크 목록 1회 조회 (createdAt 최신순)
 */
export async function getLinksFromFirestore(userId: string): Promise<Block[]> {
  const safeUid = userId || "anonymous";
  const userLinksRef = collection(db, "user", safeUid, "links");
  const usersLinksRef = collection(db, "users", safeUid, "links");

  try {
    // 1) user/{userId}/links 우선 조회
    const q1 = query(userLinksRef, orderBy("createdAt", "desc"));
    const snapshot1 = await getDocs(q1);
    if (!snapshot1.empty) {
      const items = snapshot1.docs.map((d) => mapDocToBlock(d, safeUid));
      return sortLinksByCreatedAtDesc(items);
    }

    // 2) users/{userId}/links 조회
    const q2 = query(usersLinksRef, orderBy("createdAt", "desc"));
    const snapshot2 = await getDocs(q2);
    if (!snapshot2.empty) {
      const items = snapshot2.docs.map((d) => mapDocToBlock(d, safeUid));
      return sortLinksByCreatedAtDesc(items);
    }

    // 3) 폴백: orderBy 없이 조회
    const fallbackSnap1 = await getDocs(userLinksRef);
    if (!fallbackSnap1.empty) {
      const items = fallbackSnap1.docs.map((d) => mapDocToBlock(d, safeUid));
      return sortLinksByCreatedAtDesc(items);
    }

    const fallbackSnap2 = await getDocs(usersLinksRef);
    const items = fallbackSnap2.docs.map((d) => mapDocToBlock(d, safeUid));
    return sortLinksByCreatedAtDesc(items);
  } catch (error) {
    console.warn("Firestore 링크 조회 오류, 빈 배열 반환:", error);
    return [];
  }
}

/**
 * 3. Firestore `user/{userId}/links` 실시간 동기화 구독 (createdAt 최신순 정렬)
 * user/{userId}/links 또는 users/{userId}/links 둘 중 데이터가 있는 컬렉션을 자동 반영
 */
export function subscribeFirestoreLinks(
  userId: string,
  onData: (links: Block[]) => void,
  onError?: (error: Error) => void
) {
  const safeUid = userId || "anonymous";
  const userLinksRef = collection(db, "user", safeUid, "links");
  const usersLinksRef = collection(db, "users", safeUid, "links");

  const qUser = query(userLinksRef, orderBy("createdAt", "desc"));
  const qUsers = query(usersLinksRef, orderBy("createdAt", "desc"));

  let hasUserLinksData = false;

  // 1) user/{userId}/links 리스너
  const unsubUser = onSnapshot(
    qUser,
    (snapshot) => {
      if (!snapshot.empty) {
        hasUserLinksData = true;
        const items = snapshot.docs.map((d) => mapDocToBlock(d, safeUid));
        onData(sortLinksByCreatedAtDesc(items));
      } else if (!hasUserLinksData) {
        // user/{userId}/links가 비어있으면 users/{userId}/links 데이터가 처리되도록 대기
      } else {
        // 원래 데이터가 있었는데 전부 삭제된 경우
        onData([]);
      }
    },
    (err) => {
      console.warn("user/{userId}/links 리스너 알림:", err);
    }
  );

  // 2) users/{userId}/links 리스너 (기존 데이터 호환)
  const unsubUsers = onSnapshot(
    qUsers,
    (snapshot) => {
      if (!hasUserLinksData) {
        const items = snapshot.docs.map((d) => mapDocToBlock(d, safeUid));
        onData(sortLinksByCreatedAtDesc(items));
      }
    },
    (err) => {
      if (onError && !hasUserLinksData) onError(err);
    }
  );

  return () => {
    unsubUser();
    unsubUsers();
  };
}

/**
 * 4. 링크 클릭 수 증가 (user/{userId}/links/{linkId} 및 users/{userId}/links/{linkId})
 */
export async function incrementFirestoreLinkClick(
  userId: string,
  linkId: string,
  currentCount: number
) {
  const safeUid = userId || "anonymous";
  const newCount = currentCount + 1;

  try {
    const userDocRef = doc(db, "user", safeUid, "links", linkId);
    await updateDoc(userDocRef, { clickCount: newCount });
  } catch {
    // user에 없으면 users 경로 시도
    try {
      const usersDocRef = doc(db, "users", safeUid, "links", linkId);
      await updateDoc(usersDocRef, { clickCount: newCount });
    } catch (e) {
      console.warn("Firestore 클릭 수 업데이트 실패:", e);
    }
  }
}

export interface UpdateLinkInput {
  title: string;
  url: string;
  icon?: string;
}

/**
 * 5. Firestore `user/{userId}/links` (및 users/{userId}/links) 경로의 링크 정보 수정
 */
export async function updateLinkInFirestore(
  userId: string,
  linkId: string,
  input: UpdateLinkInput
): Promise<void> {
  // [보안 검증] 로그인한 본인만 링크 수정 가능
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    throw new Error("링크 수정 권한이 없습니다. 본인 계정으로 로그인해주세요.");
  }

  const safeUid = userId || "anonymous";
  const updateData: { title: string; url: string; icon?: string } = {
    title: input.title.trim(),
    url: input.url.trim(),
  };
  if (input.icon) {
    updateData.icon = input.icon;
  }

  try {
    const userDocRef = doc(db, "user", safeUid, "links", linkId);
    await updateDoc(userDocRef, updateData);
  } catch {
    // user 컬렉션에 없을 경우
  }

  try {
    const usersDocRef = doc(db, "users", safeUid, "links", linkId);
    await updateDoc(usersDocRef, updateData);
  } catch {
    // users 컬렉션에 없을 경우
  }
}

/**
 * 6. Firestore `user/{userId}/links` (및 users/{userId}/links) 경로의 링크 문서 삭제
 */
export async function deleteLinkFromFirestore(
  userId: string,
  linkId: string
): Promise<void> {
  // [보안 검증] 로그인한 본인만 링크 삭제 가능
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    throw new Error("링크 삭제 권한이 없습니다. 본인 계정으로 로그인해주세요.");
  }

  const safeUid = userId || "anonymous";

  try {
    const userDocRef = doc(db, "user", safeUid, "links", linkId);
    await deleteDoc(userDocRef);
  } catch {
    // user에 문서 없음
  }

  try {
    const usersDocRef = doc(db, "users", safeUid, "links", linkId);
    await deleteDoc(usersDocRef);
  } catch {
    // users에 문서 없음
  }
}

import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  FieldValue,
} from "firebase/firestore";
import { db } from "./firebase";
import { Block, TimestampLike } from "./mockData";

// Firestore 저장 경로: users/anonymous/links
export const FIRESTORE_LINKS_PATH = "users/anonymous/links";

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

/**
 * 1. Firestore `users/anonymous/links` 경로에 새 링크 문서 추가
 */
export async function addLinkToFirestore(input: CreateLinkInput): Promise<Block> {
  const linksRef = collection(db, "users", "anonymous", "links");

  const newDocData: Omit<FirestoreLinkDocument, "id"> = {
    userId: "anonymous",
    type: "link",
    title: input.title.trim(),
    url: input.url.trim(),
    icon: input.icon || "globe",
    isActive: true,
    order: input.order ?? 0,
    clickCount: 0,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(linksRef, newDocData);

  return {
    id: docRef.id,
    userId: "anonymous",
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
 * 2. Firestore `users/anonymous/links` 경로의 링크 조회 (createdAt 최신순)
 */
export async function getLinksFromFirestore(): Promise<Block[]> {
  try {
    const linksRef = collection(db, "users", "anonymous", "links");
    const q = query(linksRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const items: Block[] = snapshot.docs.map((d) => {
      const data = d.data() as Partial<FirestoreLinkDocument>;
      return {
        id: d.id,
        userId: data.userId || "anonymous",
        type: "link",
        title: data.title || "",
        url: data.url || "",
        icon: data.icon || "globe",
        isActive: data.isActive !== undefined ? data.isActive : true,
        order: typeof data.order === "number" ? data.order : 0,
        clickCount: typeof data.clickCount === "number" ? data.clickCount : 0,
        createdAt: data.createdAt,
      };
    });

    return sortLinksByCreatedAtDesc(items);
  } catch (error) {
    console.error("Firestore 링크 조회(orderBy) 실패, 기본 조회 폴백 시도:", error);
    try {
      const linksRef = collection(db, "users", "anonymous", "links");
      const snapshot = await getDocs(linksRef);
      const items: Block[] = snapshot.docs.map((d) => {
        const data = d.data() as Partial<FirestoreLinkDocument>;
        return {
          id: d.id,
          userId: data.userId || "anonymous",
          type: "link",
          title: data.title || "",
          url: data.url || "",
          icon: data.icon || "globe",
          isActive: data.isActive !== undefined ? data.isActive : true,
          order: typeof data.order === "number" ? data.order : 0,
          clickCount: typeof data.clickCount === "number" ? data.clickCount : 0,
          createdAt: data.createdAt,
        };
      });
      return sortLinksByCreatedAtDesc(items);
    } catch (fallbackError) {
      console.error("Firestore 링크 폴백 조회 실패:", fallbackError);
      return [];
    }
  }
}

/**
 * 3. Firestore `users/anonymous/links` 실시간 동기화 구독 (createdAt 최신순 정렬)
 */
export function subscribeFirestoreLinks(
  onData: (links: Block[]) => void,
  onError?: (error: Error) => void
) {
  const linksRef = collection(db, "users", "anonymous", "links");
  const q = query(linksRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Block[] = snapshot.docs.map((d) => {
        const data = d.data() as Partial<FirestoreLinkDocument>;
        return {
          id: d.id,
          userId: data.userId || "anonymous",
          type: "link",
          title: data.title || "",
          url: data.url || "",
          icon: data.icon || "globe",
          isActive: data.isActive !== undefined ? data.isActive : true,
          order: typeof data.order === "number" ? data.order : 0,
          clickCount: typeof data.clickCount === "number" ? data.clickCount : 0,
          createdAt: data.createdAt,
        };
      });

      const sorted = sortLinksByCreatedAtDesc(items);
      onData(sorted);
    },
    (err) => {
      console.error("Firestore 실시간 동기화 에러(orderBy):", err);
      // orderBy 쿼리 에러 발생 시 컬렉션 전체 조회 폴백 리스너 연결
      const fallbackUnsub = onSnapshot(
        linksRef,
        (fallbackSnapshot) => {
          const items: Block[] = fallbackSnapshot.docs.map((d) => {
            const data = d.data() as Partial<FirestoreLinkDocument>;
            return {
              id: d.id,
              userId: data.userId || "anonymous",
              type: "link",
              title: data.title || "",
              url: data.url || "",
              icon: data.icon || "globe",
              isActive: data.isActive !== undefined ? data.isActive : true,
              order: typeof data.order === "number" ? data.order : 0,
              clickCount: typeof data.clickCount === "number" ? data.clickCount : 0,
              createdAt: data.createdAt,
            };
          });
          onData(sortLinksByCreatedAtDesc(items));
        },
        (fallbackErr) => {
          if (onError) onError(fallbackErr);
        }
      );
      return fallbackUnsub;
    }
  );
}

/**
 * 4. 링크 클릭 수 증가
 */
export async function incrementFirestoreLinkClick(linkId: string, currentCount: number) {
  try {
    const linkDocRef = doc(db, "users", "anonymous", "links", linkId);
    await updateDoc(linkDocRef, {
      clickCount: currentCount + 1,
    });
  } catch (error) {
    console.warn("Firestore 클릭 수 업데이트 실패:", error);
  }
}

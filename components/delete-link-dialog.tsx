"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getBlockIcon } from "@/components/icons";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { Block } from "@/lib/mockData";

interface DeleteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: Block | null;
  onDelete: (linkId: string) => Promise<void> | void;
}

export function DeleteLinkDialog({
  open,
  onOpenChange,
  link,
  onDelete,
}: DeleteLinkDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setDeleteError(null);
      setIsDeleting(false);
    }
  }, [open]);

  const handleDelete = async () => {
    if (!link?.id) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);
      await onDelete(link.id);
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Firestore 링크 삭제 에러:", err);
      const message =
        err instanceof Error ? err.message : "링크 삭제 중 오류가 발생했습니다.";
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !isDeleting && onOpenChange(v)}>
      <DialogContent className="max-w-[400px] rounded-2xl p-6 bg-white/95 backdrop-blur-md border border-rose-100 shadow-xl">
        <DialogHeader className="gap-1.5 text-left">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="size-4" />
            </div>
            {/* 제목: "정말 삭제하시겠습니까?" */}
            <DialogTitle className="text-lg font-bold text-slate-800">
              정말 삭제하시겠습니까?
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            선택한 링크 카드가 프로필 페이지에서 완전히 제거됩니다.
          </DialogDescription>
        </DialogHeader>

        {deleteError && (
          <div className="mt-1 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
            {deleteError}
          </div>
        )}

        <div className="flex flex-col gap-3 my-2">
          {/* 링크 이름 표시 */}
          {link && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                {getBlockIcon(link.icon, "size-4")}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-slate-800 truncate">
                  {link.title}
                </span>
                {link.url && (
                  <span className="text-[11px] text-slate-400 truncate">
                    {link.url}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 경고: "이 작업은 되돌릴 수 없습니다" (빨간색) */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-600">
            <AlertTriangle className="size-4 shrink-0 text-rose-500" />
            <span className="text-xs font-semibold text-rose-600">
              이 작업은 되돌릴 수 없습니다
            </span>
          </div>
        </div>

        {/* 버튼: [취소] [삭제하기] */}
        <DialogFooter className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                className="rounded-xl text-slate-500 hover:bg-slate-100"
              >
                취소
              </Button>
            }
          />
          <Button
            type="button"
            size="sm"
            disabled={isDeleting}
            onClick={handleDelete}
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-4 font-semibold shadow-xs disabled:opacity-50 transition-all active:scale-95"
          >
            {isDeleting ? (
              <>
                <div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                <span>삭제 중...</span>
              </>
            ) : (
              <span>삭제하기</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

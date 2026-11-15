"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBlockIcon } from "@/components/icons";
import { Plus, Sparkles, Link2, AlertCircle } from "lucide-react";

// Zod 유효성 검증 스키마 정의
export const addLinkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "링크 제목을 1자 이상 입력해주세요." })
    .max(40, { message: "링크 제목은 40자 이내로 입력해주세요." }),
  url: z
    .string()
    .trim()
    .min(1, { message: "연결할 웹사이트 주소(URL)를 입력해주세요." })
    .refine(
      (val) => {
        // 프로토콜이 없으면 https:// 붙여서 유효한 URL인지 확인
        const formatted = /^https?:\/\//i.test(val) ? val : `https://${val}`;
        try {
          const parsed = new URL(formatted);
          return (
            (parsed.protocol === "http:" || parsed.protocol === "https:") &&
            parsed.hostname.length > 2 &&
            parsed.hostname.includes(".")
          );
        } catch {
          return false;
        }
      },
      {
        message:
          "올바른 웹사이트 주소 형식(URL)을 입력해주세요. (예: https://example.com 또는 github.com)",
      }
    ),
  icon: z.string(),
});

export type AddLinkFormData = z.infer<typeof addLinkSchema>;

export interface NewLinkData {
  title: string;
  url: string;
  icon?: string;
}

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLink: (data: NewLinkData) => void;
}

const AVAILABLE_ICONS = [
  { id: "globe", label: "웹사이트" },
  { id: "github", label: "GitHub" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "mail", label: "이메일" },
  { id: "coffee", label: "후원" },
  { id: "message-circle", label: "채팅" },
  { id: "laptop", label: "데모" },
  { id: "package", label: "프로젝트" },
  { id: "book-open", label: "블로그" },
  { id: "pen-tool", label: "디자인" },
  { id: "link2", label: "기본" },
];

export function AddLinkDialog({
  open,
  onOpenChange,
  onAddLink,
}: AddLinkDialogProps) {
  // React Hook Form + Zod Resolver 연동
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<AddLinkFormData>({
    resolver: zodResolver(addLinkSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      url: "",
      icon: "globe",
    },
  });

  // 실시간 입력값 모니터링 (실시간 미리보기 연동)
  const watchedTitle = watch("title");
  const watchedUrl = watch("url");
  const watchedIcon = watch("icon") || "globe";

  // 다이얼로그 열릴 때 폼 초기화
  React.useEffect(() => {
    if (open) {
      reset({
        title: "",
        url: "",
        icon: "globe",
      });
    }
  }, [open, reset]);

  // 폼 제출 핸들러 (유효성 검증 완료 시 호출)
  const onSubmit = (data: AddLinkFormData) => {
    let formattedUrl = data.url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    onAddLink({
      title: data.title.trim(),
      url: formattedUrl,
      icon: data.icon,
    });

    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-2xl p-6 bg-white/95 backdrop-blur-md border border-pink-100 shadow-xl">
        <DialogHeader className="gap-1.5 text-left">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
              <Sparkles className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-800">
              새 링크 추가
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            프로필 페이지에 노출될 링크 정보와 아이콘을 설정하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
          {/* 1. 링크 제목 입력 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="link-title" className="text-xs font-semibold text-slate-700">
              링크 제목 <span className="text-pink-500">*</span>
            </Label>
            <Input
              id="link-title"
              placeholder="예: 최신 프로젝트 포트폴리오"
              {...register("title")}
              aria-invalid={!!errors.title}
              className={`h-10 text-sm bg-slate-50/70 rounded-xl transition-all ${
                errors.title
                  ? "border-rose-400 focus-visible:ring-rose-200"
                  : "border-slate-200 focus-visible:border-pink-400 focus-visible:ring-pink-200/50"
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium">
                <AlertCircle className="size-3 shrink-0" />
                <span>{errors.title.message}</span>
              </p>
            )}
          </div>

          {/* 2. 링크 URL 입력 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="link-url" className="text-xs font-semibold text-slate-700">
              웹사이트 주소 (URL) <span className="text-pink-500">*</span>
            </Label>
            <Input
              id="link-url"
              placeholder="https://example.com 또는 github.com"
              {...register("url")}
              aria-invalid={!!errors.url}
              className={`h-10 text-sm bg-slate-50/70 rounded-xl transition-all ${
                errors.url
                  ? "border-rose-400 focus-visible:ring-rose-200"
                  : "border-slate-200 focus-visible:border-pink-400 focus-visible:ring-pink-200/50"
              }`}
            />
            {errors.url ? (
              <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium">
                <AlertCircle className="size-3 shrink-0" />
                <span>{errors.url.message}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                * https:// 없이 입력해도 자동으로 연결됩니다.
              </p>
            )}
          </div>

          {/* 3. 아이콘 선택 */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-slate-700">
              아이콘 선택
            </Label>
            <div className="grid grid-cols-6 gap-1.5 max-h-[120px] overflow-y-auto p-1 bg-slate-50/50 rounded-xl border border-slate-100">
              {AVAILABLE_ICONS.map((item) => {
                const isSelected = watchedIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.label}
                    onClick={() => setValue("icon", item.id, { shouldValidate: true })}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                      isSelected
                        ? "bg-pink-100 text-pink-600 ring-2 ring-pink-400 ring-offset-1 font-bold shadow-xs scale-105"
                        : "text-slate-500 hover:bg-white hover:text-slate-800"
                    }`}
                  >
                    <div className="size-4 flex items-center justify-center">
                      {getBlockIcon(item.id, "size-4")}
                    </div>
                    <span className="text-[9px] mt-1 leading-tight truncate w-full text-center">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. 실시간 미리보기 (Live Preview) */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[11px] font-medium text-slate-400">
              미리보기
            </span>
            <div className="rounded-xl border border-pink-200/70 bg-gradient-to-r from-pink-50/50 to-orange-50/30 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                  {getBlockIcon(watchedIcon, "size-4")}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {watchedTitle || "링크 제목을 입력하세요"}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {watchedUrl || "https://example.com"}
                  </span>
                </div>
              </div>
              <div className="size-5 rounded-full flex items-center justify-center text-pink-400">
                <Link2 className="size-3.5" />
              </div>
            </div>
          </div>

          {/* 5. 다이얼로그 푸터 버튼 */}
          <DialogFooter className="mt-2 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  취소
                </Button>
              }
            />
            <Button
              type="submit"
              size="sm"
              disabled={!isValid && isDirty}
              className="bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white rounded-xl px-4 font-semibold shadow-xs disabled:opacity-40 transition-all active:scale-95"
            >
              <Plus className="size-3.5 mr-1" />
              링크 추가
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

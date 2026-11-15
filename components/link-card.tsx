"use client";

import * as React from "react";
import {
  ExternalLink,
  MousePointerClick,
  Pencil,
  Trash2,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBlockIcon, AVAILABLE_ICONS } from "@/components/icons";
import { addLinkSchema, type AddLinkFormData } from "@/components/add-link-dialog";
import type { Block } from "@/lib/mockData";
import type { UpdateLinkInput } from "@/lib/links";

interface LinkCardProps {
  block: Block;
  onClick?: (block: Block) => void;
  onUpdate?: (linkId: string, data: UpdateLinkInput) => Promise<void> | void;
  onDeleteRequest?: (block: Block) => void;
  className?: string;
}

export function LinkCard({
  block,
  onClick,
  onUpdate,
  onDeleteRequest,
  className = "",
}: LinkCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // 인라인 편집용 React Hook Form (추가할 때와 동일한 Zod 스키마 검증)
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
      title: block.title || "",
      url: block.url || "",
      icon: block.icon || "globe",
    },
  });

  const watchedIcon = watch("icon") || "globe";

  // block 데이터가 변경되거나 편집 모드 시작 시 폼 초기화
  React.useEffect(() => {
    reset({
      title: block.title || "",
      url: block.url || "",
      icon: block.icon || "globe",
    });
    setSubmitError(null);
  }, [block, isEditing, reset]);

  const handleClick = () => {
    if (isEditing) return;
    onClick?.(block);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  // 인라인 수정 제출 핸들러 (Firestore 업데이트 연동)
  const onSubmit = async (data: AddLinkFormData) => {
    let formattedUrl = data.url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (onUpdate) {
        await onUpdate(block.id, {
          title: data.title.trim(),
          url: formattedUrl,
          icon: data.icon,
        });
      }

      setIsEditing(false);
    } catch (err: unknown) {
      console.error("Firestore 링크 수정 에러:", err);
      const message =
        err instanceof Error ? err.message : "수정사항 저장에 실패했습니다.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    reset({
      title: block.title || "",
      url: block.url || "",
      icon: block.icon || "globe",
    });
    setSubmitError(null);
    setIsEditing(false);
  };

  // URL에서 도메인 및 경로 추출 (https:// 제거)
  const displayUrl = block.url ? block.url.replace(/^https?:\/\//, "") : "";

  // 1. 인라인 편집 모드 UI
  if (isEditing) {
    return (
      <Card
        onClick={(e) => e.stopPropagation()}
        className={`relative overflow-hidden rounded-2xl border-2 border-pink-300 bg-white p-4 shadow-md transition-all ${className}`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-pink-100 text-pink-600 flex items-center justify-center">
              <Pencil className="size-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              링크 인라인 수정
            </span>
          </div>
          <button
            type="button"
            onClick={handleCancelEdit}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            title="편집 취소"
          >
            <X className="size-4" />
          </button>
        </div>

        {submitError && (
          <div className="mt-2.5 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-1.5">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-3">
          {/* 링크 제목 입력 */}
          <div className="flex flex-col gap-1">
            <Label htmlFor={`edit-title-${block.id}`} className="text-[11px] font-semibold text-slate-700">
              링크 제목 <span className="text-pink-500">*</span>
            </Label>
            <Input
              id={`edit-title-${block.id}`}
              placeholder="예: 최신 프로젝트 포트폴리오"
              disabled={isSubmitting}
              {...register("title")}
              aria-invalid={!!errors.title}
              className={`h-9 text-xs bg-slate-50/70 rounded-xl transition-all ${
                errors.title
                  ? "border-rose-400 focus-visible:ring-rose-200"
                  : "border-slate-200 focus-visible:border-pink-400 focus-visible:ring-pink-200/50"
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-[10px] text-rose-500 font-medium">
                <AlertCircle className="size-3 shrink-0" />
                <span>{errors.title.message}</span>
              </p>
            )}
          </div>

          {/* 링크 URL 입력 */}
          <div className="flex flex-col gap-1">
            <Label htmlFor={`edit-url-${block.id}`} className="text-[11px] font-semibold text-slate-700">
              웹사이트 주소 (URL) <span className="text-pink-500">*</span>
            </Label>
            <Input
              id={`edit-url-${block.id}`}
              placeholder="https://example.com 또는 github.com"
              disabled={isSubmitting}
              {...register("url")}
              aria-invalid={!!errors.url}
              className={`h-9 text-xs bg-slate-50/70 rounded-xl transition-all ${
                errors.url
                  ? "border-rose-400 focus-visible:ring-rose-200"
                  : "border-slate-200 focus-visible:border-pink-400 focus-visible:ring-pink-200/50"
              }`}
            />
            {errors.url && (
              <p className="flex items-center gap-1 text-[10px] text-rose-500 font-medium">
                <AlertCircle className="size-3 shrink-0" />
                <span>{errors.url.message}</span>
              </p>
            )}
          </div>

          {/* 아이콘 선택 */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] font-semibold text-slate-700">
              아이콘 선택
            </Label>
            <div className="grid grid-cols-6 gap-1 max-h-[100px] overflow-y-auto p-1 bg-slate-50/60 rounded-xl border border-slate-100">
              {AVAILABLE_ICONS.map((item) => {
                const isSelected = watchedIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isSubmitting}
                    title={item.label}
                    onClick={() => setValue("icon", item.id, { shouldValidate: true, shouldDirty: true })}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all ${
                      isSelected
                        ? "bg-pink-100 text-pink-600 ring-2 ring-pink-400 ring-offset-1 font-bold shadow-xs scale-105"
                        : "text-slate-500 hover:bg-white hover:text-slate-800"
                    }`}
                  >
                    <div className="size-3.5 flex items-center justify-center">
                      {getBlockIcon(item.id, "size-3.5")}
                    </div>
                    <span className="text-[8px] mt-0.5 leading-tight truncate w-full text-center">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 액션 버튼: 취소 / 저장 */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSubmitting}
              onClick={handleCancelEdit}
              className="h-8 px-3 text-xs rounded-lg text-slate-500 hover:bg-slate-100"
            >
              취소
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={(!isValid && isDirty) || isSubmitting}
              className="h-8 px-3.5 text-xs bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white rounded-lg font-semibold shadow-xs disabled:opacity-40 transition-all active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Check className="size-3.5 mr-1" />
                  <span>저장</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  // 2. 일반 카드 모드 UI (수정/삭제 버튼 항상 표시)
  return (
    <Card
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-pink-200/60 bg-white/85 hover:bg-white p-4 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] backdrop-blur-xs ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* 좌측 아이콘 + 링크 제목 & URL */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 border border-pink-100 group-hover:bg-pink-100 group-hover:scale-105 transition-all">
            {getBlockIcon(block.icon, "size-5")}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm sm:text-[15px] text-slate-800 truncate group-hover:text-pink-600 transition-colors">
              {block.title}
            </span>
            {displayUrl && (
              <span className="text-[11px] text-slate-400 truncate max-w-[170px] xs:max-w-[210px] sm:max-w-[250px]">
                {displayUrl}
              </span>
            )}
          </div>
        </div>

        {/* 우측 누적 클릭수 뱃지 + 수정/삭제 버튼 (항상 표시) + 외부링크 화살표 */}
        <div className="flex items-center gap-1.5 shrink-0">
          {typeof block.clickCount === "number" && block.clickCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 font-normal gap-1 hidden xs:inline-flex"
            >
              <MousePointerClick className="size-2.5 text-slate-400" />
              <span>{block.clickCount}</span>
            </Badge>
          )}

          {/* 수정 버튼: 항상 표시 (Always visible) */}
          <button
            type="button"
            title="링크 수정"
            aria-label="링크 수정"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="size-7 rounded-lg flex items-center justify-center text-slate-500 bg-slate-100/90 hover:bg-pink-100 hover:text-pink-600 transition-colors cursor-pointer border border-slate-200/60 active:scale-95"
          >
            <Pencil className="size-3.5" />
          </button>

          {/* 삭제 버튼: 항상 표시 (Always visible) */}
          <button
            type="button"
            title="링크 삭제"
            aria-label="링크 삭제"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRequest?.(block);
            }}
            className="size-7 rounded-lg flex items-center justify-center text-slate-500 bg-slate-100/90 hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer border border-slate-200/60 active:scale-95"
          >
            <Trash2 className="size-3.5" />
          </button>

          {/* 외부링크 화살표 */}
          <div className="size-7 rounded-full flex items-center justify-center text-slate-400 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all">
            <ExternalLink className="size-4" />
          </div>
        </div>
      </div>
    </Card>
  );
}

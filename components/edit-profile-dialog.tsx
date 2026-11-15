"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  AtSign,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { checkUsernameDuplicate } from "@/lib/auth";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    username: string;
    displayName: string;
    bio: string;
  };
  currentUserId: string;
  onSave: (data: { username: string; displayName: string; bio: string }) => Promise<void>;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  initialData,
  currentUserId,
  onSave,
}: EditProfileDialogProps) {
  const [username, setUsername] = React.useState(initialData.username || "");
  const [displayName, setDisplayName] = React.useState(initialData.displayName || "");
  const [bio, setBio] = React.useState(initialData.bio || "");

  // 유효성 및 상태 관리
  const [usernameError, setUsernameError] = React.useState<string | null>(null);
  const [displayNameError, setDisplayNameError] = React.useState<string | null>(null);
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);
  const [isUsernameValid, setIsUsernameValid] = React.useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // 다이얼로그가 열리거나 initialData가 바뀔 때 값 동기화
  React.useEffect(() => {
    if (open) {
      setUsername(initialData.username || "");
      setDisplayName(initialData.displayName || "");
      setBio(initialData.bio || "");
      setUsernameError(null);
      setDisplayNameError(null);
      setGeneralError(null);
      setIsUsernameValid(null);
      setIsSubmitting(false);
    }
  }, [open, initialData]);

  // username 정제 및 변경 핸들러
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/\s+/g, "");
    setUsername(val);
    setUsernameError(null);
    setIsUsernameValid(null);
    setGeneralError(null);
  };

  // username 단독 중복 체크
  const verifyUsername = async (targetUsername: string): Promise<boolean> => {
    const clean = targetUsername.trim().toLowerCase();

    if (!clean) {
      setUsernameError("username을 1자 이상 입력해주세요.");
      setIsUsernameValid(false);
      return false;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(clean)) {
      setUsernameError("영문 소문자, 숫자, 밑줄(_), 하이픈(-)만 사용 가능합니다.");
      setIsUsernameValid(false);
      return false;
    }

    // 본인의 기존 username과 동일한 경우 중복 아님
    if (clean === initialData.username.trim().toLowerCase()) {
      setUsernameError(null);
      setIsUsernameValid(true);
      return true;
    }

    setIsCheckingUsername(true);
    try {
      const isDuplicate = await checkUsernameDuplicate(clean, currentUserId);
      if (isDuplicate) {
        setUsernameError("이미 사용 중인 username입니다. 다른 이름을 선택해주세요.");
        setIsUsernameValid(false);
        return false;
      } else {
        setUsernameError(null);
        setIsUsernameValid(true);
        return true;
      }
    } catch {
      setUsernameError("중복 확인 중 오류가 발생했습니다.");
      setIsUsernameValid(false);
      return false;
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // 폼 제출 저장 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const cleanUsername = username.trim().toLowerCase();
    const cleanDisplayName = displayName.trim();
    const cleanBio = bio.trim();

    // 1. displayName 검증
    if (!cleanDisplayName) {
      setDisplayNameError("displayname(표시 이름)을 입력해주세요.");
      return;
    } else {
      setDisplayNameError(null);
    }

    // 2. username 검증 및 중복 체크
    const isUsernameOk = await verifyUsername(cleanUsername);
    if (!isUsernameOk) {
      return;
    }

    // 3. Firestore 저장 (users/{userId}/profile)
    setIsSubmitting(true);
    try {
      await onSave({
        username: cleanUsername,
        displayName: cleanDisplayName,
        bio: cleanBio,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "프로필 저장 중 문제가 발생했습니다.";
      if (errorMsg.includes("이미 사용 중인 username")) {
        setUsernameError(errorMsg);
        setIsUsernameValid(false);
      } else {
        setGeneralError(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-white/95 backdrop-blur-xl border border-pink-100 rounded-2xl shadow-xl p-5 sm:p-6 text-slate-800">
        <DialogHeader className="space-y-1.5 pb-2 text-left">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
              <Sparkles className="size-4" />
            </span>
            <DialogTitle className="text-lg font-bold text-slate-900">
              프로필 수정
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            공유 URL에 표시될 username과 프로필 정보를 변경할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* 1. username 필드 (공유 URL용) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-username" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <AtSign className="size-3.5 text-pink-500" />
                <span>username (공유 URL용)</span>
              </Label>
              <button
                type="button"
                onClick={() => verifyUsername(username)}
                disabled={isCheckingUsername || !username}
                className="text-[11px] font-medium text-pink-600 hover:text-pink-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isCheckingUsername ? "확인 중..." : "중복 확인"}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-mono text-sm">
                @
              </div>
              <Input
                id="profile-username"
                value={username}
                onChange={handleUsernameChange}
                onBlur={() => {
                  if (username && username !== initialData.username) {
                    verifyUsername(username);
                  }
                }}
                placeholder="my_handle"
                className={`pl-8 pr-8 font-mono text-xs sm:text-sm h-9 bg-slate-50/70 border ${
                  usernameError
                    ? "border-rose-400 focus-visible:ring-rose-200"
                    : isUsernameValid
                    ? "border-emerald-400 focus-visible:ring-emerald-200"
                    : "border-slate-200 focus-visible:border-pink-400 focus-visible:ring-pink-100"
                } rounded-xl`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {isCheckingUsername ? (
                  <Loader2 className="size-4 text-pink-500 animate-spin" />
                ) : isUsernameValid ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : usernameError ? (
                  <AlertCircle className="size-4 text-rose-500" />
                ) : null}
              </div>
            </div>

            {/* username 에러 또는 사용가능 메시지 */}
            {usernameError ? (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1">
                <AlertCircle className="size-3 shrink-0" />
                <span>{usernameError}</span>
              </p>
            ) : isUsernameValid ? (
              <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-1">
                <CheckCircle2 className="size-3 shrink-0" />
                <span>사용 가능한 username입니다.</span>
              </p>
            ) : (
              <p className="text-[10px] text-slate-400 mt-0.5">
                영문 소문자, 숫자, 밑줄(_), 하이픈(-) 조합 (URL: /@{username || "username"})
              </p>
            )}
          </div>

          {/* 2. displayname 필드 (표시 이름) */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-displayname" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="size-3.5 text-pink-500" />
              <span>displayname (표시 이름)</span>
            </Label>
            <Input
              id="profile-displayname"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setDisplayNameError(null);
                setGeneralError(null);
              }}
              placeholder="프로필에 표시될 이름"
              maxLength={40}
              className={`h-9 bg-slate-50/70 border ${
                displayNameError
                  ? "border-rose-400 focus-visible:ring-rose-200"
                  : "border-slate-200 focus-visible:border-pink-400 focus-visible:ring-pink-100"
              } rounded-xl text-xs sm:text-sm`}
            />
            {displayNameError && (
              <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1">
                <AlertCircle className="size-3 shrink-0" />
                <span>{displayNameError}</span>
              </p>
            )}
          </div>

          {/* 3. bio 필드 (소개글) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-bio" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="size-3.5 text-pink-500" />
                <span>bio (소개글)</span>
              </Label>
              <span className="text-[10px] text-slate-400 font-mono">
                {bio.length}/150
              </span>
            </div>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setGeneralError(null);
              }}
              placeholder="방문자들에게 나를 소개하는 글을 작성해보세요."
              maxLength={150}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus-visible:border-pink-400 focus-visible:ring-3 focus-visible:ring-pink-100 resize-none"
            />
          </div>

          {/* 전체 일반 오류 메시지 */}
          {generalError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
              <AlertCircle className="size-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          <DialogFooter className="pt-3 gap-2 flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none text-xs rounded-xl border-slate-200 hover:bg-slate-50 cursor-pointer"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || isCheckingUsername}
              className="flex-1 sm:flex-none text-xs rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-medium shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  <span>저장 중...</span>
                </>
              ) : (
                <span>프로필 저장</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

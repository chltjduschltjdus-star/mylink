import * as React from "react";
import { Button } from "@/components/ui/button";
import { getBlockIcon } from "@/components/icons";
import type { Block } from "@/lib/mockData";

interface SocialBarProps {
  socials: Block[];
  onSocialClick?: (social: Block) => void;
  className?: string;
}

export function SocialBar({ socials, onSocialClick, className = "" }: SocialBarProps) {
  const activeSocials = socials
    .filter((s) => s.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeSocials.length === 0) return null;

  return (
    <nav
      aria-label="소셜 채널 링크"
      className={`flex items-center justify-center gap-2.5 flex-wrap ${className}`}
    >
      {activeSocials.map((social) => (
        <Button
          key={social.id}
          variant="outline"
          size="icon"
          onClick={() => onSocialClick?.(social)}
          aria-label={social.title}
          className="size-10 rounded-full bg-white/90 hover:bg-white border-pink-200/70 hover:border-pink-300 hover:text-pink-600 text-slate-600 shadow-xs transition-all hover:scale-105 active:scale-95"
        >
          {getBlockIcon(social.icon, "size-4.5")}
        </Button>
      ))}
    </nav>
  );
}

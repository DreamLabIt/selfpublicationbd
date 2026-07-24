"use client";

import React, { useState } from "react";
import { MessageCircle, Link as LinkIcon, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ShareButtonsProps } from "@/types";


const PopoverContentAny = PopoverContent as React.ComponentType<
  React.PropsWithChildren<Record<string, unknown>>
>;

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function ShareButtons({
  url,
  title = "Self Preparation",
  compact = false,
}: ShareButtonsProps) {
  const [shareUrl, setShareUrl] = useState<string>(url || "");

  const copyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const textToCopy = shareUrl || (typeof window !== "undefined" ? window.location.href : "");

    if (!textToCopy) {
      toast.error("কপি করার জন্য লিংক পাওয়া যায়নি");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      toast.success("লিংক কপি করা হয়েছে", {
        className: "!bg-[#021d0f] !text-[#22c55e] !border-[#053b1e] !font-bn text-sm shadow-xl rounded-xl",
        style: {
          backgroundColor: "#021d0f",
          color: "#22c55e",
          borderColor: "#053b1e",
        },
      });
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("কপি করা যায়নি");
    }
  };

  const enc = encodeURIComponent(shareUrl);
  const encTitle = encodeURIComponent(title);

  const links = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
      icon: FacebookIcon,
      color: "#1877F2",
    },
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encTitle}%20${enc}`,
      icon: MessageCircle,
      color: "#25D366",
    },
  ];

  if (compact) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="px-3 py-1.5 rounded-lg border border-brand-light bg-white hover:bg-brand-light/40 text-brand-navy  ">
            <button
              type="button"
              className="flex items-center gap-2  "
            >
              <Share2 className="w-4 h-4 text-brand-navy " />
              <span className="font-medium">শেয়ার</span>
            </button>
          </div>

        </PopoverTrigger>

        <PopoverContentAny
          className="w-auto p-2 bg-white border border-brand-light rounded-xl shadow-lg font-bn z-50"
          align="end"
          sideOffset={5}
        >
          <div className="flex items-center gap-1.5">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <a
                  key={l.name}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg grid place-items-center text-white hover:scale-105 active:scale-95 transition-transform"
                  style={{ backgroundColor: l.color }}
                  data-testid={`share-${l.name.toLowerCase()}`}
                  title={l.name}
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              );
            })}

            <button
              onClick={copyLink}
              type="button"
              className="w-9 h-9 rounded-lg grid place-items-center bg-brand-navy text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              data-testid="share-copy"
              title="Copy Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>
        </PopoverContentAny>
      </Popover>
    );
  }

  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      data-testid="share-buttons"
    >
      <span className="text-xs text-brand-navy/60 font-medium">
        শেয়ার করুন:
      </span>
      {links.map((l) => {
        const Icon = l.icon;
        return (
          <a
            key={l.name}
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full grid place-items-center text-white hover:scale-105 active:scale-95 transition-transform shadow-soft"
            style={{ backgroundColor: l.color }}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}

      <button
        onClick={copyLink}
        type="button"
        className="w-9 h-9 rounded-full grid place-items-center bg-brand-navy text-white hover:scale-105 active:scale-95 transition-transform shadow-soft cursor-pointer"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
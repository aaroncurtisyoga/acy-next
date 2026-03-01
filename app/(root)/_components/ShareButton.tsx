"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Check } from "lucide-react";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import { formatDateTime } from "@/app/_lib/utils";
import { track } from "@vercel/analytics";

interface ShareButtonProps {
  event: EventWithLocationAndCategory;
  variant?: "default" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "sm" as const,
  md: "default" as const,
  lg: "lg" as const,
};

const ShareButton: FC<ShareButtonProps> = ({
  event,
  variant = "default",
  size = "sm",
  className = "",
}) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const generateShareText = () => {
    const dateTime = formatDateTime(event.startDateTime);
    const eventUrl = `${window.location.origin}/?event=${event.id}`;

    const lines = [
      event.title,
      "",
      `Date: ${dateTime.weekdayLong}, ${dateTime.monthLong} ${dateTime.dayNumber}, ${dateTime.year}`,
      `Time: ${dateTime.timeOnly}`,
      `Location: ${event.location.name}`,
    ];

    if (event.isFree) {
      lines.push(`Price: FREE`);
    }

    if (event.description) {
      const shortDescription =
        event.description.length > 150
          ? event.description.substring(0, 150) + "..."
          : event.description;
      lines.push("");
      lines.push(shortDescription);
    }

    lines.push("");
    lines.push(`Details: ${eventUrl}`);

    return lines.join("\n");
  };

  const handleShare = async () => {
    const shareText = generateShareText();
    const shareUrl = `${window.location.origin}/?event=${event.id}`;
    const shareData = {
      title: event.title,
      text: shareText,
      url: shareUrl,
    };

    track("event_share", {
      action: "share_click",
      event_id: event.id,
      event_title: event.title,
      category: event.category.name,
      method: "unknown",
    });

    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
      try {
        await navigator.share(shareData);
        track("event_share", {
          action: "share_complete",
          event_id: event.id,
          method: "native_share",
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
          await copyToClipboard(shareText);
        }
      }
    } else {
      await copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowTooltip(true);

      track("event_share", {
        action: "share_complete",
        event_id: event.id,
        method: "clipboard_copy",
      });

      setTimeout(() => {
        setCopied(false);
      }, 2000);

      setTimeout(() => {
        setShowTooltip(false);
      }, 2500);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setShowTooltip(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
        setTimeout(() => {
          setShowTooltip(false);
        }, 2500);
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }
      textArea.remove();
    }
  };

  if (variant === "icon") {
    return (
      <Tooltip open={showTooltip || undefined}>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={`text-muted-foreground hover:text-primary ${className}`}
            onClick={handleShare}
            aria-label="Share event"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500 animate-in fade-in-0 zoom-in-50" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="text-xs">
          {copied ? "Copied!" : "Copy event details"}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip open={showTooltip || undefined}>
      <TooltipTrigger asChild>
        <Button
          size={sizeMap[size]}
          variant="secondary"
          className={`font-medium ${className}`}
          onClick={handleShare}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500 animate-in fade-in-0 zoom-in-50" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? "Copied!" : "Share"}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-xs">Copied to clipboard!</TooltipContent>
    </Tooltip>
  );
};

export default ShareButton;

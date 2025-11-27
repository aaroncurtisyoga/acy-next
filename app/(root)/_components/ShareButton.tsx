"use client";

import { FC, useState } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
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

    // Format the share text in a clean, professional way
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
      method: "unknown", // Will be updated based on share method
    });

    // Check if Web Share API is available and mobile
    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
      try {
        await navigator.share(shareData);
        track("event_share", {
          action: "share_complete",
          event_id: event.id,
          method: "native_share",
        });
      } catch (err) {
        // User cancelled share or error occurred
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
          // Fallback to clipboard
          await copyToClipboard(shareText);
        }
      }
    } else {
      // Fallback to clipboard for desktop
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

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);

      // Hide tooltip after 2.5 seconds
      setTimeout(() => {
        setShowTooltip(false);
      }, 2500);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      // Fallback for older browsers
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
      <Tooltip
        content={copied ? "Copied!" : "Copy event details"}
        isOpen={showTooltip || undefined}
        placement="top"
        className="text-xs"
      >
        <Button
          isIconOnly
          size={size}
          variant="light"
          className={`text-foreground-600 hover:text-primary-500 ${className}`}
          onPress={handleShare}
          aria-label="Share event"
        >
          {copied ? (
            <Check className="w-4 h-4 text-success-500 animate-in fade-in-0 zoom-in-50" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      content="Copied to clipboard!"
      isOpen={showTooltip}
      placement="top"
      className="text-xs"
    >
      <Button
        size={size}
        variant="flat"
        className={`font-medium ${className}`}
        onPress={handleShare}
        startContent={
          copied ? (
            <Check className="w-4 h-4 text-success-500 animate-in fade-in-0 zoom-in-50" />
          ) : (
            <Copy className="w-4 h-4" />
          )
        }
      >
        {copied ? "Copied!" : "Share"}
      </Button>
    </Tooltip>
  );
};

export default ShareButton;

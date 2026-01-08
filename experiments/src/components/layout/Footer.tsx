"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function Footer() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istTime = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setTime(istTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full border-t border-border pt-8 pb-32 sm:pb-28 md:pt-10 md:pb-8 mt-16">
      <div className="flex flex-col items-center gap-5 sm:gap-6">
        {/* Contact Section */}
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Want to get in touch?
          </p>
          <Link
            href="mailto:ezdecode@gmail.com"
            className="text-sm sm:text-base font-medium text-foreground hover:text-foreground/70 transition-colors"
          >
            ezdecode@gmail.com
          </Link>
        </div>

        {/* Info Row - Responsive */}
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-3 sm:gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Based in IND</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="tabular-nums font-mono">{time || "00:00:00"}</span>
          </div>

          <span className="hidden sm:inline text-muted-foreground/50">·</span>

          <Link
            href="https://github.com/ezDecode"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            @ezDecode
          </Link>

          <span className="hidden sm:inline text-muted-foreground/50">·</span>

          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

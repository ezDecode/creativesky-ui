"use client";

import { Icon } from "@iconify/react";
import { MotionSurface } from "@/content/motion-surface/motion-surface";

export default function MotionSurfaceDemo() {
  return (
    <div className="w-full min-h-80 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-border/30 bg-background/50 p-4 shadow-lg backdrop-blur-sm">
        <MotionSurface
          enableHover={true}
          activeClassName="bg-muted"
          hoverClassName="bg-muted/60"
        >
          <div className="group relative block w-full rounded-lg px-4 py-3 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon icon="solar:home-2-linear" width={20} />
              </div>
              <div className="grid gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  Dashboard
                </span>
                <span className="text-xs text-muted-foreground">
                  View your analytics
                </span>
              </div>
            </div>
          </div>
          <div className="group relative block w-full rounded-lg px-4 py-3 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon icon="solar:folder-linear" width={20} />
              </div>
              <div className="grid gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  Projects
                </span>
                <span className="text-xs text-muted-foreground">
                  Manage your work
                </span>
              </div>
            </div>
          </div>
          <div className="group relative block w-full rounded-lg px-4 py-3 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon icon="solar:settings-linear" width={20} />
              </div>
              <div className="grid gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  Settings
                </span>
                <span className="text-xs text-muted-foreground">
                  Configure preferences
                </span>
              </div>
            </div>
          </div>
        </MotionSurface>
      </div>
    </div>
  );
}

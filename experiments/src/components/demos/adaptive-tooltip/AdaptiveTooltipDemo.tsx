"use client";

import { Icon } from "@iconify/react";
import { AdaptiveTooltip } from "@/content/adaptive-tooltip/adaptive-tooltip";

export default function AdaptiveTooltipDemo() {
  return (
    <div className="w-full min-h-80 flex items-center justify-center">
      {/* Toolbar surface */}
        <AdaptiveTooltip
          enablePinning
          items={[
            {
              icon: (
                <div className="rounded-xl bg-neutral-800 p-2.5 text-neutral-100 transition-transform ">
                  <Icon icon="solar:user-circle-linear" width={26} />
                </div>
              ),
              label: "Profile",
            },
            {
              icon: (
                <div className="rounded-xl bg-neutral-800 p-2.5 text-neutral-100 transition-transform ">
                  <Icon icon="solar:chat-round-dots-linear" width={26} />
                </div>
              ),
              label: "Messages",
              hasBadge: true,
            },
            {
              icon: (
                <div className="rounded-xl bg-neutral-800 p-2.5 text-neutral-100 transition-transform ">
                  <Icon icon="solar:calendar-linear" width={26} />
                </div>
              ),
              label: "Schedule",
            },
            {
              icon: (
                <div className="rounded-xl bg-neutral-800 p-2.5 text-neutral-100 transition-transform ">
                  <Icon icon="solar:settings-linear" width={26} />
                </div>
              ),
              label: "Preferences",
            },
          ]}
        />
    </div>
  );
}

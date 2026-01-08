"use client";

import { VanishForm } from "@/content/vanish-form/vanish-form";

export default function VanishFormDemo() {
  return (
    <div className="w-full min-h-80 flex items-center justify-center">
      <div className="w-full max-w-xl px-4">
        <VanishForm
          placeholders={[
            "What's on your mind?",
            "Search for anything...",
            "Ask me a question...",
            "Type to explore...",
          ]}
          onChange={() => {}}
          onSubmit={() => {}}
        />
      </div>
    </div>
  );
}

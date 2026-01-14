import React from "react";
import { Icon } from "@iconify/react";
import { DocsPageConfig, Interaction } from "./schema";

export function SectionRenderer({ config }: { config: DocsPageConfig }) {
  const { dependencies, interactions, license, showSource, mdxContent: MdxContent } = config;

  return (
    <>
      {/* Dependencies Section */}
      {dependencies && dependencies.length > 0 && (
        <section>
          <h3 className="docs-h3 flex items-center gap-2">Dependencies</h3>
          <div className="flex flex-wrap items-center gap-2">
            {dependencies.map((dep) => (
              <a
                key={dep}
                href={dep === "framer-motion" ? "https://motion.dev/" : `https://www.npmjs.com/package/${dep}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-muted-3 flex h-8 w-fit cursor-pointer items-center gap-2 rounded-xl px-3 text-xs transition-all duration-300"
              >
                {dep}
                {dep === "framer-motion" && <Icon icon="simple-icons:framer" className="size-3" />}
                {dep === "lucide-react" && <Icon icon="simple-icons:lucide" className="size-4" />}
                {dep === "gsap" && <Icon icon="simple-icons:greensock" className="size-4" />}
                {dep === "animejs" && <Icon icon="simple-icons:javascript" className="size-4" />}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Interactions Section */}
      {interactions && interactions.length > 0 && (
        <section>
          <h3 className="docs-h3">Interaction</h3>
          <table className="w-full">
            <tbody>
              {interactions.map((interaction: Interaction, i: number) => (
                <tr key={i} className="border-foreground/10 h-14 border-t tracking-tight last:border-b">
                  <td className="w-1/4">
                    <InteractionIcon type={interaction.type} />
                  </td>
                  <td className="text-muted-foreground">{interaction.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* MDX Content */}
      <article className="docs-article">
        {MdxContent ? (
          <MdxContent components={{ ComponentPreview: () => null, h1: () => null }} />
        ) : (
          <p className="text-muted-foreground italic">No documentation available.</p>
        )}
      </article>

      {/* Source Code Section */}
      {showSource && (
        <section>
          <h3 className="docs-h3">Source code</h3>
          <p className="docs-p flex items-center gap-2 flex-wrap">
            Click on the top right
            <span className="flex items-center justify-center bg-muted-3 size-8 rounded-2xl">
              <Icon icon="lucide:code-2" className="size-4" />
            </span>
            to view the source code
          </p>
        </section>
      )}

      {/* License Section */}
      {license && license.length > 0 && (
        <section>
          <h3 className="docs-h3">License &amp; Usage</h3>
          <ul className="docs-ul">
            {license.map((item, i) => (
              <li key={i} className="docs-li">{item}</li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function InteractionIcon({ type }: { type: Interaction["type"] }) {
  switch (type) {
    case "click": return <Icon icon="lucide:mouse-pointer-click" className="size-5" />;
    case "hover": return <Icon icon="lucide:pointer" className="size-5" />;
    case "scroll": return <Icon icon="lucide:mouse" className="size-5" />;
    case "drag": return <Icon icon="lucide:move" className="size-5" />;
    case "input": return <Icon icon="lucide:keyboard" className="size-5" />;
    default: return <Icon icon="lucide:info" className="size-5" />;
  }
}

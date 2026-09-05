import type { ReactNode } from "react";

import { ShaderFlow } from "../shaders/shader-flow";

// Belt-and-suspenders fade: the shader also fades itself out internally via
// its own radial uFadeShape uniform, but that falloff is tuned in normalized
// UV space and can land differently across extreme aspect ratios (ultra-wide
// windows), sometimes leaving a visible seam where the -z-10 container's
// hard `overflow-hidden` edge cuts it off. A CSS mask guarantees the canvas
// always reaches full transparency well before that edge, regardless.
const FADE_MASK =
  "linear-gradient(to bottom, black 0%, black 45%, transparent 85%)";

export function PageBackdrop(): ReactNode {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-225 overflow-hidden"
      style={{ WebkitMaskImage: FADE_MASK, maskImage: FADE_MASK }}
    >
      <div className="absolute inset-0 opacity-50 md:opacity-100">
        <ShaderFlow brightness={3} iterations={10} flowSpeed={[0, 0.1]} />
      </div>
    </div>
  );
}

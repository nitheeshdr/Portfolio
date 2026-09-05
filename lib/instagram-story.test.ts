import { describe, expect, it } from "vitest";
import { storyShareConfig, truncate } from "@/lib/instagram-story";

describe("truncate", () => {
  it("returns short text unchanged", () => {
    expect(truncate("Hello world", 40)).toBe("Hello world");
  });

  it("truncates long text with an ellipsis, never exceeding maxLength", () => {
    const long = "a".repeat(200);
    const result = truncate(long, 90);
    expect(result.length).toBeLessThanOrEqual(90);
    expect(result.endsWith("…")).toBe(true);
  });

  it("trims trailing whitespace before appending the ellipsis", () => {
    const result = truncate("word ".repeat(30), 20);
    expect(result).not.toMatch(/\s…$/);
  });

  it("handles Unicode and special characters without throwing", () => {
    const unicode = "こんにちは世界 — café résumé 🚀".repeat(10);
    expect(() => truncate(unicode, 50)).not.toThrow();
    expect(truncate(unicode, 50).length).toBeLessThanOrEqual(50);
  });

  it("leaves an empty string unchanged", () => {
    expect(truncate("", 10)).toBe("");
  });
});

describe("storyShareConfig", () => {
  it("defines copy for all three content types", () => {
    expect(Object.keys(storyShareConfig).sort()).toEqual([
      "blog",
      "project",
      "story",
    ]);
  });

  it("gives every type a non-empty eyebrow and CTA label", () => {
    for (const config of Object.values(storyShareConfig)) {
      expect(config.eyebrow.length).toBeGreaterThan(0);
      expect(config.ctaLabel.length).toBeGreaterThan(0);
    }
  });
});

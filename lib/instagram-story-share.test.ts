import { describe, expect, it } from "vitest";

import { createStoryShareUrl } from "@/lib/instagram-story-share";

describe("createStoryShareUrl", () => {
  it("builds the canonical URL with the UTM params for a blog path", () => {
    const url = createStoryShareUrl("/blog/my-post");
    expect(url).toBe(
      "https://nitheeshdr.in/blog/my-post?utm_source=instagram&utm_medium=social&utm_campaign=story_share"
    );
  });

  it("builds the canonical URL for a story path", () => {
    const url = createStoryShareUrl("/stories/my-story");
    expect(url.startsWith("https://nitheeshdr.in/stories/my-story?")).toBe(
      true
    );
  });

  it("builds the canonical URL for a project path", () => {
    const url = createStoryShareUrl("/projects/my-project");
    expect(url.startsWith("https://nitheeshdr.in/projects/my-project?")).toBe(
      true
    );
  });

  it("never produces a double slash between the origin and the path", () => {
    const url = createStoryShareUrl("/blog/my-post");
    expect(url).not.toContain("//blog");
  });

  it("does not mutate an already-absolute URL passed as the path", () => {
    const url = createStoryShareUrl("https://nitheeshdr.in/blog/my-post");
    expect(url.startsWith("https://nitheeshdr.in/blog/my-post?")).toBe(true);
  });

  it("always includes all three UTM params", () => {
    const url = new URL(createStoryShareUrl("/blog/my-post"));
    expect(url.searchParams.get("utm_source")).toBe("instagram");
    expect(url.searchParams.get("utm_medium")).toBe("social");
    expect(url.searchParams.get("utm_campaign")).toBe("story_share");
  });
});

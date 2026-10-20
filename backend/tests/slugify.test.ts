import { slugifyBase, randomHandle } from "../src/utils/slugify";

describe("slugifyBase", () => {
  it("lowercases and hyphenates a Latin name", () => {
    expect(slugifyBase("Ali", "Hosseini")).toBe("ali-hosseini");
  });

  it("strips characters that are not ascii letters/digits/hyphens", () => {
    expect(slugifyBase("Ali!", "Hosseini_2")).toBe("ali-hosseini2");
  });

  it("returns an empty string for pure Persian input (caller must fall back)", () => {
    expect(slugifyBase("علی", "حسینی")).toBe("");
  });

  it("collapses repeated whitespace into a single hyphen", () => {
    expect(slugifyBase("Ali   Reza", "Hosseini")).toBe("ali-reza-hosseini");
  });
});

describe("randomHandle", () => {
  it("produces a member- prefixed handle", () => {
    expect(randomHandle()).toMatch(/^member-[a-z0-9]{6}$/);
  });

  it("produces different handles across calls (probabilistically)", () => {
    const a = randomHandle();
    const b = randomHandle();
    expect(a).not.toBe(b);
  });
});

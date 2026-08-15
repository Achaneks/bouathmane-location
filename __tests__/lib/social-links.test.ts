import { EMPTY_SOCIAL_URLS, normalizeSocialUrls } from "@/lib/social-links";

describe("normalizeSocialUrls", () => {
  it("returns all-empty values when given null or undefined", () => {
    expect(normalizeSocialUrls(null)).toEqual(EMPTY_SOCIAL_URLS);
    expect(normalizeSocialUrls(undefined)).toEqual(EMPTY_SOCIAL_URLS);
  });

  it("returns all-empty values when given a non-object", () => {
    expect(normalizeSocialUrls("not an object")).toEqual(EMPTY_SOCIAL_URLS);
    expect(normalizeSocialUrls(["array", "not", "object"])).toEqual(EMPTY_SOCIAL_URLS);
  });

  it("keeps known string keys and defaults missing ones to empty strings", () => {
    const result = normalizeSocialUrls({
      instagram: "https://instagram.com/bouathmane",
      facebook: 123,
    });

    expect(result.instagram).toBe("https://instagram.com/bouathmane");
    expect(result.facebook).toBe("");
    expect(result.tiktok).toBe("");
  });
});

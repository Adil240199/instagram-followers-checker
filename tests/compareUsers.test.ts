import { describe, expect, it } from "vitest";

import { compareUsers } from "@/lib/instagram/compareUsers";

describe("compareUsers", () => {
  it("should correctly compare followers and following", () => {
    const followers = [
      {
        username: "alex",
        profileUrl: "https://www.instagram.com/_u/alex",
      },
      {
        username: "john",
        profileUrl: "https://www.instagram.com/_u/john",
      },
      {
        username: "mike",
        profileUrl: "https://www.instagram.com/_u/mike",
      },
    ];

    const following = [
      {
        username: "alex",
        profileUrl: "https://www.instagram.com/_u/alex",
      },
      {
        username: "john",
        profileUrl: "https://www.instagram.com/_u/john",
      },
      {
        username: "david",
        profileUrl: "https://www.instagram.com/_u/david",
      },
    ];

    const result = compareUsers(followers, following);

    expect(result.mutual).toHaveLength(2);
    expect(result.notFollowingBack).toHaveLength(1);
    expect(result.notFollowedBy).toHaveLength(1);

    expect(result.notFollowingBack[0].username).toBe("david");
    expect(result.notFollowedBy[0].username).toBe("mike");
  });
});
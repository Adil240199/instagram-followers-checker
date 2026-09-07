import { InstagramUser } from "@/types/instagram";

export interface ComparisonResult {
  mutual: InstagramUser[];
  notFollowingBack: InstagramUser[];
  notFollowedBy: InstagramUser[];
}

export function compareUsers(
  followers: InstagramUser[],
  following: InstagramUser[]
): ComparisonResult {
  const followersMap = new Map(
    followers.map((user) => [user.username.toLowerCase(), user])
  );

  const followingMap = new Map(
    following.map((user) => [user.username.toLowerCase(), user])
  );

  const mutual: InstagramUser[] = [];
  const notFollowingBack: InstagramUser[] = [];
  const notFollowedBy: InstagramUser[] = [];

  for (const user of following) {
    const username = user.username.toLowerCase();

    if (followersMap.has(username)) {
      mutual.push(user);
    } else {
      notFollowingBack.push(user);
    }
  }

  for (const user of followers) {
    const username = user.username.toLowerCase();

    if (!followingMap.has(username)) {
      notFollowedBy.push(user);
    }
  }

  return {
    mutual,
    notFollowingBack,
    notFollowedBy,
  };
}
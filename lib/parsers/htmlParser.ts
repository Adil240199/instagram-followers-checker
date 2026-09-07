import { InstagramUser } from "@/types/instagram";

const INSTAGRAM_HOSTS = [
  "instagram.com",
  "www.instagram.com",
];

function extractUsernameFromInstagramUrl(
  href: string
): string | null {
  try {
    const url = new URL(href);

    if (!INSTAGRAM_HOSTS.includes(url.hostname.toLowerCase())) {
      return null;
    }

    const segments = url.pathname
      .split("/")
      .filter(Boolean);

    if (segments.length === 0) {
      return null;
    }

    // Instagram export format:
    // /_u/username
    if (segments[0].toLowerCase() === "_u") {
      return segments[1] ?? null;
    }

    // Standard Instagram profile:
    // /username
    return segments[0];
  } catch {
    return null;
  }
}

export function parseInstagramHtml(
  html: string
): InstagramUser[] {
  const parser = new DOMParser();

  const document = parser.parseFromString(
    html,
    "text/html"
  );

  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("a[href]")
  );

  const users: InstagramUser[] = [];
  const usernames = new Set<string>();

  for (const link of links) {
    const username = extractUsernameFromInstagramUrl(
      link.href.trim()
    );

    if (!username) {
      continue;
    }

    const normalizedUsername = username.toLowerCase();

    if (usernames.has(normalizedUsername)) {
      continue;
    }

    usernames.add(normalizedUsername);

    users.push({
      username,
      profileUrl: link.href,
    });
  }

  return users;
}
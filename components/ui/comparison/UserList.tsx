import { ExternalLink, UserRound } from "lucide-react";

import { InstagramUser } from "@/types/instagram";

interface UserListProps {
  users: InstagramUser[];
  search?: string;
}

function getAvatarUrl(username: string) {
  return `https://unavatar.io/instagram/${encodeURIComponent(username)}`;
}

export default function UserList({ users, search = "" }: UserListProps) {
  const q = search.trim().toLowerCase();

  if (users.length === 0) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <p className="font-medium">Everyone follows you back 🎉</p>

        <p className="mt-1 text-sm text-muted-foreground">
          We could not find anyone who does not follow you.
        </p>
      </div>
    );
  }

  const filtered = q
    ? users.filter((u) => u.username.toLowerCase().includes(q))
    : users;

  if (filtered.length === 0) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <p className="font-medium">No results found</p>

        <p className="mt-1 text-sm text-muted-foreground">
          No users match your search
          {search ? (
            <span className="ml-1 text-muted-foreground">({search})</span>
          ) : null}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="divide-y">
        {filtered.map((user) => (
          <UserRow key={user.username} user={user} />
        ))}
      </div>
    </div>
  );
}

function UserRow({ user }: { user: InstagramUser }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/50">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
          <UserRound className="h-5 w-5 text-muted-foreground" />

          <img
            src={getAvatarUrl(user.username)}
            alt={`@${user.username}`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.remove();
            }}
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">@{user.username}</p>

          <p className="text-xs text-muted-foreground">Does not follow you</p>
        </div>
      </div>

      <a
        href={user.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Open Instagram
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}

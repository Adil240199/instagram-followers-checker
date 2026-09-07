"use client";

import { useState } from "react";

import FileUpload from "@/components/ui/file-upload/FileUpload";
import UserList from "@/components/ui/comparison/UserList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InstagramUser } from "@/types/instagram";
import { compareUsers, ComparisonResult } from "@/lib/instagram/compareUsers";
import { Users, UserMinus, UserCheck, UserPlus, Search } from "lucide-react";

export default function Home() {
  const [followers, setFollowers] = useState<InstagramUser[]>([]);
  const [following, setFollowing] = useState<InstagramUser[]>([]);

  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [search, setSearch] = useState<string>("");

  const handleCompare = () => {
    if (followers.length === 0 || following.length === 0) {
      return;
    }

    const comparisonResult = compareUsers(followers, following);

    setResult(comparisonResult);
  };

  const canCompare = followers.length > 0 && following.length > 0;

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div
        className="absolute -top-40 -left-40 hidden aspect-square w-96 rounded-full bg-primary/10 blur-3xl opacity-40 sm:block"
        aria-hidden
      />

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-16">
        {/* Header */}
        <header className="mx-auto mb-8 max-w-2xl text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <Badge variant="outline">100% Client-side</Badge>
            <div className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-sm text-muted-foreground">
              Instagram tools
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Instagram Followers Checker
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Find out who does not follow you back. Upload your Instagram
            Followers and Following HTML files to compare privately in your
            browser.
          </p>
        </header>

        {/* Upload */}
        <section className="grid gap-6 md:grid-cols-2">
          <FileUpload
            title="Followers"
            description="Upload your Instagram followers HTML file."
            onUsersParsed={setFollowers}
          />

          <FileUpload
            title="Following"
            description="Upload your Instagram following HTML file."
            onUsersParsed={setFollowing}
          />
        </section>

        {/* Compare */}
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            disabled={!canCompare}
            onClick={handleCompare}
            className="inline-flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Compare lists
          </Button>
        </div>

        {/* Result */}
        {result && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-center">
              Comparison results
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border p-6 text-center hover:shadow-md transition">
                <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <UserCheck className="h-5 w-5" />
                </div>
                <p className="text-sm text-muted-foreground">Mutual</p>

                <p className="mt-2 text-3xl font-bold">
                  {result.mutual.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  People following each other
                </p>
              </div>

              <div className="rounded-xl border p-6 text-center ring-2 ring-destructive/10 shadow-sm bg-card/50 transform-gpu hover:scale-[1.01] transition">
                <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <UserMinus className="h-5 w-5 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Not following back
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {result.notFollowingBack.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  People you follow who do not follow you back
                </p>
              </div>

              <div className="rounded-xl border p-6 text-center hover:shadow-md transition">
                <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <UserPlus className="h-5 w-5" />
                </div>
                <p className="text-sm text-muted-foreground">Not followed by</p>

                <p className="mt-2 text-3xl font-bold">
                  {result.notFollowedBy.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  People who follow you that you do not follow
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    People who do not follow you back
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    You follow these people, but they do not follow you.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative rounded-lg border bg-background px-3 py-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      aria-label="Search username"
                      placeholder="Search username..."
                      className="h-9 w-52 bg-transparent pl-10 text-sm outline-none"
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <UserList users={result.notFollowingBack} search={search} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/primitives";
import { ReplyForm } from "./ReplyForm";

type ThreadRow = {
  id: string;
  title: string;
  excerpt: string | null;
  author_id: string | null;
  created_at: string;
};

type PostRow = {
  id: string;
  body: string;
  author_id: string | null;
  created_at: string;
};

type ProfileRow = { id: string; full_name: string | null };

const BACK_HREF = "/dashboard/team/forum";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function ThreadDetailPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  const supabase = await createClient();
  if (!supabase) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="Sign in to read discussions"
        description="Connect to your account to view and participate in team conversations."
        cta={{ label: "Sign in", href: "/auth/sign-in" }}
      />
    );
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="Sign in to read discussions"
        description="Connect to your account to view and participate in team conversations."
        cta={{ label: "Sign in", href: "/auth/sign-in" }}
      />
    );
  }

  const { data: threadData } = await supabase
    .from("forum_threads")
    .select("id, title, excerpt, author_id, created_at")
    .eq("id", threadId)
    .maybeSingle();

  if (!threadData) {
    return (
      <div className="space-y-6">
        <Link
          href={BACK_HREF}
          className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to discussions
        </Link>
        <EmptyState
          icon={MessageSquare}
          title="Thread not found"
          description="This thread may have been removed or you may not have access."
          cta={{ label: "Back to discussions", href: BACK_HREF }}
        />
      </div>
    );
  }

  const thread = threadData as ThreadRow;

  const { data: postsData } = await supabase
    .from("forum_posts")
    .select("id, body, author_id, created_at")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  const posts = (postsData ?? []) as PostRow[];

  const authorIds = [
    ...(thread.author_id ? [thread.author_id] : []),
    ...posts.map((p) => p.author_id).filter((id): id is string => id !== null),
  ];
  const uniqueAuthorIds = [...new Set(authorIds)];

  const profileMap = new Map<string, string>();
  if (uniqueAuthorIds.length > 0) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", uniqueAuthorIds);
    for (const p of (profileData ?? []) as ProfileRow[]) {
      if (p.full_name) profileMap.set(p.id, p.full_name);
    }
  }

  function authorName(id: string | null): string {
    if (!id) return "Member";
    return profileMap.get(id) ?? "Member";
  }

  return (
    <div className="space-y-6">
      <Link
        href={BACK_HREF}
        className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to discussions
      </Link>

      <header className="rounded-2xl border border-line bg-surface p-6 shadow-soft">
        <h1 className="font-display text-2xl text-navy sm:text-3xl">{thread.title}</h1>
        {thread.excerpt && (
          <p className="mt-2 text-sm text-slate">{thread.excerpt}</p>
        )}
        <p className="mt-3 text-xs text-slate">
          Started by {authorName(thread.author_id)} · {formatDate(thread.created_at)}
        </p>
      </header>

      <section aria-label="Replies">
        <h2 className="mb-3 font-display text-lg text-navy">
          {posts.length} {posts.length === 1 ? "reply" : "replies"}
        </h2>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-paper px-6 py-10 text-center text-sm text-slate">
            No replies yet. Start the conversation.
          </div>
        ) : (
          <ol className="space-y-4">
            {posts.map((post) => (
              <li
                key={post.id}
                className="rounded-xl border border-line bg-surface p-5 shadow-soft"
              >
                <p className="mb-2 text-xs font-semibold text-slate">
                  {authorName(post.author_id)} · {formatDate(post.created_at)}
                </p>
                <p className="whitespace-pre-wrap text-sm text-navy">{post.body}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <ReplyForm threadId={threadId} />
    </div>
  );
}

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import BookmarkList from "@/components/BookmarkList";

interface Bookmark {
  id: string;
  user_id: string;
  url: string;
  title: string;
  created_at: string;
}

export default function Dashboard() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  // ✅ Fetch Bookmarks
  const fetchBookmarks = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  }, []);

  // ✅ Realtime Sync
  const subscribeRealtime = useCallback((userId: string) => {

    supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`
        },
        () => fetchBookmarks(userId)
      )
      .subscribe();
  }, [fetchBookmarks]);

  // ✅ Get Session
  useEffect(() => {

    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.push("/login");
        return;
      }

      setUser(data.session.user);
      fetchBookmarks(data.session.user.id);
      subscribeRealtime(data.session.user.id);
    };

    getSession();

  }, [router, subscribeRealtime, fetchBookmarks]);

  // ✅ Check for OAuth errors
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      const errorDescription = searchParams.get('error_description')?.replace(/\+/g, ' ') || 'Unknown error';
      alert(`Login failed: ${errorDescription}`);
      router.push('/login');
    }
  }, [searchParams, router]);

  // ✅ Add Bookmark
  const addBookmark = async () => {
    if (!url || !title || !user) return;

    const { error } = await supabase.from("bookmarks").insert([
      {
        user_id: user.id,
        url,
        title
      }
    ]);

    if (error) {
      alert("Failed to add bookmark");
      console.error(error);
    } else {
      setUrl("");
      setTitle("");
    }
  };

  // ✅ Delete Bookmark
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
      alert("Failed to delete bookmark");
      console.error(error);
    }
  };

  // ✅ Logout
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: 40 }}>

      <h2>Dashboard</h2>

      <button onClick={logout}>Logout</button>

      <hr />

      <h3>Add Bookmark</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={addBookmark}>
        Add
      </button>

      <hr />

      <h3>Your Bookmarks</h3>

      <BookmarkList bookmarks={bookmarks} onDelete={deleteBookmark} />

    </div>
  );
}
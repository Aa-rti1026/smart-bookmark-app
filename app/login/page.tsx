"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {

  const router = useRouter();

  // ✅ If already logged in → go dashboard
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.push("/dashboard");
      }
    };

    checkUser();
  }, [router]);

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    console.log("Starting Google login...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      console.error("OAuth Error:", error);
      alert(`Login failed: ${error.message}`);
    } else {
      console.log("Login initiated successfully");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Smart Bookmark App</h1>

      <button
        onClick={handleGoogleLogin}
        style={{
          padding: "10px 20px",
          fontSize: 16,
          cursor: "pointer"
        }}
      >
        Login with Google
      </button>
    </div>
  );
}
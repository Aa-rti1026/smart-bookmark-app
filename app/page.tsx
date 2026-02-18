"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <p>Redirecting to login...</p>
    </div>
  );
}
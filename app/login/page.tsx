"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
const redirect = searchParams.get("redirect") || "/";

  // 🔥 Already logged-in user → redirect
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
  router.replace(redirect); // 🔥 yaha change
}
    };
    checkUser();
  }, [router, redirect]);

  // 🔥 GOOGLE LOGIN ONLY
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
       redirectTo: `${window.location.origin}/login?redirect=${redirect}`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Login with Google
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Secure login to book your cabin
        </p>

        {/* 🔥 GOOGLE BUTTON */}
        <button
  onClick={handleGoogleLogin}
  className="w-full bg-white border border-amber-800 py-3 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2"
>
  <span>🔐</span> Continue with Google
</button>

      </div>

    </div>
  );
}
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Invalid credentials");
      setLoading(false);
      return;
    }

    // 🔥 SIMPLE ADMIN CHECK
    if (email !== "admin@staysphere.com") {
      alert("Access denied. Admin only.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    console.log("Login success");
    router.push("/admin/dashboard");
    setLoading(false);
  };

  return (
 <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-gray-100 px-4">
  <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

      <h2 className="text-2xl font-bold text-center mb-2 text-teal-800 tracking-wide">
        Admin Login
      </h2>

      <p className="text-sm text-gray-400 text-center mb-6">
        Login to access Staysphere Admin Panel.
      </p>

      <form onSubmit={handleLogin} className="space-y-5">
        
        <input
          name="email"
          type="email"
          placeholder="Admin Email"
          required
          className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none transition"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:outline-none transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-xl shadow-md hover:shadow-lg transition duration-200 font-medium tracking-wide"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  </div>
);
}
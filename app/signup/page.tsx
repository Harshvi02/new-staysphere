"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Account created successfully ✅");

    router.replace("/login"); // 🔥 login pe bhejo
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 text-sm text-center mb-6">
          Sign up to start booking cabins
        </p>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full border p-3 rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full border p-3 rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700"
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-teal-600">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}
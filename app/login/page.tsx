"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          User Login
        </h1>

        <p className="text-gray-500 text-sm text-center mb-6">
          Login to book your perfect cabin
        </p>

        <form className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
          />

          <button
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700"
          >
            Login
          </button>

        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
  Don&apos;t have an account?{" "}
  <Link href="/register" className="text-teal-600">
    Register
  </Link>
</p>

      </div>

    </div>
  );
}
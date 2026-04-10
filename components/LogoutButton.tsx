"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-400 hover:bg-red-500 text-white py-2 rounded-lg transition"
    >
      Logout
    </button>
  );
}
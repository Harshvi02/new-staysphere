"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CabinForm({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await supabase.from("cabins").insert([
      {
        name,
        type: "Standard",
        price: 1000,
        status: "available",
      },
    ]);

    setName("");
    onAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Cabin Name"
        required
        className="border p-2 rounded mr-2"
      />
      <button className="bg-teal-600 text-white px-4 py-2 rounded">
        Add
      </button>
    </form>
  );
}
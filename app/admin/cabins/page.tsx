"use client";
import Image from "next/image";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ✅ Type update (image_url add किया)
type Cabin = {
  id: string;
  name: string;
  price: number;
  max_guests: number;
  image_url: string;
};

export default function CabinsPage() {
  const [cabins, setCabins] = useState<Cabin[]>([]);

  useEffect(() => {
    const fetchCabins = async () => {
      const { data, error } = await supabase
        .from("cabins")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setCabins(data || []);
      }
    };

    fetchCabins();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this cabin?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("cabins")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed ❌");
    } else {
      alert("Deleted ✅");
      setCabins((prev) => prev.filter((cabin) => cabin.id !== id));
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">Cabins</h1>

        <Link
          href="/admin/cabins/add"
          className="bg-teal-600 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm"
        >
          + Add Cabin
        </Link>
      </div>

      <div className="bg-white shadow rounded-xl border overflow-x-auto">
        <table className="min-w-full text-xs md:text-sm lg:text-base">

          {/* ✅ HEADER UPDATE */}
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 md:p-3 text-left">Image</th>
              <th className="p-2 md:p-3 text-left">Name</th>
              <th className="p-2 md:p-3 text-left">Price</th>
              <th className="p-2 md:p-3 text-left">Guests</th>
              <th className="p-2 md:p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {cabins.map((cabin) => (
              <tr key={cabin.id} className="border-t hover:bg-gray-50">

                {/* ✅ IMAGE COLUMN */}
               <td className="p-2 md:p-4">
  <Image
    src={cabin.image_url}
    alt={cabin.name}
    width={64}
    height={48}
    className="object-cover rounded"
  />
</td>

                <td className="p-2 md:p-4 whitespace-nowrap">
                  {cabin.name}
                </td>

                <td className="p-2 md:p-4 whitespace-nowrap">
                  ₹{cabin.price}
                </td>

                <td className="p-2 md:p-4 whitespace-nowrap">
                  {cabin.max_guests}
                </td>

                <td className="p-2 md:p-4 space-x-2 md:space-x-3 whitespace-nowrap">

                  <Link
                    href={`/admin/cabins/edit/${cabin.id}`}
                    className="text-blue-600 text-xs md:text-sm"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(cabin.id)}
                    className="text-red-600 text-xs md:text-sm"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>

    </div>
  );
}
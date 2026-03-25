"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function EditCabinPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    discount: "",
    capacity: "",
    status: "Available",
    description: "",
    image: null as File | null, // ✅ NEW
  });

  useEffect(() => {
    const fetchCabin = async () => {
      const { data, error } = await supabase
        .from("cabins")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Error loading cabin ❌");
        return;
      }

      if (data) {
        setFormData((prev) => ({
          ...prev,
          name: data.name || "",
          type: data.type || "",
          price: data.price || "",
          discount: data.discount || "",
          capacity: data.max_guests || "",
          status: data.status || "Available",
          description: data.description || "",
        }));
      }
    };

    if (id) fetchCabin();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = "";

    // ✅ अगर नई image select की गई है
    if (formData.image) {
      const fileName = `${Date.now()}-${formData.image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("cabins-images")
        .upload(fileName, formData.image);

      if (uploadError) {
        alert("Image upload failed ❌");
        return;
      }

      const { data } = supabase.storage
        .from("cabins-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("cabins")
      .update({
        name: formData.name,
        price: formData.price,
        max_guests: formData.capacity,
        description: formData.description,
        ...(imageUrl && { image_url: imageUrl }), // ✅ only if new image
      })
      .eq("id", id);

    if (error) {
      alert("Update failed ❌");
    } else {
      alert("Updated ✅");
      router.push("/admin/cabins");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-0">

      <h1 className="text-xl md:text-2xl font-bold mb-6">
        Edit Cabin
      </h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-4 md:p-6 rounded-xl shadow space-y-4"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Cabin Name"
            className="border p-3 rounded-lg w-full"
          />

          <input
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
            placeholder="Cabin Type"
            className="border p-3 rounded-lg w-full"
          />

          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="Price"
            className="border p-3 rounded-lg w-full"
          />

          <input
            type="number"
            value={formData.discount}
            onChange={(e) =>
              setFormData({ ...formData, discount: e.target.value })
            }
            placeholder="Discount (%)"
            className="border p-3 rounded-lg w-full"
          />

          <input
            type="number"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
            placeholder="Capacity (Guests)"
            className="border p-3 rounded-lg w-full"
          />

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="border p-3 rounded-lg w-full"
          >
            <option>Available</option>
            <option>Maintenance</option>
          </select>

        </div>

        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Description"
          rows={4}
          className="border p-3 rounded-lg w-full"
        />

        {/* ✅ NEW IMAGE INPUT */}
        <input
          type="file"
          onChange={(e) =>
            setFormData({
              ...formData,
              image: e.target.files?.[0] || null,
            })
          }
          className="border p-3 rounded-lg w-full"
        />

        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg w-full"
        >
          Update Cabin
        </button>

      </form>

    </div>
  );
}
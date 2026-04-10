"use client";

import { supabase } from "@/lib/supabase";

export default function AddCabinPage() {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value; // ✅ type bhi lo
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const maxGuests = (form.elements.namedItem("capacity") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
    const imageInput = form.elements.namedItem("image") as HTMLInputElement;

    const image = imageInput.files?.[0];

    if (!image) {
      alert("Please select an image");
      return;
    }

    try {
      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("cabins-images")
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("cabins-images")
        .getPublicUrl(fileName);

      const imageUrl = data.publicUrl;

      const { error } = await supabase.from("cabins").insert([
        {
          name,
          type,        // ✅ type save hoga
          description,
          price,
          max_guests: maxGuests,
          image_url: imageUrl,
        },
      ]);

      if (error) throw error;

      alert("Cabin added ✅");
      form.reset();

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Error ❌");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-0">

      <h1 className="text-xl md:text-2xl font-bold mb-6">
        Add New Cabin
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 md:p-6 rounded-xl shadow space-y-4"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* ✅ Cabin Name add kiya */}
          <input
            name="name"
            placeholder="Cabin Name"
            className="border p-3 rounded-lg w-full"
          />

          {/* ✅ Sirf dropdown rakha, duplicate input hata diya */}
          <select name="type" className="border p-3 rounded-lg w-full">
            <option value="">Select Cabin Type</option>
            <option value="Mountain Cabin">Mountain Cabin</option>
            <option value="Beach Cabin">Beach Cabin</option>
            <option value="Luxury Cabin">Luxury Cabin</option>
            <option value="Lakeside Cabin">Lakeside Cabin</option>
            <option value="Standard Cabin">Standard Cabin</option>
            <option value="Ocean View Cabin">Ocean View Cabin</option>
            <option value="Forest Retreat Cabin">Forest Retreat Cabin</option>
          </select>

          <input name="price" type="number" placeholder="Price" className="border p-3 rounded-lg w-full" />
          <input name="discount" type="number" placeholder="Discount (%)" className="border p-3 rounded-lg w-full" />
          <input name="capacity" type="number" placeholder="Capacity (Guests)" className="border p-3 rounded-lg w-full" />

          <select name="status" className="border p-3 rounded-lg w-full">
            <option>Available</option>
            <option>Maintenance</option>
          </select>

        </div>

        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          className="border p-3 rounded-lg w-full"
        />

        <input
          name="image"
          type="file"
          className="border p-3 rounded-lg w-full"
        />

        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg w-full"
        >
          Save Cabin
        </button>

      </form>

    </div>
  );
}
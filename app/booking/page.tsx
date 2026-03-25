"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Cabin = {
  id: string;
  name: string;
  price: number; // 🔥 ADD
};

export default function CreateBookingPage() {

  const [cabins, setCabins] = useState<Cabin[]>([]);

  const [selectedPrice, setSelectedPrice] = useState(0);
  const [nights, setNights] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [aadhaarFront, setAadhaarFront] = useState<File | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<File | null>(null);

  const [frontName, setFrontName] = useState("");
  const [backName, setBackName] = useState("");

  const router = useRouter();

  // 🔥 FETCH WITH PRICE
  useEffect(() => {
    const fetchCabins = async () => {
      const { data } = await supabase
        .from("cabins")
        .select("id, name, price");

      setCabins(data || []);
    };

    fetchCabins();
  }, []);

  // 🔥 CALCULATE NIGHTS
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const diff =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

      setNights(diff > 0 ? diff : 0);
    }
  }, [startDate, endDate]);

  const totalAmount = selectedPrice * nights;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const cabinValue = (form.elements.namedItem("cabin") as HTMLSelectElement).value;

    const guests = Number(
      (form.elements.namedItem("guests") as HTMLInputElement).value
    );

    // VALIDATION
    if (!cabinValue) return alert("Select cabin ❌");
    if (!guests || guests <= 0) return alert("Enter valid guests ❌");

    if (!aadhaarFront || !aadhaarBack)
      return alert("Upload both Aadhaar images ❌");

    if (!aadhaarFront.type.includes("image") || !aadhaarBack.type.includes("image"))
      return alert("Only image allowed ❌");

    if (aadhaarFront.size > 2 * 1024 * 1024)
      return alert("File too large (max 2MB) ❌");

    try {
      const uniqueName = crypto.randomUUID();

      const frontFileName = `aadhaar/${uniqueName}-front.jpg`;
      const backFileName = `aadhaar/${uniqueName}-back.jpg`;

      await supabase.storage
        .from("cabins-images")
        .upload(frontFileName, aadhaarFront);

      await supabase.storage
        .from("cabins-images")
        .upload(backFileName, aadhaarBack);

      // 🔥 SAVE WITH AMOUNT
      const { error } = await supabase.from("bookings").insert([
        {
          cabin_id: cabinValue,
          user_name: name,
          phone: phone,
          start_date: startDate,
          end_date: endDate,
          guests: guests,
          amount: totalAmount, // 🔥 IMPORTANT
          aadhaar_front: frontFileName,
          aadhaar_back: backFileName,
          booking_type: "online",
          status: "confirmed",
        },
      ]);

      if (error) throw error;

      alert("Booking successful ✅");

      form.reset();
      setFrontName("");
      setBackName("");
      setSelectedPrice(0);
      setNights(0);

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Booking failed ❌");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3">

      <h1 className="text-2xl font-semibold mb-6">
        Create Booking
      </h1>

      <div className="bg-white p-5 rounded-2xl shadow-md border">

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >

          <input
            name="name"
            type="text"
            placeholder="Guest Name"
            className="border px-3 py-2 rounded-lg"
          />

          <input
            name="phone"
            type="text"
            placeholder="Phone Number"
            className="border px-3 py-2 rounded-lg"
          />

          {/* 🔥 CABIN + PRICE */}
          <select
            name="cabin"
            defaultValue=""
            className="border px-3 py-2 rounded-lg"
            onChange={(e) => {
              const selected = cabins.find(
                (c) => String(c.id) === e.target.value
              );
              setSelectedPrice(selected?.price || 0);
            }}
          >
            <option value="">Select Cabin</option>

            {cabins.map((cabin) => (
              <option key={cabin.id} value={cabin.id}>
                {cabin.name} (₹{cabin.price})
              </option>
            ))}
          </select>

          <input
            name="guests"
            type="number"
            placeholder="Guests"
            className="border px-3 py-2 rounded-lg"
          />

          <div>
            <label className="text-sm text-gray-600">Check-in</label>
            <input
              name="start"
              type="date"
              className="border px-3 py-2 rounded-lg w-full"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Check-out</label>
            <input
              name="end"
              type="date"
              className="border px-3 py-2 rounded-lg w-full"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* 🔥 AMOUNT */}
          <div className="md:col-span-2 border px-3 py-2 rounded-lg bg-gray-50">
            Amount: ₹ {totalAmount} ({nights} nights)
          </div>

          {/* Aadhaar Upload (UNCHANGED 🔒) */}
          <div className="md:col-span-2">

            <label className="text-sm text-gray-600 block mb-2">
              Upload Aadhaar Card
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">Front Side</p>

                <input
                  type="file"
                  className="w-full"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setAadhaarFront(file || null);
                    setFrontName(file?.name || "");
                  }}
                />

                {frontName && (
                  <p className="text-xs text-gray-400 mt-1">
                    {frontName}
                  </p>
                )}
              </div>

              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">Back Side</p>

                <input
                  type="file"
                  className="w-full"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setAadhaarBack(file || null);
                    setBackName(file?.name || "");
                  }}
                />

                {backName && (
                  <p className="text-xs text-gray-400 mt-1">
                    {backName}
                  </p>
                )}
              </div>

            </div>

          </div>

          <button className="bg-teal-600 text-white py-2.5 rounded-lg md:col-span-2">
            Confirm Booking
          </button>

        </form>

      </div>

    </div>
  );
}
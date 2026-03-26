"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cabin = {
  id: string;
  name: string;
  price: number;
};

export default function CreateBookingPage() {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [price, setPrice] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [aadhaarFront, setAadhaarFront] = useState<File | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<File | null>(null);

  const [frontName, setFrontName] = useState("");
  const [backName, setBackName] = useState("");

  // 🔥 nights calculation
  const calculateNights = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const nights = calculateNights(startDate, endDate);
  const totalAmount = nights * price;

  useEffect(() => {
    const fetchCabins = async () => {
      const { data } = await supabase
        .from("cabins")
        .select("id, name, price");

      setCabins((data as Cabin[]) || []);
    };

    fetchCabins();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const cabinId = (form.elements.namedItem("cabin") as HTMLSelectElement).value;
    const guests = Number((form.elements.namedItem("guests") as HTMLInputElement).value);

    if (!name || !phone || !cabinId || !guests || !aadhaarFront || !aadhaarBack) {
      alert("Fill all fields ❌");
      return;
    }

    const unique = crypto.randomUUID();

    const frontPath = `aadhaar/${unique}-front.jpg`;
    const backPath = `aadhaar/${unique}-back.jpg`;

   await supabase.storage.from("aadhaar-images").upload(frontPath, aadhaarFront);
await supabase.storage.from("aadhaar-images").upload(backPath, aadhaarBack);

    const { error } = await supabase.from("bookings").insert([
      {
        cabin_id: cabinId,
        user_name: name,
        phone,
        start_date: startDate,
        end_date: endDate,
        guests,
        amount: totalAmount, // 🔥 FINAL TOTAL
        aadhaar_front: frontPath,
        aadhaar_back: backPath,
        booking_type: "offline",
        status: "confirmed",
      },
    ]);

    if (error) return alert("Error ❌");

    alert("Booking created ✅");
    form.reset();
    setPrice(0);
    setStartDate("");
    setEndDate("");
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

          {/* Cabin */}
          <select
            name="cabin"
            required
            className="border px-3 py-2 rounded-lg"
            onChange={(e) => {
              const selected = cabins.find(
                (c) => String(c.id) === e.target.value
              );
              setPrice(selected?.price || 0);
            }}
          >
            <option value="">Select Cabin</option>
            {cabins.map((cabin) => (
              <option key={cabin.id} value={String(cabin.id)}>
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

          {/* Dates */}
          <div>
            <label className="text-sm text-gray-600">Check-in</label>
            <input
              name="start"
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Check-out</label>
            <input
              name="end"
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full"
            />
          </div>

          {/* ✅ FINAL AMOUNT */}
          <div className="border px-3 py-2 rounded-lg md:col-span-2 bg-gray-50">
            Amount: ₹ {totalAmount} ({nights} nights)
          </div>

          {/* Aadhaar */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 block mb-2">
              Upload Aadhaar Card
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">Front Side</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setAadhaarFront(file || null);
                    setFrontName(file?.name || "");
                  }}
                />
                {frontName && (
                  <p className="text-xs text-gray-400 mt-1">{frontName}</p>
                )}
              </div>

              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">Back Side</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setAadhaarBack(file || null);
                    setBackName(file?.name || "");
                  }}
                />
                {backName && (
                  <p className="text-xs text-gray-400 mt-1">{backName}</p>
                )}
              </div>

            </div>
          </div>

          <button
            type="submit"
            className="bg-teal-600 text-white py-2.5 rounded-lg md:col-span-2"
          >
            Confirm Booking
          </button>

        </form>

      </div>

    </div>
  );
}
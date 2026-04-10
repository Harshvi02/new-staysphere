"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Booking = {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  cabin_id: string;
  cabinName: string;
  amount: number;
};

const calculateNights = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const diff = (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24);
  return diff > 0 ? Math.round(diff) : 0;
};

const statusStyle = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-600";
    case "rejected":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData.user?.email;

      if (!userEmail) {
        setLoading(false);
        return;
      }

      const { data: bookingsData, error } = await supabase
        .from("bookings")
        .select("id, start_date, end_date, status, cabin_id, amount")
        .eq("email", userEmail)
        .order("start_date", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error.message);
        setLoading(false);
        return;
      }

      const { data: cabinsData } = await supabase
        .from("cabins")
        .select("id, name");

      const merged = (bookingsData || []).map((b) => ({
        ...b,
        cabinName:
          cabinsData?.find((c) => String(c.id) === String(b.cabin_id))?.name ||
          "N/A",
      }));

      setBookings(merged);
      setLoading(false);
    };

    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      alert("Cancel failed ❌");
    } else {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
    }
  };

  // ✅ NEW: Delete function
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this booking permanently? This action cannot be undone.")) return;

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed ❌");
    } else {
      setBookings((prev) => prev.filter((b) => b.id !== id));
      alert("✅ Booking deleted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Bookings</h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            View and manage your cabin stays
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">

        {loading && (
          <div className="text-center py-20 text-gray-400">
            Loading your bookings...
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏕️</p>
            <p className="text-gray-600 font-semibold text-lg">
              No bookings yet!
            </p>
            <p className="text-gray-400 text-sm mt-1 mb-6">
              Explore our cabins and book your perfect stay.
            </p>
            <Link
              href="/cabins"
              className="bg-teal-600 text-white px-6 py-2.5 rounded-xl hover:bg-teal-700 transition"
            >
              Explore Cabins
            </Link>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const nights = calculateNights(
                booking.start_date,
                booking.end_date
              );

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-teal-50 text-teal-600 rounded-xl w-12 h-12 flex items-center justify-center text-2xl shrink-0">
                      🏠
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-800 text-base">
                        {booking.cabinName}
                      </h2>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {booking.start_date} → {booking.end_date} &nbsp;·&nbsp;
                        {nights} {nights === 1 ? "night" : "nights"}
                      </p>
                      <p className="text-teal-600 font-bold text-sm mt-1">
                        ₹{booking.amount || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyle(booking.status)}`}>
                      {booking.status || "confirmed"}
                    </span>

                    <Link
                      href={`/cabins/${booking.cabin_id}`}
                      className="text-xs border border-teal-200 text-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition"
                    >
                      View Cabin
                    </Link>

                    <Link
                      href={`/booking?cabinId=${booking.cabin_id}`}
                      className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                    >
                      Book Again
                    </Link>

                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                      >
                        Cancel
                      </button>
                    )}

                    {/* ✅ DELETE BUTTON - Always visible for all bookings */}
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-xs border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-10">
          Need help? Contact us at{" "}
          <span className="text-teal-600">support@staysphere.com</span>
        </p>

      </section>
    </div>
  );
}
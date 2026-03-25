"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// ✅ FIXED TYPE (guests removed)
type Booking = {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  cabins: {
    name: string;
  }[];
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          start_date,
          end_date,
          status,
          cabins!inner(name)
        `)
        .order("start_date", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error.message);
      } else {
        setBookings(data || []);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>

      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-12">

        <h1 className="text-2xl font-bold mb-6">
          My Bookings
        </h1>

        <div className="bg-white rounded-xl shadow border overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Cabin</th>
                <th className="p-3 text-left">Check-in</th>
                <th className="p-3 text-left">Check-out</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>

              {bookings.map((booking) => (
                <tr key={booking.id} className="border-t">

                  {/* Cabin Name */}
                  <td className="p-3">
                    {booking.cabins?.[0]?.name || "N/A"}
                  </td>

                  {/* Dates */}
                  <td className="p-3">
                    {booking.start_date}
                  </td>

                  <td className="p-3">
                    {booking.end_date}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      {booking.status || "Confirmed"}
                    </span>
                  </td>

                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}
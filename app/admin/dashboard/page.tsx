"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Booking = {
  id: string;
  user_name: string;
  start_date: string;
  end_date: string;
  booking_type: string;
  cabin_id: string;
};

type Cabin = {
  id: string;
  name: string;
};

export default function DashboardPage() {
  const [totalCabins, setTotalCabins] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [onlineBookings, setOnlineBookings] = useState(0);
  const [offlineBookings, setOfflineBookings] = useState(0);
  const [checkinsToday, setCheckinsToday] = useState(0);
  const [checkoutsToday, setCheckoutsToday] = useState(0);

  const [recentBookings, setRecentBookings] = useState<
    (Booking & { cabinName: string })[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: cabinsData } = await supabase
        .from("cabins")
        .select("id, name");

      setTotalCabins(cabinsData?.length || 0);

      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*")
        .order("id", { ascending: false });

      const bookings = (bookingsData as Booking[]) || [];

      setTotalBookings(bookings.length);

      setOnlineBookings(
        bookings.filter((b) => b.booking_type === "online").length
      );

      setOfflineBookings(
        bookings.filter((b) => b.booking_type === "offline").length
      );

      const today = new Date().toISOString().split("T")[0];

      setCheckinsToday(
        bookings.filter((b) => b.start_date === today).length
      );

      setCheckoutsToday(
        bookings.filter((b) => b.end_date === today).length
      );

      const recent = bookings.slice(0, 5).map((b) => {
        const cabin = cabinsData?.find(
          (c: Cabin) => String(c.id) === String(b.cabin_id)
        );

        return {
          ...b,
          cabinName: cabin ? cabin.name : "N/A",
        };
      });

      setRecentBookings(recent);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">

      {/* Title */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* ✅ STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">

        {/* Card */}
        {[
          {
            label: "Total Cabins",
            value: totalCabins,
            icon: "🏠",
            color: "bg-teal-100 text-teal-600",
          },
          {
            label: "Total Bookings",
            value: totalBookings,
            icon: "📦",
            color: "bg-blue-100 text-blue-600",
          },
          {
            label: "Online Bookings",
            value: onlineBookings,
            icon: "🌐",
            color: "bg-green-100 text-green-600",
          },
          {
            label: "Offline Bookings",
            value: offlineBookings,
            icon: "🧾",
            color: "bg-indigo-100 text-indigo-600",
          },
          {
            label: "Check-ins Today",
            value: checkinsToday,
            icon: "📥",
            color: "bg-yellow-100 text-yellow-600",
          },
          {
            label: "Check-outs Today",
            value: checkoutsToday,
            icon: "📤",
            color: "bg-red-100 text-red-600",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-gradient-to-r from-white to-gray-50 p-5 rounded-2xl shadow-md border hover:shadow-lg transition flex items-center gap-4 h-full"
          >
            <div
              className={`${card.color} w-10 h-10 flex items-center justify-center rounded-full text-lg`}
            >
              {card.icon}
            </div>

            <div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {card.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ RECENT BOOKINGS */}
      <div className="bg-white rounded-2xl shadow border p-4 md:p-6">

        <h2 className="text-lg font-semibold mb-4">
          Recent Bookings
        </h2>

        <div className="overflow-x-auto max-h-[400px] overflow-y-auto rounded-xl">

          <table className="w-full text-sm">

            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left">Guest</th>
                <th className="p-3 text-left">Cabin</th>
                <th className="p-3 text-left">Check-in</th>
                <th className="p-3 text-left">Check-out</th>
                <th className="p-3 text-left">Type</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-3">{b.user_name}</td>
                  <td className="p-3">{b.cabinName}</td>
                  <td className="p-3">{b.start_date}</td>
                  <td className="p-3">{b.end_date}</td>

                  <td className="p-3">
                    {b.booking_type === "online" ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        Online
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        Offline
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Loader from "@/components/Loader";

type Booking = {
  id: string;
  user_name: string;
  start_date: string;
  end_date: string;
  booking_type: string;
  cabin_id: string;
  amount?: number;
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
  const [loading, setLoading] = useState(true);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [dayFilter, setDayFilter] = useState(30);
  const [todayArrivals, setTodayArrivals] = useState<(Booking & { cabinName: string })[]>([]);
  const [todayDepartures, setTodayDepartures] = useState<(Booking & { cabinName: string })[]>([]);
  const [stayDuration, setStayDuration] = useState({ short: 0, medium: 0, long: 0, veryLong: 0 });

  const [recentBookings, setRecentBookings] = useState<
    (Booking & { cabinName: string })[]
  >([]);

  // Helper function to get local date string (YYYY-MM-DD)
  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: cabinsData } = await supabase
        .from("cabins")
        .select("id, name");

      setTotalCabins(cabinsData?.length || 0);

      // ✅ FIXED: Use local date for fromDate
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - dayFilter);
      const fromDateStr = getLocalDateString(fromDate);

      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*")
        .gte("start_date", fromDateStr)
        .order("id", { ascending: false });

      const bookings = (bookingsData as Booking[]) || [];

      setTotalBookings(bookings.length);
      setOnlineBookings(bookings.filter((b) => b.booking_type === "online").length);
      setOfflineBookings(bookings.filter((b) => b.booking_type === "offline").length);

      // ✅ FIXED: Use local date for today
      const today = getLocalDateString(new Date());

      setCheckinsToday(bookings.filter((b) => b.start_date === today).length);
      setCheckoutsToday(bookings.filter((b) => b.end_date === today).length);

      const revenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
      setTotalRevenue(revenue);

      const totalDays = dayFilter * (cabinsData?.length || 1);
      const bookedDays = bookings.reduce((sum, b) => {
        const start = new Date(b.start_date);
        const end = new Date(b.end_date);
        const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        return sum + (diff > 0 ? diff : 0);
      }, 0);
      setOccupancyRate(Math.min(100, Math.round((bookedDays / totalDays) * 100)));

      // ✅ FIXED: Use local date for arrivals/departures
      const arrivals = bookings
        .filter((b) => b.start_date === today)
        .map((b) => ({
          ...b,
          cabinName: cabinsData?.find((c: Cabin) => String(c.id) === String(b.cabin_id))?.name || "N/A",
        }));

      const departures = bookings
        .filter((b) => b.end_date === today)
        .map((b) => ({
          ...b,
          cabinName: cabinsData?.find((c: Cabin) => String(c.id) === String(b.cabin_id))?.name || "N/A",
        }));

      setTodayArrivals(arrivals);
      setTodayDepartures(departures);

      let short = 0, medium = 0, long = 0, veryLong = 0;
      bookings.forEach((b) => {
        const diff = (new Date(b.end_date).getTime() - new Date(b.start_date).getTime()) / (1000 * 60 * 60 * 24);
        if (diff <= 2) short++;
        else if (diff <= 3) medium++;
        else if (diff <= 5) long++;
        else veryLong++;
      });
      setStayDuration({ short, medium, long, veryLong });

      const recent = bookings.slice(0, 5).map((b) => {
        const cabin = cabinsData?.find((c: Cabin) => String(c.id) === String(b.cabin_id));
        return { ...b, cabinName: cabin ? cabin.name : "N/A" };
      });
      setRecentBookings(recent);

      setLoading(false);
    };

    fetchData();
  }, [dayFilter]);

  if (loading) {
    return <Loader />;
  }

  const totalStay = stayDuration.short + stayDuration.medium + stayDuration.long + stayDuration.veryLong || 1;

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Dashboard</h1>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDayFilter(d)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                dayFilter === d
                  ? "bg-teal-100 text-teal-700 border border-teal-300"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-teal-50"
              }`}
            >
              Last {d} days
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
        {[
          { label: "Total Cabins", value: totalCabins, icon: "🏠", color: "bg-teal-100 text-teal-600" },
          { label: "Total Bookings", value: totalBookings, icon: "📦", color: "bg-blue-100 text-blue-600" },
          { label: "Online Bookings", value: onlineBookings, icon: "🌐", color: "bg-green-100 text-green-600" },
          { label: "Offline Bookings", value: offlineBookings, icon: "🧾", color: "bg-indigo-100 text-indigo-600" },
          { label: "Check-ins Today", value: checkinsToday, icon: "📥", color: "bg-yellow-100 text-yellow-600" },
          { label: "Check-outs Today", value: checkoutsToday, icon: "📤", color: "bg-red-100 text-red-600" },
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: "💰", color: "bg-emerald-100 text-emerald-600" },
          { label: "Occupancy Rate", value: `${occupancyRate}%`, icon: "📊", color: "bg-purple-100 text-purple-600" },
        ].map((card, i) => (
          <div key={i} className="bg-gradient-to-r from-white to-gray-50 p-5 rounded-2xl shadow-md hover:shadow-lg transition flex items-center gap-4 h-full">
            <div className={`${card.color} w-10 h-10 flex items-center justify-center rounded-full text-lg`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <h2 className="text-2xl font-bold text-gray-800 mt-1">{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Today's Arrivals & Departures */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Today</h2>

          {todayArrivals.length === 0 && todayDepartures.length === 0 && (
            <p className="text-gray-400 text-sm">No arrivals or departures today</p>
          )}

          <div className="space-y-2">
            {todayArrivals.map((b) => {
              const nights = Math.round(
                (new Date(b.end_date).getTime() - new Date(b.start_date).getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium w-20 text-center">
                    ARRIVING
                  </span>
                  <span className="text-sm font-medium text-gray-800 w-28">{b.user_name}</span>
                  <span className="text-xs text-gray-400 flex-1">{b.cabinName}</span>
                  <span className="text-xs text-gray-500">{nights} nights</span>
                  <span className="bg-teal-100 text-teal-700 text-xs px-3 py-1 rounded-full font-medium">
                    CHECK IN
                  </span>
                </div>
              );
            })}

            {todayDepartures.map((b) => {
              const nights = Math.round(
                (new Date(b.end_date).getTime() - new Date(b.start_date).getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium w-20 text-center">
                    DEPARTING
                  </span>
                  <span className="text-sm font-medium text-gray-800 w-28">{b.user_name}</span>
                  <span className="text-xs text-gray-400 flex-1">{b.cabinName}</span>
                  <span className="text-xs text-gray-500">{nights} nights</span>
                  <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
                    CHECK OUT
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stay Duration Summary */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Stay Duration Summary</h2>
          <div className="space-y-3">
            {[
              { label: "1-2 nights", value: stayDuration.short, color: "bg-blue-300" },
              { label: "3 nights", value: stayDuration.medium, color: "bg-pink-300" },
              { label: "4-5 nights", value: stayDuration.long, color: "bg-green-300" },
              { label: "6+ nights", value: stayDuration.veryLong, color: "bg-teal-300" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-800">{item.value}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${(item.value / totalStay) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
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
                <tr key={b.id} className="border-t hover:bg-gray-50 transition duration-200">
                  <td className="p-3">{b.user_name}</td>
                  <td className="p-3">{b.cabinName}</td>
                  <td className="p-3">{b.start_date}</td>
                  <td className="p-3">{b.end_date}</td>
                  <td className="p-3">
                    {b.booking_type === "online" ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Online</span>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Offline</span>
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
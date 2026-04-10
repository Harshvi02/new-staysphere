"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Loader from "@/components/Loader";
import ImageViewer from "@/components/ImageViewer";

type Booking = {
  id: string;
  user_name: string;
  phone: string;
  email?: string;
  start_date: string;
  end_date: string;
  guests: number;
  booking_type: string;
  status: string;
  aadhaar_front: string;
  aadhaar_back: string;
  cabin_id: string;
  amount?: number;
  payment_status?: string;
  cabinName?: string;
  frontUrl?: string;
  backUrl?: string;
};

type Cabin = {
  id: string;
  name: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [viewerImage, setViewerImage] = useState<{ src: string; alt: string } | null>(null);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete booking?")) return;
    await supabase.from("bookings").delete().eq("id", id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const { data: bookingsData } = await supabase.from("bookings").select("*");
      const { data: cabinsData } = await supabase.from("cabins").select("id, name");

      if (!cabinsData) {
        setLoading(false);
        return;
      }

      const updated: Booking[] = await Promise.all(
        (bookingsData || []).map(async (b) => {
          const cabin = cabinsData.find((c: Cabin) => String(c.id) === String(b.cabin_id));
          let frontUrl = "", backUrl = "";

          if (b.aadhaar_front) {
            const { data } = await supabase.storage.from("aadhaar-images").createSignedUrl(b.aadhaar_front, 600);
            frontUrl = data?.signedUrl || "";
          }
          if (b.aadhaar_back) {
            const { data } = await supabase.storage.from("aadhaar-images").createSignedUrl(b.aadhaar_back, 600);
            backUrl = data?.signedUrl || "";
          }

          return { ...b, cabinName: cabin ? cabin.name : "Not Found ❌", frontUrl, backUrl };
        })
      );

      setBookings(updated);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  if (loading) return <Loader />;

  let filteredBookings = [...bookings];
  const today = new Date().toISOString().split("T")[0];

  if (filter === "checkedin") {
    filteredBookings = filteredBookings.filter((b) => b.start_date <= today && b.end_date >= today);
  } else if (filter === "checkedout") {
    filteredBookings = filteredBookings.filter((b) => b.end_date < today);
  } else if (filter === "unconfirmed") {
    filteredBookings = filteredBookings.filter((b) => b.status !== "confirmed");
  } else if (filter === "confirmed") {
    filteredBookings = filteredBookings.filter((b) => b.status === "confirmed");
  }

  filteredBookings.sort((a, b) => {
    if (sort === "recent") {
      return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    } else {
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-0">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Bookings
        </h1>
        <Link
          href="/admin/bookings/create"
          className="bg-teal-600 text-white px-4 py-2 rounded-lg"
        >
          + Create Booking
        </Link>
      </div>

      {/* FILTER BUTTONS - PEHLE JAISE HI */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {[
          { label: "All", value: "all" },
          { label: "Checked in", value: "checkedin" },
          { label: "Checked out", value: "checkedout" },
          { label: "Unconfirmed", value: "unconfirmed" },
          { label: "Confirmed", value: "confirmed"},
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1 rounded text-sm ${
              filter === f.value
                ? "bg-teal-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}
        <select
          onChange={(e) => setSort(e.target.value)}
          className="ml-auto bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
        >
          <option value="recent">Sort by date (recent first)</option>
          <option value="old">Sort by date (earlier first)</option>
        </select>
      </div>

      {/* TABLE WITH SHADOW AND BETTER STYLING */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1200px]">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Guest</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Cabin</th>
                <th className="p-3 text-left">Check-in</th>
                <th className="p-3 text-left">Check-out</th>
                <th className="p-3 text-left">Guests</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Aadhaar</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b, index) => (
                <tr 
                  key={b.id} 
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-all duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  <td className="p-3 font-medium">{b.user_name}</td>
                  <td className="p-3">{b.phone}</td>
                  <td className="p-3">{b.email || "-"}</td>
                  <td className="p-3">{b.cabinName}</td>
                  <td className="p-3">{b.start_date}</td>
                  <td className="p-3">{b.end_date}</td>
                  <td className="p-3">{b.guests}</td>
                  <td className="p-3 font-medium text-green-700">₹ {b.amount || 0}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      b.booking_type === "online"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {b.booking_type === "online" ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {b.frontUrl ? (
                        <Image
                          src={b.frontUrl}
                          alt="front"
                          width={40}
                          height={30}
                          className="cursor-pointer rounded border border-gray-200 shadow-sm hover:shadow-md transition-all hover:scale-105"
                          unoptimized
                          onClick={() => setViewerImage({ src: b.frontUrl!, alt: "Aadhaar Front" })}
                        />
                      ) : (
                        <div className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400">No img</div>
                      )}
                      {b.backUrl ? (
                        <Image
                          src={b.backUrl}
                          alt="back"
                          width={40}
                          height={30}
                          className="cursor-pointer rounded border border-gray-200 shadow-sm hover:shadow-md transition-all hover:scale-105"
                          unoptimized
                          onClick={() => setViewerImage({ src: b.backUrl!, alt: "Aadhaar Back" })}
                        />
                      ) : (
                        <div className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400">No img</div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    {b.payment_status === "paid" ? (
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: '#10b981',
                        color: 'white'
                      }}>
                        ✅ Paid
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: '#e2a83d',
                        color: 'white'
                      }}>
                        ⏳ Pending
                      </span>
                    )}
                  </td>
                  <td className="p-3">
  <button
    onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: Math.max(10, rect.right - 140),
      });
      setOpenId(openId === b.id ? null : b.id);
    }}
    className="px-2 py-1 rounded text-xs bg-gray-100 flex items-center gap-1 hover:bg-gray-200 transition-colors"
  >
    <span className={`px-2 py-1 rounded text-xs ${
      b.status === "confirmed"
        ? "bg-green-100 text-green-700"
        : b.status === "cancelled"
        ? "bg-yellow-100 text-yellow-700"
        : b.status === "pending_payment"
        ? "bg-orange-100 text-orange-700"  // optional: orange color for pending payment
        : "bg-red-100 text-red-700"
    }`}>
      {b.status === "pending_payment" ? "Pending Payment" : b.status}
    </span>
    ⋮
  </button>
</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {openId && (
        <div
          style={{
            position: "absolute",
            top: dropdownPos.top,
            left: dropdownPos.left,
          }}
          className="bg-white border rounded-lg shadow-lg text-sm z-[9999] w-36 py-1"
        >
          <button
            onClick={() => {
              updateStatus(openId, "confirmed");
              setOpenId(null);
            }}
            className="block px-3 py-2 hover:bg-gray-100 w-full text-left"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              updateStatus(openId, "cancelled");
              setOpenId(null);
            }}
            className="block px-3 py-2 hover:bg-gray-100 w-full text-left"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateStatus(openId, "rejected");
              setOpenId(null);
            }}
            className="block px-3 py-2 hover:bg-gray-100 w-full text-left"
          >
            Reject
          </button>
          <button
            onClick={() => {
              deleteBooking(openId);
              setOpenId(null);
            }}
            className="block px-3 py-2 hover:bg-red-100 text-red-600 w-full text-left"
          >
            Delete
          </button>
        </div>
      )}

      {/* Image Viewer Modal */}
      {viewerImage && (
        <ImageViewer
          src={viewerImage.src}
          alt={viewerImage.alt}
          onClose={() => setViewerImage(null)}
        />
      )}
    </div>
  );
}
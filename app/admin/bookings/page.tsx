"use client";

import Link from "next/link";

export default function BookingsPage() {
  return (
    <div className="max-w-6xl mx-auto px-2 md:px-0">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Bookings</h1>

        <Link
          href="/admin/bookings/create"
          className="bg-teal-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-teal-700 text-xs md:text-sm"
        >
          + Create Booking
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">

        <table className="min-w-full text-xs md:text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 md:p-3 text-left">Guest</th>
              <th className="p-2 md:p-3 text-left">Cabin</th>
              <th className="p-2 md:p-3 text-left">Check-in</th>
              <th className="p-2 md:p-3 text-left">Check-out</th>
              <th className="p-2 md:p-3 text-left">Guests</th>
              <th className="p-2 md:p-3 text-left">Type</th>
              <th className="p-2 md:p-3 text-left">Status</th>
              <th className="p-2 md:p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-t hover:bg-gray-50">

              <td className="p-2 md:p-3 whitespace-nowrap">
                Rahul Sharma
              </td>

              <td className="p-2 md:p-3 whitespace-nowrap">
                Deluxe Room
              </td>

              <td className="p-2 md:p-3 whitespace-nowrap">
                12 May
              </td>

              <td className="p-2 md:p-3 whitespace-nowrap">
                15 May
              </td>

              <td className="p-2 md:p-3 whitespace-nowrap">
                2
              </td>

              <td className="p-2 md:p-3 whitespace-nowrap">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  Online
                </span>
              </td>

              <td className="p-2 md:p-3 whitespace-nowrap">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                  Confirmed
                </span>
              </td>

              <td className="p-2 md:p-3 space-x-2 md:space-x-3 whitespace-nowrap">

                <button className="text-blue-600 hover:underline text-xs md:text-sm">
                  View
                </button>

                <button className="text-red-600 hover:underline text-xs md:text-sm">
                  Cancel
                </button>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}
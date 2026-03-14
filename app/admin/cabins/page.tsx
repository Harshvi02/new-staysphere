"use client";

import Link from "next/link";

export default function CabinsPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">Cabins</h1>

        <Link
          href="/admin/cabins/add"
          className="bg-teal-600 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm"
        >
          + Add Cabin
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white shadow rounded-xl border overflow-x-auto">

        <table className="min-w-full text-xs md:text-sm lg:text-base">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 md:p-3 text-left">Name</th>
              <th className="p-2 md:p-3 text-left">Type</th>
              <th className="p-2 md:p-3 text-left">Price</th>
              <th className="p-2 md:p-3 text-left">Status</th>
              <th className="p-2 md:p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-t hover:bg-gray-50">

              <td className="p-2 md:p-4 whitespace-nowrap">
                Deluxe Room
              </td>

              <td className="p-2 md:p-4 whitespace-nowrap">
                Deluxe
              </td>

              <td className="p-2 md:p-4 whitespace-nowrap">
                ₹2000
              </td>

              <td className="p-2 md:p-4 whitespace-nowrap">
                <span className="bg-green-100 text-green-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                  Available
                </span>
              </td>

              <td className="p-2 md:p-4 space-x-2 md:space-x-3 whitespace-nowrap">

                <button className="text-blue-600 text-xs md:text-sm">
                  Edit
                </button>

                <button className="text-red-600 text-xs md:text-sm">
                  Delete
                </button>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}
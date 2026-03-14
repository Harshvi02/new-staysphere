"use client";

export default function UsersPage() {
  return (
    <div className="max-w-6xl mx-auto px-2 md:px-0">

      {/* Page Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold">
          Users
        </h1>

        <p className="text-xs md:text-sm text-gray-500">
          Total Users: 1
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">

        <table className="min-w-full text-xs md:text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 md:p-3 text-left">Name</th>
              <th className="p-2 md:p-3 text-left">Email</th>
              <th className="p-2 md:p-3 text-left">Phone</th>
              <th className="p-2 md:p-3 text-left">Total Bookings</th>
              <th className="p-2 md:p-3 text-left">Joined</th>
              <th className="p-2 md:p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-t hover:bg-gray-50">

              <td className="p-2 md:p-3 whitespace-nowrap">
                Rahul Sharma
              </td>

              <td className="p-2 md:p-3 whitespace-nowrap">
                rahul@email.com
              </td>

              <td className="p-2 md:p-3 whitespace-nowrap">
                9876543210
              </td>

              <td className="p-2 md:p-3 whitespace-nowrap">
                2
              </td>

              <td className="p-2 md:p-3 whitespace-nowrap">
                12 May 2025
              </td>

              <td className="p-2 md:p-3 space-x-2 md:space-x-3 whitespace-nowrap">

                <button className="text-blue-600 hover:underline text-xs md:text-sm">
                  View
                </button>

                <button className="text-red-600 hover:underline text-xs md:text-sm">
                  Block
                </button>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}
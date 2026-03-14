"use client";

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Title */}
      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        <div className="bg-white p-4 md:p-6 rounded-xl shadow border hover:shadow-lg transition">
          <p className="text-gray-500 text-xs md:text-sm">Total Cabins</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-1">12</h2>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow border hover:shadow-lg transition">
          <p className="text-gray-500 text-xs md:text-sm">Total Bookings</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-1">34</h2>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow border hover:shadow-lg transition">
          <p className="text-gray-500 text-xs md:text-sm">Online Bookings</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-1">20</h2>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow border hover:shadow-lg transition">
          <p className="text-gray-500 text-xs md:text-sm">Offline Bookings</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-1">14</h2>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow border hover:shadow-lg transition">
          <p className="text-gray-500 text-xs md:text-sm">Check-ins Today</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-1">5</h2>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow border hover:shadow-lg transition">
          <p className="text-gray-500 text-xs md:text-sm">Check-outs Today</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-1">3</h2>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow border md:col-span-2">
          <p className="text-gray-500 text-xs md:text-sm">Total Revenue</p>
          <h2 className="text-2xl md:text-3xl font-bold text-green-600 mt-1">
            ₹1,20,000
          </h2>
        </div>

      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow border p-4 md:p-6">

        <h2 className="text-lg font-semibold mb-4">
          Recent Bookings
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-xs md:text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 md:p-3 text-left">Guest</th>
                <th className="p-2 md:p-3 text-left">Cabin</th>
                <th className="p-2 md:p-3 text-left">Check-in</th>
                <th className="p-2 md:p-3 text-left">Check-out</th>
                <th className="p-2 md:p-3 text-left">Type</th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-t hover:bg-gray-50">
                <td className="p-2 md:p-3">Rahul Sharma</td>
                <td className="p-2 md:p-3">Deluxe Room</td>
                <td className="p-2 md:p-3">12 May</td>
                <td className="p-2 md:p-3">15 May</td>
                <td className="p-2 md:p-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Online
                  </span>
                </td>
              </tr>

              <tr className="border-t hover:bg-gray-50">
                <td className="p-2 md:p-3">Amit Patel</td>
                <td className="p-2 md:p-3">Suite Room</td>
                <td className="p-2 md:p-3">14 May</td>
                <td className="p-2 md:p-3">16 May</td>
                <td className="p-2 md:p-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    Offline
                  </span>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
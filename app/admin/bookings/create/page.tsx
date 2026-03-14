"use client";

import { useState } from "react";

export default function CreateBookingPage() {

  const [fileName, setFileName] = useState("");

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-0">

      <h1 className="text-xl md:text-2xl font-bold mb-6">
        Create Booking
      </h1>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow border">

        {/* FORM */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

          {/* Guest Name */}
          <input
            type="text"
            placeholder="Guest Name"
            className="border p-3 rounded-lg w-full"
          />

          {/* Phone */}
          <input
            type="text"
            placeholder="Phone Number"
            className="border p-3 rounded-lg w-full"
          />

          {/* Cabin */}
          <select className="border p-3 rounded-lg w-full md:col-span-2">
            <option>Select Cabin</option>
            <option>Deluxe Room</option>
            <option>Suite Room</option>
          </select>

          {/* Check-in */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Check-in Date
            </label>

            <input
              type="date"
              className="border p-3 rounded-lg w-full"
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Check-out Date
            </label>

            <input
              type="date"
              className="border p-3 rounded-lg w-full"
            />
          </div>

          {/* Guests */}
          <input
            type="number"
            placeholder="Number of Guests"
            className="border p-3 rounded-lg w-full"
          />

          {/* Booking Type */}
          <select className="border p-3 rounded-lg w-full">
            <option>Offline Booking</option>
          </select>

          {/* Aadhar Upload */}
          <div className="md:col-span-2">

            <label className="text-sm text-gray-600 block mb-1">
              Upload Aadhar Card (ID Verification)
            </label>

            <input
              type="file"
              className="border p-3 rounded-lg w-full"
              onChange={(e) =>
                setFileName(e.target.files?.[0]?.name || "")
              }
            />

            {fileName && (
              <p className="text-sm text-gray-500 mt-1">
                Selected: {fileName}
              </p>
            )}

          </div>

          {/* Button */}
          <button
            type="submit"
            className="bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 md:col-span-2"
          >
            Confirm Booking
          </button>

        </form>

        {/* Booking Summary */}
        <div className="bg-gray-50 p-4 rounded-lg border mt-6">

          <h3 className="font-semibold mb-2">
            Booking Summary
          </h3>

          <p>Cabin: Deluxe Room</p>
          <p>Guests: 2</p>
          <p>Booking Type: Offline</p>

        </div>

      </div>

    </div>
  );
}
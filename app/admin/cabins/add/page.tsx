"use client";

export default function AddCabinPage() {
  return (
    <div className="max-w-4xl mx-auto px-2 md:px-0">

      <h1 className="text-xl md:text-2xl font-bold mb-6">
        Add New Cabin
      </h1>

      <form className="bg-white p-4 md:p-6 rounded-xl shadow space-y-4">

        {/* Grid Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            placeholder="Cabin Name"
            className="border p-3 rounded-lg w-full"
          />

          <input
            placeholder="Cabin Type"
            className="border p-3 rounded-lg w-full"
          />

          <input
            type="number"
            placeholder="Price"
            className="border p-3 rounded-lg w-full"
          />

          <input
            type="number"
            placeholder="Discount (%)"
            className="border p-3 rounded-lg w-full"
          />

          <input
            type="number"
            placeholder="Capacity (Guests)"
            className="border p-3 rounded-lg w-full"
          />

          <select className="border p-3 rounded-lg w-full">
            <option>Available</option>
            <option>Maintenance</option>
          </select>

        </div>

        {/* Description */}
        <textarea
          placeholder="Description"
          rows={4}
          className="border p-3 rounded-lg w-full"
        />

        {/* Image Upload */}
        <input
          type="file"
          className="border p-3 rounded-lg w-full"
        />

        {/* Button */}
        <button
          className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg w-full"
        >
          Save Cabin
        </button>

      </form>

    </div>
  );
}
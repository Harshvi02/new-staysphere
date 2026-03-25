import Link from "next/link";
import Image from "next/image";

// ✅ props add करो
type Cabin = {
  id: string;
  name: string;
  price: number;
  max_guests: number;
  image_url: string;
};

export default function CabinCard({ cabin }: { cabin: Cabin }) {
  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition">

      {/* IMAGE */}
      <div className="relative w-full h-48">
        <Image
          src={cabin.image_url || "/cabin.jpg"}
          alt={cabin.name}
          fill
          className="object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">

        <h3 className="font-semibold text-lg">
          {cabin.name}
        </h3>

        <p className="text-gray-500 text-sm mt-1">
          Capacity: {cabin.max_guests} Guests
        </p>

        <p className="text-teal-600 font-bold mt-2">
          ₹{cabin.price} / night
        </p>

        {/* ✅ FIXED LINK */}
        <Link
          href={`/cabins/${cabin.id}`}
          className="block mt-4 text-center bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}
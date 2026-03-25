import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-teal-50">

      <div className="max-w-7xl mx-auto px-4 py-20 text-center">

        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          Smart Resort Booking
        </h1>

        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          Book premium cabins and enjoy a relaxing stay with StaySphere.
        </p>

        <Link
          href="/cabins"
          className="inline-block mt-6 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
        >
          Explore Cabins
        </Link>

      </div>

    </section>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-teal-700 transition">
        Home
      </Link>

      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;

        return (
          <span key={index} className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>

            {isLast ? (
              <span className="capitalize text-gray-700 font-medium">
                {segment.replace("-", " ")}
              </span>
            ) : (
              <Link
                href={href}
                className="capitalize hover:text-teal-700 transition"
              >
                {segment.replace("-", " ")}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
//import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <Navbar />

      {/* Hero Section with Gradient */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-16">
  <div className="max-w-7xl mx-auto px-4 text-center">
    <h1 className="text-4xl md:text-5xl font-bold mb-4">About StaySphere</h1>
    <p className="text-teal-100 text-lg max-w-2xl mx-auto">
      Discover your perfect escape — book a cabin and enjoy nature at its finest.
    </p>
  </div>
</section>

      {/* Mission Section - New */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <div className="w-20 h-1 bg-teal-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            To provide unforgettable nature experiences through handpicked cabins, 
            combining comfort with the serenity of the great outdoors.
          </p>
        </div>
      </section>

      {/* Story Section with Image */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Our Story
              </h2>
              <div className="w-16 h-1 bg-teal-500 mb-6 rounded-full"></div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                StaySphere was born from a simple idea — to help people reconnect with nature 
                without compromising on comfort. What started as a small collection of handpicked 
                cabins has grown into a trusted platform for unique stays.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we're proud to offer a carefully curated selection of cabins that blend 
                modern amenities with the serenity of the great outdoors.
              </p>
            </div>

            <div className="order-1 md:order-2 bg-teal-100 rounded-2xl p-8 text-center shadow-lg">
              <span className="text-7xl">🏕️</span>
              <p className="text-gray-700 mt-4 font-medium italic text-lg">
                "Nature is not a place to visit. It is home."
              </p>
              <p className="text-teal-600 mt-2 text-sm">— Gary Snyder</p>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section with Icons */}
      <section className="py-16 bg-gradient-to-r from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            StaySphere by Numbers
          </h2>
          <div className="w-20 h-1 bg-teal-500 mx-auto mb-12 rounded-full"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-3">🏠</div>
              <p className="text-4xl font-bold text-teal-600">50+</p>
              <p className="text-gray-500 mt-2">Happy Cabins</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-3">👥</div>
              <p className="text-4xl font-bold text-teal-600">100+</p>
              <p className="text-gray-500 mt-2">Happy Guests</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-3">📍</div>
              <p className="text-4xl font-bold text-teal-600">5+</p>
              <p className="text-gray-500 mt-2">Locations</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-3">🕐</div>
              <p className="text-4xl font-bold text-teal-600">24/7</p>
              <p className="text-gray-500 mt-2">Support</p>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us Section - New */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Why Choose Us?
          </h2>
          <div className="w-20 h-1 bg-teal-500 mx-auto mb-12 rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Best Price Guarantee</h3>
              <p className="text-gray-500">We offer the best rates for your dream cabin stay.</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Booking</h3>
              <p className="text-gray-500">Your payments and data are always safe with us.</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition">
              <div className="text-5xl mb-4">🎧</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">24/7 Customer Support</h3>
              <p className="text-gray-500">We're here to help you anytime, anywhere.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonial Section - New */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-xl md:text-2xl italic mb-6">
            "Amazing experience! The cabin was beautiful and the service was top-notch. 
            Highly recommend StaySphere for anyone looking for a perfect getaway."
          </p>
          <p className="font-semibold">— Priya Sharma</p>
          <p className="text-teal-200 text-sm">Happy Guest</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to Experience Nature?
        </h2>
        <p className="text-gray-600 mb-8">
          Book your perfect cabin today and create memories that last a lifetime.
        </p>
        <Link
          href="/cabins"
          className="bg-teal-600 text-white px-8 py-3 rounded-xl hover:bg-teal-700 transition shadow-lg hover:shadow-xl inline-block"
        >
          Explore Cabins →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            <div>
              <h3 className="text-white text-xl font-bold mb-3">StaySphere</h3>
              <p className="text-sm text-gray-400">
                Experience luxury resort living in nature. Book your perfect cabin getaway today.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-teal-400 transition">Home</Link></li>
                <li><Link href="/cabins" className="text-gray-400 hover:text-teal-400 transition">Cabins</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-teal-400 transition">About Us</Link></li>
                <li><Link href="/my-bookings" className="text-gray-400 hover:text-teal-400 transition">My Bookings</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-400">📞 +91 98765 43210</li>
                <li className="text-gray-400">✉️ support@staysphere.com</li>
                <li className="text-gray-400">📍 India</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Office Hours</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-400">Mon - Fri: 9AM - 7PM</li>
                <li className="text-gray-400">Saturday: 10AM - 5PM</li>
                <li className="text-gray-400">Sunday: Closed</li>
              </ul>
            </div>
            
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
            © 2026 StaySphere Resort Management. All rights reserved.
          </div>
          
        </div>
      </footer>

    </div>
  );
}
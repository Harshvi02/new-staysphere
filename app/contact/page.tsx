"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState, useEffect } from "react"; // ✅ useEffect import
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  // ✅ Fetch logged-in user email
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        setUserEmail(data.user.email);
        setFormData(prev => ({ ...prev, email: data.user.email! }));
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address (e.g., name@example.com) ❌");
      return;
    }

    // Name validation
    if (!formData.name.trim()) {
      alert("Please enter your name ❌");
      return;
    }

    // Message validation
    if (!formData.message.trim()) {
      alert("Please enter your message ❌");
      return;
    }

    // Save to Supabase
    const { error: dbError } = await supabase.from("contacts").insert([
      {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
    ]);

    if (dbError) {
      console.error(dbError);
      setError(true);
      return;
    }

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: userEmail, subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <Navbar />

      <section className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Discover your perfect escape — book a cabin and enjoy nature at its finest.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600">123 Cabin Street, Nature Valley,<br />India - 123456</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600">+91 98765 43210</p>
                    <p className="text-gray-500 text-sm">Mon-Fri, 9AM - 7PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">support@staysphere.com</p>
                    <p className="text-gray-600">bookings@staysphere.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <span className="text-2xl">🕐</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Office Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 7:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
              
              {!userEmail && (
                <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg mb-4 text-center">
                  ⚠️ Please login to send a message
                </div>
              )}

              {submitted && (
                <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center">
                  ✅ Thank you! We'll get back to you soon.
                </div>
              )}

              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
                  ❌ Something went wrong. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
                    placeholder="Auto-filled from login"
                  />
                  <p className="text-xs text-gray-400 mt-1">Using your logged-in email address</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select subject</option>
                    <option value="Booking Inquiry">Booking Inquiry</option>
                    <option value="Cancellation">Cancellation</option>
                    <option value="Support">Support</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    placeholder="Write your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={!userEmail}
                  className={`w-full font-semibold py-3 rounded-lg transition ${
                    userEmail 
                      ? "bg-teal-600 hover:bg-teal-700 text-white" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {userEmail ? "Send Message" : "Please Login First"}
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Us</h2>
          <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
            <p className="text-gray-500">📍 Map Location - Nature Valley, India</p>
          </div>
        </div>
      </section>

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
                <li><Link href="/contact" className="text-gray-400 hover:text-teal-400 transition">Contact</Link></li>
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
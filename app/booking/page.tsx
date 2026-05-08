"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentButton from "@/components/PaymentButton";

type Cabin = {
  id: string;
  name: string;
  price: number;
};

export default function CreateBookingPage() {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [selectedCabinId, setSelectedCabinId] = useState("");
  const [guestsValue, setGuestsValue] = useState("");

  const [selectedPrice, setSelectedPrice] = useState(0);
  const [nights, setNights] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [aadhaarFront, setAadhaarFront] = useState<File | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<File | null>(null);

  const [frontName, setFrontName] = useState("");
  const [backName, setBackName] = useState("");

  // User details for auto-fill
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  // Payment states
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const cabinIdFromUrl = searchParams.get("cabinId") || "";
  const maxGuestsFromUrl = searchParams.get("maxGuests") || "";

  // Login check
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login");
      }
    };
    checkUser();
  }, [router]);

  // Fetch logged-in user details for auto-fill
  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", userData.user.id)
          .single();
        
        if (profile?.full_name) {
          setUserName(profile.full_name);
        } else {
          setUserName(userData.user.email?.split("@")[0] || "");
        }
        
        if (profile?.phone) {
          setUserPhone(profile.phone);
        }
      }
    };
    fetchUserDetails();
  }, []);

  // Fetch cabins
  useEffect(() => {
    const fetchCabins = async () => {
      const { data } = await supabase
        .from("cabins")
        .select("id, name, price");
      setCabins(data || []);
    };
    fetchCabins();
  }, []);

  // Auto select cabin from URL
  useEffect(() => {
    if (cabinIdFromUrl && cabins.length > 0) {
      const selected = cabins.find((c) => String(c.id) === cabinIdFromUrl);
      if (selected) {
        setSelectedCabinId(String(selected.id));
        setSelectedPrice(selected.price);
      }
    }
  }, [cabinIdFromUrl, cabins]);

  useEffect(() => {
    if (maxGuestsFromUrl) {
      setGuestsValue(maxGuestsFromUrl);
    }
  }, [maxGuestsFromUrl]);

  // Nights calculate
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      setNights(diff > 0 ? diff : 0);
    }
  }, [startDate, endDate]);

  const totalAmount = selectedPrice * nights;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ PAST DATE VALIDATION
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkInDate = new Date(startDate);
    const checkOutDate = new Date(endDate);
    
    if (!startDate || !endDate) {
      alert("❌ Please select both check-in and check-out dates!");
      return;
    }
    
    if (checkInDate < today) {
      alert("❌ Check-in date cannot be in the past! Please select today or future date.");
      return;
    }
    
    if (checkOutDate < today) {
      alert("❌ Check-out date cannot be in the past! Please select today or future date.");
      return;
    }
    
    if (checkInDate >= checkOutDate) {
      alert("❌ Check-out date must be after check-in date!");
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const cabinValue = formData.get("cabin") as string;
    const guests = Number(formData.get("guests"));

    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      alert("Please login first ❌");
      router.replace("/login");
      return;
    }

    const userEmail = data.user?.email;

    if (!cabinValue) return alert("Select cabin ❌");
    if (!guests || guests <= 0) return alert("Enter valid guests ❌");
    if (!aadhaarFront || !aadhaarBack) return alert("Upload both Aadhaar images ❌");

    if (!phone || phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number ❌");
      return;
    }
    if (!/^\d+$/.test(phone)) {
      alert("Phone number should contain only digits ❌");
      return;
    }

    if (maxGuestsFromUrl && guests > Number(maxGuestsFromUrl)) {
      alert(`❌ Maximum ${maxGuestsFromUrl} guests allowed for this cabin!`);
      return;
    }

    const { data: existingBookings } = await supabase
      .from("bookings")
      .select("start_date, end_date")
      .eq("cabin_id", cabinValue)
      .eq("status", "confirmed");

    const isConflict = (existingBookings || []).some((booking) => {
      const existStart = new Date(booking.start_date);
      const existEnd = new Date(booking.end_date);
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);
      return newStart < existEnd && newEnd > existStart;
    });

    if (isConflict) {
      alert("❌ Cabin already booked for these dates! Please select different dates.");
      return;
    }

    try {
      const uniqueName = crypto.randomUUID();
      const frontFileName = `aadhaar/${uniqueName}-front.jpg`;
      const backFileName = `aadhaar/${uniqueName}-back.jpg`;

      await supabase.storage.from("aadhaar-images").upload(frontFileName, aadhaarFront);
      await supabase.storage.from("aadhaar-images").upload(backFileName, aadhaarBack);

      const { data: booking, error } = await supabase
        .from("bookings")
        .insert([{
          cabin_id: cabinValue,
          user_name: name,
          phone,
          email: userEmail,
          start_date: startDate,
          end_date: endDate,
          guests,
          amount: totalAmount,
          aadhaar_front: frontFileName,
          aadhaar_back: backFileName,
          booking_type: "online",
          payment_status: "pending",
          status: "pending_payment",
        }])
        .select()
        .single();

      if (error) throw error;

      setBookingId(booking.id);
      setStep(2);

    } catch (err) {
      console.error(err);
      alert("Booking failed ❌");
    }
  };

  const handlePaymentSuccess = () => {
    alert("✅ Payment successful! Booking confirmed.");
    router.push("/my-bookings");
  };

  const handlePaymentFailure = (error: string) => {
    alert(`Payment failed: ${error}`);
    setStep(1);
  };

  // STEP 2: Payment Page
  if (step === 2 && bookingId) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-600">Booking ID</p>
            <p className="font-mono text-sm">{bookingId}</p>
            <p className="text-3xl font-bold text-teal-600 mt-2">₹{totalAmount}</p>
          </div>
          <PaymentButton
            amount={totalAmount}
            bookingId={bookingId}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
          />
          <button
            onClick={() => setStep(1)}
            className="mt-4 text-gray-500 text-sm underline"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // STEP 1: Booking Form
  return (
    <div className="max-w-3xl mx-auto px-3">
      <h1 className="text-2xl font-semibold mb-6">Create Booking</h1>

      <div className="bg-white p-5 rounded-2xl shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <input 
            name="name" 
            type="text" 
            placeholder="Guest Name"
            defaultValue={userName || ""}
            className="border px-3 py-2 rounded-lg" 
          />

          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            defaultValue={userPhone || ""}
            maxLength={10}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            className="border px-3 py-2 rounded-lg"
          />

          <select
            name="cabin"
            value={selectedCabinId}
            disabled={!!cabinIdFromUrl}
            className={`border px-3 py-2 rounded-lg ${
              cabinIdFromUrl ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            onChange={(e) => {
              setSelectedCabinId(e.target.value);
              const selected = cabins.find((c) => String(c.id) === e.target.value);
              setSelectedPrice(selected?.price || 0);
            }}
          >
            <option value="">Select Cabin</option>
            {cabins.map((cabin) => (
              <option key={cabin.id} value={cabin.id}>
                {cabin.name} (₹{cabin.price})
              </option>
            ))}
          </select>

          <input type="hidden" name="cabin" value={selectedCabinId} />

          <input
            name="guests"
            type="number"
            placeholder="Guests"
            value={guestsValue}
            min={1}
            max={maxGuestsFromUrl ? Number(maxGuestsFromUrl) : undefined}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (maxGuestsFromUrl && val > Number(maxGuestsFromUrl)) {
                setGuestsValue(maxGuestsFromUrl);
              } else {
                setGuestsValue(e.target.value);
              }
            }}
            className="border px-3 py-2 rounded-lg"
          />

          {/* Check-in with min=today */}
          <div>
            <label className="text-sm text-gray-600">Check-in</label>
            <input 
              name="start" 
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="border px-3 py-2 rounded-lg w-full"
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>

          {/* Check-out with min=startDate or today */}
          <div>
            <label className="text-sm text-gray-600">Check-out</label>
            <input 
              name="end" 
              type="date"
              min={startDate || new Date().toISOString().split("T")[0]}
              className="border px-3 py-2 rounded-lg w-full"
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>

          <div className="md:col-span-2 border px-3 py-2 rounded-lg bg-gray-50">
            Amount: ₹ {totalAmount} ({nights} nights)
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 block mb-2">Upload Aadhaar Card</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Front Side - Only JPEG files allowed */}
              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">Front Side</p>
                <input 
                  type="file" 
                  accept="image/jpeg, image/jpg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && !file.type.includes("jpeg") && !file.type.includes("jpg")) {
                      alert("❌ Only JPEG/JPG files are allowed!");
                      e.target.value = "";
                      return;
                    }
                    setAadhaarFront(file || null);
                    setFrontName(file?.name || "");
                  }} 
                />
                {frontName && <p className="text-xs text-gray-400 mt-1">{frontName}</p>}
              </div>

              {/* Back Side - Only JPEG files allowed */}
              <div className="border rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">Back Side</p>
                <input 
                  type="file" 
                  accept="image/jpeg, image/jpg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && !file.type.includes("jpeg") && !file.type.includes("jpg")) {
                      alert("❌ Only JPEG/JPG files are allowed!");
                      e.target.value = "";
                      return;
                    }
                    setAadhaarBack(file || null);
                    setBackName(file?.name || "");
                  }} 
                />
                {backName && <p className="text-xs text-gray-400 mt-1">{backName}</p>}
              </div>

            </div>
          </div>

          <button type="submit" className="bg-teal-600 text-white py-2.5 rounded-lg md:col-span-2">
            Proceed to Payment
          </button>

        </form>
      </div>
    </div>
  );
}
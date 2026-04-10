"use client";

import { useEffect, useState } from "react";

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

import { supabase } from "@/lib/supabase";
import Loader from "@/components/Loader";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setContacts(data);
      }
      setLoading(false);
    };

    fetchContacts();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setContacts(data);
    }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("contacts").update({ status: "read" }).eq("id", id);
    handleRefresh();
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contacts").delete().eq("id", id);
    handleRefresh();
    if (selectedContact?.id === id) setSelectedContact(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <button
          onClick={handleRefresh}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Messages List */}
        <div className="md:col-span-2 bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400">
                      No messages yet
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className={`border-t cursor-pointer hover:bg-gray-50 ${
                        contact.status === "unread" ? "bg-teal-50" : ""
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <td className="p-3">
                        {contact.status === "unread" ? (
                          <span className="bg-teal-100 text-teal-600 px-2 py-1 rounded-full text-xs">New</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">Read</span>
                        )}
                      </td>
                      <td className="p-3 font-medium">{contact.name}</td>
                      <td className="p-3">{contact.subject}</td>
                      <td className="p-3 text-gray-500 text-xs">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteContact(contact.id);
                          }}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Message Detail */}
        <div className="bg-white rounded-xl shadow p-6">
          {selectedContact ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">Message Details</h3>
                {selectedContact.status === "unread" && (
                  <button
                    onClick={() => markAsRead(selectedContact.id)}
                    className="bg-teal-100 text-teal-600 px-3 py-1 rounded-lg text-xs"
                  >
                    Mark as Read
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-xs">From</p>
                  <p className="font-medium">{selectedContact.name}</p>
                  <p className="text-sm text-gray-600">{selectedContact.email}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Subject</p>
                  <p className="font-medium">{selectedContact.subject}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Date</p>
                  <p className="text-sm">{new Date(selectedContact.created_at).toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Message</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>

                {/* ✅ ONLY Copy Email Button - Reply via Email REMOVED */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedContact.email);
                    alert(`✓ Email copied: ${selectedContact.email}\n\nNow paste it in Gmail`);
                  }}
                  className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm mt-4 hover:bg-teal-700"
                >
                  📋 Copy Email Address
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <p className="text-5xl mb-3">📧</p>
              <p>Select a message to view details</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
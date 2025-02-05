"use client";

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa"; // Importing a spinner icon for the loader

interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const query = `*[_type == "customer"]{
          _id,
          fullName,
          email,
          phoneNumber,
          address,
          city
        }`;
        const data = await client.fetch(query);
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:ml-64">
      <h1 className="text-4xl font-semibold text-gray-900 mb-8">Customers</h1>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          className="w-full md:w-1/2 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ease-in-out duration-300 shadow-lg hover:shadow-2xl"
          placeholder="Search by Name or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading State - Custom Loader */}
      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <FaSpinner className="animate-spin text-teal-500" size={30} />
          <p className="text-gray-600">Loading customers...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-xl p-4">
          {/* Table */}
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="px-6 py-3 text-left">Full Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Address</th>
                <th className="px-6 py-3 text-left">City</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="border-t hover:bg-teal-100 transition-colors ease-in-out duration-300">
                    <td className="px-6 py-4">{customer.fullName}</td>
                    <td className="px-6 py-4">{customer.email}</td>
                    <td className="px-6 py-4">{customer.phoneNumber}</td>
                    <td className="px-6 py-4">{customer.address}</td>
                    <td className="px-6 py-4">{customer.city}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-600">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

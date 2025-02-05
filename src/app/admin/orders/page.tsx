"use client";

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import { FaSpinner, FaBox, FaUser, FaShippingFast, FaMoneyBillWave, FaCalendarAlt, FaClipboardList } from "react-icons/fa";

interface Order {
  _id: string;
  customer?: {
    fullName?: string;
  };
  totalAmount: number;
  shippingAddress?: string;
  status?: string;
  orderDate?: string;
  orderId?: string;
  items?: Array<{ quantity?: number }>;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("orderDate");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = `*[_type == "order"]{
          _id,
          customer->{ fullName },
          totalAmount,
          status,
          orderDate,
          orderId,
          items,
          shippingAddress,
        }`;
        const data = await client.fetch(query);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const sortedOrders = [...orders].sort((a, b) => {
    const aValue = a[sortBy as keyof Order] ?? "";
    const bValue = b[sortBy as keyof Order] ?? "";
    return String(aValue).localeCompare(String(bValue));
  });

  const filteredOrders = sortedOrders.filter((order) =>
    ((order.orderId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "" || order.status === statusFilter)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:ml-64">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FaClipboardList className="text-blue-600" /> Orders
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input type="text" className="w-full md:w-1/3 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select className="w-full md:w-1/3 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Filter by Status</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <FaSpinner className="animate-spin text-teal-500" size={30} />
        </div>
      ) : (
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3"><FaBox /></th>
              <th className="p-3"><FaUser /></th>
              <th className="p-3">Status</th>
              <th className="p-3">Total Items</th>
              <th className="p-3">Total Quantity</th>
              <th className="p-3"><FaCalendarAlt /></th>
              <th className="p-3"><FaMoneyBillWave /></th>
              <th className="p-3"><FaShippingFast /></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition-all">
                  <td className="p-3">{order.orderId || "N/A"}</td>
                  <td className="p-3">{order.customer?.fullName || "N/A"}</td>
                  <td className={`p-3 font-bold ${order.status === "pending" ? "text-yellow-500" : "text-green-500"}`}>
                    {(order.status || "UNKNOWN").toUpperCase()}
                  </td>
                  <td className="p-3">{order.items?.length || 0}</td>
                  <td className="p-3">{order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}</td>
                  <td className="p-3">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}</td>
                  <td className="p-3">${order.totalAmount}</td>
                  <td className="p-3">{order.shippingAddress || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-5 text-gray-500">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

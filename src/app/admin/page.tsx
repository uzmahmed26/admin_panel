"use client";

import { useEffect, useState } from "react";
import { 
  FaBox, FaMoneyBillWave, FaShoppingCart, FaUsers, FaCubes, 
 FaWarehouse, FaCheckCircle, FaHourglassHalf ,
  FaCogs, FaBoxOpen, FaClipboardList, FaTruck, 
  FaChartLine, FaDollarSign, FaRegCalendarAlt, 
  FaShippingFast, FaChartPie, FaUsersCog 
} from "react-icons/fa";
import { client } from "@/sanity/lib/client";

export default function Dashboard() {
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalStock, setTotalStock] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [completedOrders, setCompletedOrders] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [deliveredOrders, setDeliveredOrders] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productQuery = `*[_type == "product"]{
          price,
          stock,
        }`;

        const productsData = await client.fetch(productQuery);
        setTotalProducts(productsData.length);
        setTotalStock(
          productsData.reduce((acc: number, product: { stock: number }) => acc + product.stock, 0)
        );
        setTotalAmount(
          productsData.reduce(
            (acc: number, product: { price: number; stock: number }) =>
              acc + product.price * product.stock,
            0
          )
        );

        const ordersQuery = `*[_type == "order"]{
          status
        }`;

        const ordersData = await client.fetch(ordersQuery);
        setTotalOrders(ordersData.length);
        setCompletedOrders(
          ordersData.filter((order: { status: string }) => order.status === "completed").length
        );
        setPendingOrders(
          ordersData.filter((order: { status: string }) => order.status === "pending").length
        );
        setDeliveredOrders(
          ordersData.filter((order: { status: string }) => order.status === "delivered").length
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const dashboardData = [
    { icon: <FaBox className="text-5xl text-blue-600" />, label: "Total Products", value: totalProducts },
    { icon: <FaWarehouse className="text-5xl text-green-600" />, label: "Total Stock", value: totalStock },
    { icon: <FaChartLine className="text-5xl text-yellow-500" />, label: "Total Sales Amount", value: `$${totalAmount.toFixed(2)}` },
    { icon: <FaClipboardList className="text-5xl text-red-600" />, label: "Total Orders", value: totalOrders },
    { icon: <FaCheckCircle className="text-5xl text-teal-600" />, label: "Delivered Orders", value: deliveredOrders },
    { icon: <FaHourglassHalf className="text-5xl text-orange-600" />, label: "Pending Orders", value: pendingOrders },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:ml-64 font-sans">
      <div className="mb-8 bg-white p-4 rounded-lg shadow-lg text-center mt-20 md:mt-0">
        <p className="text-3xl font-bold font-sans text-red-600">Admin Panel DashBoard</p>
        <p className="text-2xl font-bold text-gray-600 font-sans mt-2">Ecommerce</p>
      
      </div>

      <h1 className="text-4xl font-extrabold text-indigo-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-6 hover:shadow-2xl transition-transform transform hover:-translate-y-1 border-b-4 border-gray-300 hover:border-indigo-500"
          >
            {card.icon}
            <div>
              <h2 className="text-lg font-semibold text-gray-700">{card.label}</h2>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

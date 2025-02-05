"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaBox, FaMoneyBillWave, FaShoppingCart, FaUsers, FaCubes, 
  FaWarehouse, FaCheckCircle, FaHourglassHalf, FaChartLine,
  FaClipboardList, FaTruck, FaChartPie, FaUsersCog, FaAlignJustify, FaDoorOpen, FaTimesCircle
} from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  const navItems = [
    { href: "/admin", icon: <FaChartPie className="text-indigo-50" />, text: "Dashboard" },
    { href: "/admin/product", icon: <FaCubes className="text-orange-300" />, text: "Products" },
    { href: "/admin/customers", icon: <FaUsers className="text-teal-300" />, text: "Customers" },
    { href: "/admin/orders", icon: <FaClipboardList className="text-blue-500" />, text: "Orders" },
    { href: "/admin/stock", icon: <FaWarehouse className="text-teal-600" />, text: "Stock" },
    { href: "/admin/reports", icon: <FaChartLine className="text-yellow-600" />, text: "Reports" },
  ];

  if (!isMounted) return null;

  return (
    <div className="z-50">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 w-full bg-blue-900 text-white p-4 flex justify-between items-center shadow-lg z-20">
          <h1 className="text-lg font-semibold">Avion Admin</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl hover:scale-110 transition-transform"
          >
            <FaAlignJustify />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.aside
            initial={{ x: isMobile ? "-100%" : 0 }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed top-0 left-0 h-full w-64 bg-blue-800 text-white p-5 shadow-lg"
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
              <h1 className="text-xl font-semibold">Admin_Panel</h1>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-2xl hover:rotate-90 transition-transform"
                >
                  <FaTimesCircle />
                </button>
              )}
            </div>
            <nav className="mt-5 space-y-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="block">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                      pathname === item.href
                        ? "bg-indigo-600 shadow-lg"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                </Link>
              ))}
            </nav>
            <div className="mt-8">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all"
              >
                <FaDoorOpen className="text-lg" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SideBar;

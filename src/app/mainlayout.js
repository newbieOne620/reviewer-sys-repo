"use client";
import React from "react";
import Header from "./layoutcomponents/header";
import { usePathname } from "next/navigation";

function Mainlayout({ children }) {
  const pathname = usePathname();
  if (pathname === "/") {
    return <div className="min-h-screen">{children}</div>;
  }
  return (
    <div className="h-screen w-screen bg-gray-200 overflow-auto   ">
      <Header />
      <main className=" ">{children}</main>
    </div>
  );
}

export default Mainlayout;

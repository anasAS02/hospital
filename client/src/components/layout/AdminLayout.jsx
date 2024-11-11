import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Sidebar, Dropdown, Avatar, Button, Navbar } from "flowbite-react";
import AdminSidbar from "./AdminSidbar";
import { setOpenSidebar } from "../../store/reducers/authSlice";
import { useDispatch } from "react-redux";

function AdminLayout() {
  const dispatch = useDispatch();
  return (
    <div className=" h-screen w-full flex flex-col md:flex-row relative">
      <div className=" md:w-1/4   relative ">
        {" "}
        <AdminSidbar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden sm:w-full md:ml-20  lg:ml-5">
        {/* Top Navbar */}
        <Navbar fluid rounded className="shadow-md mb-6">
          <button
            className="block md:hidden"
            onClick={() => dispatch(setOpenSidebar(true))}
          >
            ☰
          </button>
          <Navbar.Brand href="/">
            <img
              src="https://via.placeholder.com/40"
              alt="Logo"
              className="mr-3"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-800">
              لوحة إدارة المستشفى
            </span>
          </Navbar.Brand>
          <div className="flex items-center gap-4">
            <Dropdown label={<Avatar rounded />}>
              <Dropdown.Header>
                <span className="block text-sm">المسؤول</span>
                <span className="block truncate text-sm font-medium">
                  admin@example.com
                </span>
              </Dropdown.Header>
              <Dropdown.Item>الإعدادات</Dropdown.Item>
              <Dropdown.Item>تسجيل الخروج</Dropdown.Item>
            </Dropdown>
          </div>
        </Navbar>

        {/* Dynamic Page Content */}
        <div className="bg-white p-8 rounded-lg shadow-lg flex-1 overflow-y-auto 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

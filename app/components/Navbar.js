"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="flex w-full p-2 bg-white justify-between items-center">
      <Link
        href="/"
        className="bg-yellow text-blue active:bg-blue-400 active:dark:bg-blue-600 ml-2 dark:text-white dark:bg-blue rounded p-2.5 flex justify-start"
      >
        SunSab Tournaments
      </Link>

      <div className="relative">
        <button
          className="bg-yellow text-black active:bg-blue active:dark:bg-blue-600 dark:text-white dark:bg-blue rounded p-2.5 flex items-center"
          onClick={toggleDropdown}
        >
          Menu
          <svg
            className={`w-4 h-4 ml-2 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded">
            <Link
              href="/login"
              className="block px-4 py-2 text-black hover:bg-blue-100 dark:hover:bg-blue-600"
              onClick={handleMenuItemClick}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block px-4 py-2 text-black hover:bg-blue-100 dark:hover:bg-blue-600"
              onClick={handleMenuItemClick}
            >
              Sign Up
            </Link>
            <Link
              href="/tournaments"
              className="block px-4 py-2 text-black hover:bg-blue-100 dark:hover:bg-blue-600"
              onClick={handleMenuItemClick}
            >
              Tournaments
            </Link>
            <Link
              href="/create"
              className="block px-4 py-2 text-black hover:bg-blue-100 dark:hover:bg-blue-600"
              onClick={handleMenuItemClick}
            >
              Create
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

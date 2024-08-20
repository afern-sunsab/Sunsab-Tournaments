"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = () => {
    setIsDropdownOpen(false);
  };

  // Add event listener to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="flex w-full p-2 bg-sunsab-white justify-between items-center">
      <Link
        href="/"
        className="bg-sunsab-yellow text-white font-bold ml-2 rounded p-2.5 flex justify-start"
      >
        SunSab Tournaments
      </Link>

      <div className="relative" ref={dropdownRef}>
        <button
          className="bg-sunsab-yellow text-sunsab-blue mr-2 rounded p-2.5 flex items-center"
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
              className="block px-4 py-2 text-black hover:bg-sunsab-yellow"
              onClick={handleMenuItemClick}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block px-4 py-2 text-black hover:bg-sunsab-yellow"
              onClick={handleMenuItemClick}
            >
              Sign Up
            </Link>
            <Link
              href="/tournaments"
              className="block px-4 py-2 text-black hover:bg-sunsab-yellow"
              onClick={handleMenuItemClick}
            >
              Tournaments
            </Link>
            <Link
              href="/create"
              className="block px-4 py-2 text-black hover:bg-sunsab-yellow"
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

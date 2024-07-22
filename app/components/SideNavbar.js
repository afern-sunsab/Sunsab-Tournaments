'use client';
import { useUserAuth } from '@utils/auth-context';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import HomePage from '../../public/icons/HomePage.svg';
import TestAccount from '../../public/icons/TestAccount.svg';
import Tournament from '../../public/icons/Tournament.svg';
import TwoTickets from '../../public/icons/TwoTickets.svg';

const SideBar = () => {
  const pathname = usePathname();
  const { user, firebaseSignOut } = useUserAuth();
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuth();
  }, [user]);
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  function handleSignOut() {
    firebaseSignOut();
  }

  const isTournamentPage = pathname.startsWith('/tournament') || pathname.includes('/tournament');

  const isActive = (path) => pathname === path ? 'shadow-lg' : '';

  return (
    <div className="sticky top-0 z-10 flex flex-col h-screen w-20 border-r border-gray-800 bg-black p-4 lg:flex lg:w-20 lg:block hidden">
      
      <div className="relative flex items-center justify-center w-14 h-14 rounded-full duration-300 transform hover:scale-105 shadow-lg cursor-pointer mb-10">
        <Image
          src={TestAccount}
          alt="Profile Icon"
          width={40}
          height={40}
          className="rounded-full"
          onClick={toggleDropdown}
        />
        {/* Dropdown menu */}
        {dropdownOpen && !loading && (
          <div className="absolute top-0 left-full ml-2 max-w-xs bg-white text-black rounded-lg shadow-lg z-30">
            {user ? (
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Log out
              </button>
            ) : (
              <Link href="/login">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Log in
                </button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Home page link */}
      <Link href='/'>
        <div className={`flex items-center justify-center w-14 h-14 rounded-full duration-300 transform hover:scale-105 shadow-lg cursor-pointer mb-10 ${isActive('/home')}`}>
          <Image
            src={HomePage}
            alt="HomePage Icon"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </Link>

      {/* Tournament links if on a tournament page */}
      {isTournamentPage && (
        <>
          <Link href='/tournaments'>
            <div className={`flex items-center justify-center w-14 h-14 rounded-full duration-300 transform hover:scale-105 shadow-lg cursor-pointer mb-10 ${isActive('/tournaments')}`}>
              <Image
                src={Tournament}
                alt="Tournament Icon"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          </Link>

          <Link href='/twotickets'>
            <div className={`flex items-center justify-center w-14 h-14 rounded-full duration-300 transform hover:scale-105 shadow-lg cursor-pointer mb-10 ${isActive('/twotickets')}`}>
              <Image
                src={TwoTickets}
                alt="Two Tickets Icon"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          </Link>
        </>
      )}
    </div>
  );
};

export default SideBar;

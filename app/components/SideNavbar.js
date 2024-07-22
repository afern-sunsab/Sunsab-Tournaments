'use client';
import { useUserAuth } from '@utils/auth-context';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import HomePage from '../../public/icons/HomePage.svg';
import SelectedHomepage from '../../public/icons/Selected-HomePage.svg';
import SelectedTestAccount from '../../public/icons/Selected-TestAccount.svg';
import SelectedTournament from '../../public/icons/Selected-Tournament.svg';
import SelectedTwoTickets from '../../public/icons/Selected-TwoTickets.svg';
import TestAccount from '../../public/icons/TestAccount.svg';
import Tournament from '../../public/icons/Tournament.svg';
import TwoTickets from '../../public/icons/TwoTickets.svg';

const SideBar = () => {
  const pathname = usePathname();
  const { user, firebaseSignOut } = useUserAuth();
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState('');

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

  const isTournamentPage = pathname.startsWith('/tournaments/') && pathname.split('/').length === 3;

  const isActive = (path) => pathname === path ? 'shadow-lg' : '';

  const getProfileIcon = () => {
    if (dropdownOpen) return SelectedTestAccount;
    return hoveredIcon === 'profile' ? SelectedTestAccount : TestAccount;
  };

  const getIcon = (iconType, icon, selectedIcon) => hoveredIcon === iconType ? selectedIcon : icon;

  return (
    <div className="sticky top-0 z-10 flex flex-col h-screen w-20 border-r border-gray-800 bg-black p-4 lg:flex lg:w-20 lg:block hidden">
      <div
        className="relative flex items-center justify-center w-14 h-14 rounded-full duration-300 transform hover:scale-105 shadow-lg cursor-pointer mb-10"
        onMouseEnter={() => setHoveredIcon('profile')}
        onMouseLeave={() => setHoveredIcon('')}
        onClick={toggleDropdown}
      >
        <Image
          src={getProfileIcon()}
          alt="Profile Icon"
          width={40}
          height={40}
          className="rounded-full"
        />
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

      <Link href="/">
        <div
          className={`flex items-center justify-center w-14 h-14 rounded-full duration-300 transform hover:scale-105 shadow-lg cursor-pointer mb-10 ${isActive('/')}`}
          onMouseEnter={() => setHoveredIcon('home')}
          onMouseLeave={() => setHoveredIcon('')}
        >
          <Image
            src={getIcon('home', HomePage, SelectedHomepage)}
            alt="HomePage Icon"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </Link>

      {isTournamentPage && (
        <>
            <div
              className={`flex items-center justify-center w-14 h-14 rounded-full duration-300 transform hover:scale-105 shadow-lg cursor-pointer mb-10 ${isActive('/tournaments')}`}
              onMouseEnter={() => setHoveredIcon('tournament')}
              onMouseLeave={() => setHoveredIcon('')}
            >
              <Image
                src={getIcon('tournament', Tournament, SelectedTournament)}
                alt="Tournament Icon"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>

            <div
              className={`flex items-center justify-center w-14 h-14 rounded-full duration-300 transform hover:scale-105 shadow-lg cursor-pointer mb-10 ${isActive('/twotickets')}`}
              onMouseEnter={() => setHoveredIcon('tickets')}
              onMouseLeave={() => setHoveredIcon('')}
            >
              <Image
                src={getIcon('tickets', TwoTickets, SelectedTwoTickets)}
                alt="Two Tickets Icon"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
        </>
      )}
    </div>
  );
};

export default SideBar;

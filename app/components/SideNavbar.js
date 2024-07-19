'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomePage from '../../public/icons/HomePage.svg';
import Tournament from '../../public/icons/Tournament.svg';
import TwoTickets from '../../public/icons/TwoTickets.svg';

const SideBar = () => {
  const pathname = usePathname();

  console.log('Current pathname:', pathname);
  const isTournamentPage = pathname.startsWith('/tournament') || pathname.includes('/tournament');
  console.log('Is tournament page:', isTournamentPage);

  const isActive = (path) => pathname === path ? 'shadow-lg' : '';

  return (
    <div className="sticky top-0 z-10 flex flex-col h-screen w-20 border-r border-gray-800 bg-black p-4 lg:flex lg:w-20 lg:block hidden">
      
      <Link href='/home'>
        <div className={`flex items-center space-y-1 justify-center w-14 h-14 rounded-full  duration-300 transform hover:scale-105 shadow-lg cursor-pointer ${isActive('/home')}`}>
          <Image
            src={HomePage}
            alt="HomePage Icon"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </Link>

      {isTournamentPage && (
        <>
            <div className={`flex items-center space-y-1 justify-center w-14 h-14 rounded-full  duration-300 transform hover:scale-105 shadow-lg cursor-pointer ${isActive('/tournaments')}`}>
              <Image
                src={Tournament}
                alt="Tournament Icon"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>

            <div className={`flex items-center space-y-1 justify-center w-14 h-14 rounded-full duration-300 transform hover:scale-105 shadow-lg cursor-pointer ${isActive('/twotickets')}`}>
              <Image
                src={TwoTickets}
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

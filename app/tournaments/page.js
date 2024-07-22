"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Participants from "../../public/icons/Participants.svg";
import Proceed from "../../public/icons/Proceed.svg";
import { useUserAuth } from "../_utils/auth-context.js";
import { getTournaments } from "../_utils/firebase_services";

export default function Page() {
  const [tournaments, setTournaments] = useState([]);
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchTournaments = async () => {
      const data = await getTournaments();
      setTournaments(data);
    };
    fetchTournaments();
  }, []);

  return (
    <main className="bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-4">Tournaments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <Link
              href={`/tournaments/${tournament.docId}`}
              key={tournament.docId}
              className="relative w-full group transition-transform transform lg:hover:scale-105 ease-in-out duration-500 lg:hover:shadow-xl"
            >
              <div className="relative h-40 overflow-hidden">
                <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110">
                  {tournament.thumbnail ? (
                    <Image
                      src={tournament.thumbnail}
                      alt={`Thumbnail for ${tournament.name}`}
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full"
                    />
                  ) : (
                    <Image
                      src="/Placeholder.png"
                      alt="Default Thumbnail"
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full"
                    />
                  )}
                </div>
              </div>
              <div className="flex-1 p-4 rounded-md bg-[#111827] text-white transition-colors duration-500 group-hover:bg-[#FED136] relative">
                <h2 className="text-xl font-bold mb-2">{tournament.name}</h2>
                <p className="text-lg mb-2">Game: {tournament.game}</p>
                <p className="mb-2">Description: {tournament.description}</p>
                <div className="flex items-center mb-2">
                  <Image
                    src={Participants}
                    alt="Participants Icon"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  <span className="text-lg">{tournament.entrants ? tournament.entrants.length : 0} Participants</span>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Image
                    src={Proceed}
                    alt="Proceed Icon"
                    width={30}
                    height={30}
                  />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>Loading tournaments...</p>
        )}
      </div>

      <h1 className="text-3xl font-bold mt-4">User Data</h1>
      {user ? (
        <div className="border rounded-md p-4 mt-4">
          <h2 className="text-xl font-bold">Name: {user.name}</h2>
          <p className="text-lg">Username: {user.username}</p>
          <p className="text-lg">Email: {user.email}</p>
        </div>
      ) : (
        <p className="mt-4">Please log in to view your user data</p>
      )}
    </main>
  );
}

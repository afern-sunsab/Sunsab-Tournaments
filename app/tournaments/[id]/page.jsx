"use client";

import { useUserAuth } from "@utils/auth-context";
import { getTournaments, getUser } from "@utils/firebase_services";
import { joinTournament, leaveTournament } from "@utils/tournament_services";
import Link from "next/link";
import React, { useState, useEffect } from "react";


function Page({ params }) {
  const [tournaments, setTournaments] = useState([]);
  const [users, setUsers] = useState(null);
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchTournaments = async () => {
      const data = await getTournaments();
      setTournaments(data);
    };
    fetchTournaments();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUser(user.uid);
      setUsers(data);
    };
    if (user) fetchUsers();
  }, [user]);

  const handleJoin = async (tournament) => {
    //const userRef = await getUserRef(users.uid);
    //tournament.entrants.push(userRef);
    //await updateTournament(tournament);
    const updatedTournament = await joinTournament(tournament, users);
    setTournaments(
      tournaments.map((t) =>
        t.docId === updatedTournament.docId ? updatedTournament : t
      )
    );
  };

  const handleLeave = async (tournament, user) => {
    const updatedTournament = await leaveTournament(tournament, user);
    setTournaments(
      tournaments.map((t) =>
        t.docId === updatedTournament.docId ? updatedTournament : t
      )
    );
  };

  const foundTournament = tournaments.find((tournament)=> tournament.docId === params.id)
  if (!foundTournament) {
    return "Loading"
  }
  return (
    <main>
      <h1>{foundTournament.name}</h1>
      <p>{foundTournament.description}</p>
      <p>{foundTournament.event_date}</p>
      <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => handleJoin(foundTournament)}
            >
              Join
            </button>
    </main>

  )
  

  
}



export default Page;
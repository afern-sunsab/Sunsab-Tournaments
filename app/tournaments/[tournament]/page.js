"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUserAuth } from "@utils/auth-context";
import { getTournament, timestampToDate } from "@utils/firebase_services";
import { joinTournament, leaveTournament } from "@utils/tournament_services";

export default function Page({ params }) {
	const [tournament, setTournament] = useState(null);
	const { user } = useUserAuth();

	useEffect(() => {
		const fetchTournament = async () => {
			const data = await getTournament(params.tournament);
			if (data.name)
				document.title = "Tournaments - " + data.name;
			else
				document.title = "Tournaments - Tournament";
			setTournament(data);
		};
		fetchTournament();
	}, [params]);

	const handleJoin = async () => {
		await joinTournament(tournament, user);
	};

	const handleLeave = async () => {
		await leaveTournament(tournament, user);
	};

	return (
		<main className="bg-gray-100 text-gray-900 p-8">
		  {tournament && tournament.name ? (
			<>
			  <h1 className="text-4xl font-extrabold mb-6 text-center text-sunsab-yellow">{tournament.name}</h1>
			  <div className="p-6 mb-6 flex items-start border border-gray-300 rounded-lg bg-white shadow-lg">
				<div className="relative h-40 w-40 flex-shrink-0 mr-4 flex items-center justify-center border-2 border-gray-300 rounded-lg overflow-hidden">
				  <img
					src={tournament.thumbnail || "/Placeholder.png"}
					alt={`Thumbnail for ${tournament.name}`}
					className="h-full w-full object-cover"
				  />
				</div>
				<div className="flex-1">
				  <h2 className="text-2xl font-semibold mb-2 text-sunsab-yellow">{tournament.name}</h2>
				  <p className="text-lg mb-2">Game: {tournament.game}</p>
				  <p className="mb-2">Description: {tournament.description}</p>
				  <p className="mb-2">Entrant Limit: {tournament.entrant_limit}</p>
				  <p className="mb-2">Registration Close Date: {timestampToDate(tournament.close_date)}</p>
				  <p className="mb-2">Event Date: {timestampToDate(tournament.event_date)}</p>
				  <div>
					<Link href={`/tournaments/${tournament.docId}/brackets`}>
					  <span className="inline-block bg-sunsab-yellow hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-2">Brackets</span>
					</Link>
				  </div>
				  {Date.now() >= timestampToDate(tournament.event_date) ? (
					<p className="text-lg mt-2">Completed: {tournament.completed ? "Completed" : "Not Completed"}</p>
				  ) : null}
				  {user ? (
					<>
					  {tournament.entrants && tournament.entrants.some(ref => ref.id === user.docId) ? (
						<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={handleLeave}>Leave</button>
					  ) : (
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={handleJoin}>Join</button>
					  )}
					</>
				  ) : (
					<p className="mt-4 text-center">Log in to join this tournament</p>
				  )}
				</div>
			  </div>
			</>
		  ) : (
			<h1 className="text-center text-gray-600">Loading...</h1>
		  )}
	
		  <section className="mt-8">
			<h1 className="text-3xl font-bold mb-4 text-center text-sunsab-yellow">User Data</h1>
			{user ? (
			  <div className="border border-gray-300 rounded-lg bg-white p-6 shadow-md">
				<h2 className="text-2xl font-semibold mb-2 text-sunsab-yellow">Name: {user.name}</h2>
				<p className="text-lg text-gray-700 mb-1">Username: {user.username}</p>
				<p className="text-lg text-gray-700">Email: {user.email}</p>
			  </div>
			) : (
			  <p className="text-center text-gray-600 mt-4">Please log in to view your user data</p>
			)}
		  </section>
		</main>
	  );
	}
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { getTournaments, updateTournament, getUser, getUserRef } from "../_utils/firebase_services";
import { useUserAuth } from "../_utils/auth-context.js";
import { joinTournament, leaveTournament } from "../_utils/tournament_services";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
	const [tournaments, setTournaments] = useState([]);
	const { user } = useUserAuth();

	//Document title
	useEffect(() => {
		document.title = "Tournaments - Tournament List";
	}, []);

	useEffect(() => {
		const fetchTournaments = async () => {
			const data = await getTournaments();
			setTournaments(data);
		};
		fetchTournaments();
	}, []);

	return (
		<main className="bg-gray-100 text-gray-900 p-8">
		  <h1 className="text-4xl font-extrabold mb-6 text-center text-sunsab-yellow">Tournaments</h1>
		  {tournaments.length > 0 ? (
			<div className="space-y-6">
			  {tournaments.map((tournament) => (
				<Link
				  href={`/tournaments/${tournament.docId}`}
				  key={tournament.docId}
				  className="flex items-center border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
				>
				  <div className="relative h-32 w-32 flex-shrink-0 mx-4 flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden">
					<Image
					  src={tournament.thumbnail || "/Placeholder.png"}
					  alt={`Thumbnail for ${tournament.name}`}
					  layout="fill"
					  objectFit="cover"
					/>
				  </div>
				  <div className="flex-1 p-4">
					<h2 className="text-2xl font-semibold mb-2 text-sunsab-yellow">{tournament.name}</h2>
					<p className="text-md text-gray-700 mb-2">Game: {tournament.game}</p>
					<p className="text-sm text-gray-600 mb-2">Description: {tournament.description}</p>
					<p className="text-md font-medium mb-2">Entrants:</p>
					<ul className="list-disc pl-5">
					  {tournament.entrants && tournament.entrants.length > 0 ? (
						tournament.entrants.map((entrant, index) => (
						  <li key={index} className="text-sm text-gray-800">
							{entrant.username} ({entrant.name})
						  </li>
						))
					  ) : (
						<li className="text-sm text-gray-600">No Entrants</li>
					  )}
					</ul>
				  </div>
				</Link>
			  ))}
			</div>
		  ) : (
			<p className="text-center text-gray-600">Loading tournaments...</p>
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
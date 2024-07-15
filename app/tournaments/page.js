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
			{tournaments.length > 0 ? (
				tournaments.map((tournament) => (
					<Link
						href={`/tournaments/${tournament.docId}`}
						key={tournament.docId}
						className="border rounded-md p-4 mb-4 hover:bg-gray-100 flex items-start"
					>
						<div className="relative h-40 w-40 flex-shrink-0 mr-4 border-2 border-black">
							{tournament.thumbnail ? (
								<Image
									src={tournament.thumbnail}
									alt={`Thumbnail for ${tournament.name}`}
									layout="fill"
									objectFit="cover"
								/>
							) : (
								<Image
									src="/Placeholder.png"
									alt="Default Thumbnail"
									layout="fill"
									objectFit="cover"
								/>
							)}
						</div>
						<div className="flex-1">
							<h2 className="text-xl font-bold mb-2">{tournament.name}</h2>
							<p className="text-lg mb-2">Game: {tournament.game}</p>
							<p className="mb-2">Description: {tournament.description}</p>
							<p className="mb-2">Entrants:</p>
							<ul className="list-disc pl-4">
								{tournament.entrants && tournament.entrants.length > 0 ? (
								tournament.entrants.map((entrant, index) => (
									<li key={index} className="text-lg">
									Name: {entrant.username} ({entrant.name})
									</li>
								))
								) : (
								<li>No Entrants</li>
								)}
							</ul>
						</div>
					</Link>
				))
			) : (
				<p>Loading tournaments...</p>
			)}
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
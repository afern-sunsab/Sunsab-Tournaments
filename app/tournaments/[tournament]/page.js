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
			setTournament(data);
		};
		fetchTournament();
	}, []);

	const handleJoin = async () => {
		await joinTournament(tournament, user);
	};

	const handleLeave = async () => {
		await leaveTournament(tournament, user);
	};

	return (
		<main className="bg-white text-black p-6">
			{tournament && tournament.name ? (
				<>
					<h1 className="text-3xl font-bold mb-4">{tournament.name}</h1>
					<div className="p-4 mb-4 flex items-start">
						<div className="relative h-40 w-40 flex-shrink-0 mr-4 border-2 border-black">
							{tournament.thumbnail ? (
								<img
									src={tournament.thumbnail}
									alt={`Thumbnail for ${tournament.name}`}
									className="h-full w-full object-cover"
								/>
							) : (
								<img
									src="/Placeholder.png"
									alt="Default Thumbnail"
									className="h-full w-full object-cover"
								/>
							)}
						</div>
						<div className="flex-1">
							<h2 className="text-xl font-bold mb-2">{tournament.name}</h2>
							<p className="text-lg mb-2">Game: {tournament.game}</p>
							<p className="mb-2">Description: {tournament.description}</p>
							<p className="mb-2">Entrant Limit: {tournament.entrant_limit}</p>
							<p className="mb-2">Registration Close Date: {timestampToDate(tournament.close_date)}</p>
							<p className="mb-2">Event Date: {timestampToDate(tournament.event_date)}</p>
							<div>
								<Link href={`/tournaments/${tournament.docId}/brackets`} className="inline-block bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-2">Brackets</Link>
							</div>
							{Date.now() >= timestampToDate(tournament.event_date) ? (
								<p className="text-lg">Completed: {tournament.completed ? "Completed" : "Not Completed"}</p>
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
								<p className="mt-4">Log in to join this tournament</p>
							)}
						</div>
					</div>
				</>
			) : (
				<h1>Loading...</h1>
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
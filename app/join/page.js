'use client'
import React from "react"
import { useState, useEffect } from "react"
import { getTournaments } from "../_utils/firebase_services"


export default function page()
{
	const [tournaments, setTournaments] = useState([]);

	useEffect(() => {
		const fetchTournaments = async () => {
			const data = await getTournaments();
			setTournaments(data);
		}
		fetchTournaments();
	}, []);

	return(
		<main className="w-full h-full">
			<h1>Join</h1>
			{tournaments.length > 0 ?
			tournaments.map((tournament) => (
				<div key={tournament.docId}>
					<h2>Name: {tournament.name}</h2>
					<p>Game: {tournament.game}</p>
					<p>Description: {tournament.description}</p>
					<button>Join</button>
				</div>
			)) : <p>Loading</p>
			}
		</main>
	)
}
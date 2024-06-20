'use client'
import React from "react"
import { useState, useEffect } from "react"
import { getTournaments, updateTournament, getUser, getUserRef } from "../_utils/firebase_services"


export default function Page()
{
	const [tournaments, setTournaments] = useState([]);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchTournaments = async () => {
			const data = await getTournaments();
			setTournaments(data);
		}
		fetchTournaments();
		const fetchUsers = async () => {
			const data = await getUser("SjKBiNC9RMTUqx8pKSf2XQkbjk03");
			setUsers(data);
		}
		fetchUsers();
	}, []);
	
	const handleJoin = async (tournament) => {
		//Add a reference with the user's docId to the tournament's entrants array
		const userRef = await getUserRef("SjKBiNC9RMTUqx8pKSf2XQkbjk03");
		tournament.entrants.push(userRef);
		//Update the tournament in the database
		await updateTournament(tournament);

	}

	return(
		<main className="w-full h-full">
			<h1>Join</h1>
			{tournaments.length > 0 ?
			tournaments.map((tournament) => (
				<div key={tournament.docId}>
					<h2>Name: {tournament.name}</h2>
					<p>Game: {tournament.game}</p>
					<p>Description: {tournament.description}</p>
					<p>Entrants:</p>
					<ul>
						{tournament.entrants.map((entrant) => (
							<li key={entrant.docID}>
								<p>Name: {entrant.username} ({entrant.name})</p>
								
							</li>
						))}
					</ul>
					<button onClick={() => handleJoin(tournament)}>Join</button>
				</div>
			)) : <p>Loading tournaments</p>
			}
			<h1>Users</h1>
			{users ?
			<div key={users.docId}>
				<h2>Name: {users.name}</h2>
				<p>Username: {users.username}</p>
				<p>Email: {users.email}</p>
			</div>
			: <p>Loading users</p>
			}
		</main>
	)
}
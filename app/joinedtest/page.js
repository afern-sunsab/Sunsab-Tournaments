'use client'
import React from "react"
import { useState, useEffect } from "react"
import { getTournaments, updateTournament, getUser, getUserRef } from "../_utils/firebase_services"
import { useUserAuth } from "../_utils/auth-context.js";
import { joinTournament, leaveTournament } from "../_utils/tournament_services";
import { getUserTournaments } from "@utils/user_services";

export default function Page() {
    const [tournaments, setTournaments] = useState([]);
    const [users, setUsers] = useState(null);
    const { user } = useUserAuth();

    /*useEffect(() => {
        const fetchTournaments = async () => {
            const data = await getTournaments();
            setTournaments(data);
        }
        fetchTournaments();
    }, []);*/

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getUser(user.uid);
            setUsers(data);
			const userTournaments = await getUserTournaments(data);
			setTournaments(userTournaments);
        }
        if (user)
            fetchUsers();
    }, [user]);
    
    const handleJoin = async (tournament) => {
        //const userRef = await getUserRef(users.uid);
        //tournament.entrants.push(userRef);
        //await updateTournament(tournament);
		const updatedTournament = await joinTournament(tournament, user);
		setTournaments(tournaments.map((t) => t.docId === updatedTournament.docId ? updatedTournament : t));
    }

	const handleLeave = async (tournament, user) => {
		const updatedTournament = await leaveTournament(tournament, user);
		setTournaments(tournaments.map((t) => t.docId === updatedTournament.docId ? updatedTournament : t));
	}

    return (
		<main className="bg-white text-black p-6">
			<h1 className="text-3xl font-bold mb-4">Join</h1>
			{tournaments.length > 0 ? 
				tournaments.map((tournament) => (
					<div key={tournament.docId} className="border border-gray-300 rounded-md p-4 mb-4">
						<h2 className="text-xl font-bold mb-2">Name: {tournament.name}</h2>
						<p className="text-lg mb-2">Game: {tournament.game}</p>
						<p className="mb-2">Description: {tournament.description}</p>
						<p className="mb-2">Entrants:</p>
						<ul>
							{tournament.entrants && tournament.entrants.length > 0 ? (
								tournament.entrants.map((entrant, index) => (
									<li key={index} className="flex items-center justify-between mb-2">
										<p className="text-sm">Name: {entrant.username} ({entrant.name})</p>
										<button 
											onClick={() => handleLeave(tournament, entrant)} 
											className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
										>
											Remove
										</button>
									</li>
								))
							) : <p>No Entrants</p>}
						</ul>
						<button 
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 focus:outline-none focus:shadow-outline"
							onClick={() => handleJoin(tournament)}
						>
							Join
						</button>
					</div>
				)) 
			: <p>Loading tournaments</p>}
			
			<h1 className="text-3xl font-bold mb-4">Users</h1>
			{users ? (
				<div className="border border-gray-300 rounded-md p-4 mb-4">
					<h2 className="text-xl font-bold">Name: {users.name}</h2>
					<p className="text-lg">Username: {users.username}</p>
					<p className="text-lg">Email: {users.email}</p>
				</div>
			) : <p>Loading users</p>}
		</main>
    )
}

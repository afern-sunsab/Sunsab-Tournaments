'use client'
import React from "react"
import { useState, useEffect } from "react"
import { getTournaments, updateTournament, getUsers, getUserRef } from "../_utils/firebase_services"
import { useUserAuth } from "../_utils/auth-context.js";
import { joinTournament, leaveTournament } from "../_utils/tournament_services";
import { createBracket, updateBracket, initializeMatches } from "../_utils/bracket_services";

export default function Page() {
    const [tournaments, setTournaments] = useState([]);
	const [bracket, setBracket] = useState(null);
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
            const data = await getUsers();
			console.log(data);
            setUsers(data);
        }
        fetchUsers();
    }, []);
    
    const handleNewBracket = async () => {
        const newBracket = await createBracket();
		const newNewBracket = await initializeMatches(newBracket, users);
		console.log("NewNewBracket:")
		console.log(newNewBracket);
		setBracket(newNewBracket);
    }

	const handleLeave = async (tournament, user) => {
		const updatedTournament = await leaveTournament(tournament, user);
		setTournaments(tournaments.map((t) => t.docId === updatedTournament.docId ? updatedTournament : t));
	}

    return (
		<main className="w-full h-full">
			<button onClick={handleNewBracket} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create Bracket</button>
			{(bracket && bracket.matches)
			&&
			Object.entries(bracket.matches).map(([roundName, round], index) => (
				<div key={index}>
				  <div>{roundName}</div>
				  {Object.entries(round).map(([matchName, match], index) => (
					<div key={index}>
					  {match.player1.user ? match.player1.user.username : "Undefined Player 1"} vs {match.player2.user ? match.player2.user.username : "Undefined Player 2"}
					</div>
				  ))}
				</div>
				))}
		</main>
	);
	
}

'use client'
import React from "react"
import { useState, useEffect } from "react"
import { getTournaments, updateTournament, getUser, getUserRef } from "../_utils/firebase_services"
import { useUserAuth } from "../_utils/auth-context.js";
import { joinTournament, leaveTournament } from "../_utils/tournament_services";
import { getUserTournaments } from "@utils/user_services";
import { getObjects } from "@utils/firebase_services";
import { sendBracketToFirestore, sendBracketToRTDB } from "@utils/bracket_services";

export default function Page() {
    const [tournaments, setTournaments] = useState([]);
	const [brackets, setBrackets] = useState([]);
	const [chosenBracket, setChosenBracket] = useState(null);
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
        const fetchBrackets = async () => {
            const data = await getObjects("brackets");
			console.log("Brackets:")
			console.log(data);
			setBrackets(data);
        }
        fetchBrackets();
    }, [user]);
    
    const handleBracketToRTDB = async (bracketID) => {
		console.log("RTDBTEST: Sending bracket to RTDB.");
		console.log("RTDBTEST: Bracket ID: " + bracketID);
		console.log("RTDBTEST: Choosing bracket: " + chosenBracket);

		const bracket = brackets.find(b => b.docId === bracketID);

		//Stupid test
		//console.log(bracket.matches.round1.match1.player1.user.id)
		//^This actually contains the docid!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		if (bracket) {
			await sendBracketToRTDB(bracket);
			console.log("RTDBTEST: Bracket sent to RTDB.");
		}
	}

    return (
		<main className="bg-white text-black p-6">
			{brackets.length > 0 ?
			<div>
			<select onChange={(e) => setChosenBracket(e.target.value)}>
				{brackets.map((bracket, index) => (
					<option key={index} value={bracket.docId}>{bracket.docId}</option>
				))}
			</select>
			<button onClick={() => handleBracketToRTDB(chosenBracket)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send Bracket to RTDB</button>
			</div>
			:
			<p>No brackets found.</p>
			}

		</main>
    )
}

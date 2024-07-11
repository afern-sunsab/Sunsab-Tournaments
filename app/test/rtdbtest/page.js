'use client'
import React from "react"
import { useState, useEffect } from "react"
import { getTournaments, updateTournament, getUser, getUserRef } from "@utils/firebase_services"
import { useUserAuth } from "@utils/auth-context.js";
import { joinTournament, leaveTournament } from "@utils/tournament_services";
import { getUserTournaments } from "@utils/user_services";
import { getObjects } from "@utils/firebase_services";
import { sendBracketToFirestore, sendBracketToRTDB, isBracketInRTDB, getBracketFromRTDB, createBracketListener, convertBracketToUserData } from "@utils/bracket_services";
import { rtdb } from "@utils/firebase";
import { ref, get, set, onValue } from "firebase/database";

export default function Page() {
    const [tournaments, setTournaments] = useState([]);
	const [brackets, setBrackets] = useState([]);
	const [chosenBracket, setChosenBracket] = useState(null);
    const [users, setUsers] = useState(null);
    const { user } = useUserAuth();

	//Meant to hold info loaded from the RTDB
	const [realtimeBracket, setRealtimeBracket] = useState(null);

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
			//console.log("RTDBTEST: Bracket sent to RTDB.");
		}
	}

	const handleBracketToFirestore = async (bracketID) => {
		console.log("RTDBTEST: Sending bracket to Firestore.");
		console.log("RTDBTEST: Bracket ID: " + bracketID);
		console.log("RTDBTEST: Choosing bracket: " + chosenBracket);

		const bracket = brackets.find(b => b.docId === bracketID);

		if (bracket) {
			await sendBracketToFirestore(bracket);
			console.log("RTDBTEST: Bracket sent to Firestore.");
		}
	};

	const handleChosenBracket = async (docID) => {
		if (docID === "") {
			setChosenBracket(null);
			console.log("Chosen bracket: null");
			return;
		}
		else
			setChosenBracket(docID);
		console.log("Chosen bracket: " + docID);

		//Check if the bracket exists within RTDB
		/*const bracketRef = ref(rtdb, `brackets/${docID}`);
		const snapshot = await get(bracketRef);
		const bracketData = snapshot.val();
		if (bracketData) {
			console.log("Bracket already exists in RTDB.");
		} else {
			console.log("Bracket does not exist in RTDB.");
		}*/
		if (await isBracketInRTDB(docID)) {
			console.log("Bracket already exists in RTDB.");
			const newBracket = await getBracketFromRTDB(docID);
			console.log(newBracket);
			setRealtimeBracket(newBracket);

			//Set up a listener for the bracket
			/*const bracketRef = ref(rtdb, `brackets/${docID}`);
			onValue(bracketRef, (snapshot) => {
				const data = snapshot.val();
				console.log("RTDBTEST: Bracket updated in RTDB.");
				console.log(data);
				setRealtimeBracket(data);
			});*/
			createBracketListener(docID, (data) => {
				console.log("RTDBTEST: Bracket updated in RTDB.");
				console.log(data);
				setRealtimeBracket(data);
			});
		} else {
			console.log("Bracket does not exist in RTDB.");
			setRealtimeBracket(null);
		}
	}

    return (
		<main className="bg-white text-black p-6">
			{brackets.length > 0 ?
			<div>
			<select onChange={(e) => handleChosenBracket(e.target.value)}>
				<option value="">Choose a bracket</option>
				{brackets.map((bracket, index) => (
					<option key={index} value={bracket.docId}>{bracket.docId}</option>
				))}
			</select>
			<button onClick={() => handleBracketToRTDB(chosenBracket)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send Bracket to RTDB</button>
			</div>
			:
			<p>No brackets found.</p>
			}
			<h1>RTDB Data</h1>
			{
				realtimeBracket && realtimeBracket.matches ?
				<div>
					{Object.entries(realtimeBracket.matches).map(([roundName, round], index) => (
						<div key={index}>
							<div>{roundName}</div>
							{Object.entries(round).map(([matchName, match], index) => (
								<div key={index}>
									{match.player1.user ? match.player1.user.name : "Undefined Player 1"} vs {match.player2.user ? match.player2.user.name : "Undefined Player 2"}
								</div>
							))}
						</div>
					))}
					<button onClick={() => handleBracketToFirestore(chosenBracket)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Banish Bracket to Firestore</button>
				</div>
				:
				<p>No RTDB data found.</p>
			}

		</main>
    )
}

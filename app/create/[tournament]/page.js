"use client"

import { getTournament } from "@utils/firebase_services";
import { createBracket, defaultBracket } from "@utils/bracket_services";
import { useState, useEffect } from "react";
import { updateTournament } from "@utils/tournament_services";
import { initializeMatches } from "@utils/bracket_services";
//Quick debug import, not needed for production
import { refsToObjects } from "@utils/firebase_services";
import { sendBracketToRTDB } from "@utils/bracket_services";

export default function Page({ params }) {
	const [tournament, setTournament] = useState();
	const [brackets, setBrackets] = useState([defaultBracket]);

	//Document title
	useEffect(() => {
		document.title = "Tournaments - New brackets";
	}, []);

	useEffect(() => {
		const fetchTournament = async () => {
			const data = await getTournament(params.tournament);
			setTournament(data);
		}
		fetchTournament();
	}, [params]);

	const handleChange = (e, index) => {
		const { name, value } = e.target;
		const updatedBrackets = [...brackets];
		updatedBrackets[index] = { ...updatedBrackets[index], [name]: value };
		setBrackets(updatedBrackets);
	};

	const handleAddBracket = () => {
		setBrackets([...brackets, { ...defaultBracket }]);
	};

	const handleRemoveBracket = (e, index) => {
		const updatedBrackets = [...brackets];
		updatedBrackets.splice(index, 1);
		setBrackets(updatedBrackets);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		//For each bracket, submit tot he database and get the docId
		const newBrackets = await Promise.all(brackets.map(async bracket => {
			const newBracket = await createBracket(bracket);
			//console.log("New bracket:")
			//console.log(newBracket)
			//console.log("Got DocID " + newBracket.docId)
			return newBracket;
		  }));
		alert("Created Brackets")
		//console.log("Brackets:")
		//console.log(newBrackets)
		const updatedTournament = { ...tournament, brackets: newBrackets };
		//Quick debug thing: Initialize matches if tournament has entrants
		if (tournament.entrants) {
			//Need to convert refs to objects...So they can be converted back to refs LOL
			const entrantData = await refsToObjects(tournament.entrants);
			console.log("BRACKET CREATION: Entrants:")
			console.log(entrantData)
			updatedTournament.brackets[0] = await initializeMatches(updatedTournament.brackets[0], entrantData);
			//Also send the bracket to the RTDB
			await sendBracketToRTDB(updatedTournament.brackets[0], true);
		}
		await updateTournament(updatedTournament);
		alert("Updated Tournament with Brackets")
		//Redirect to the tournament page
		window.location.href = `/tournaments/${tournament.docId}`;
	};

	return (
		<main className="bg-white text-black p-6">
			{tournament ? (
				<>
					<h1 className="text-2xl font-bold mb-4">Create Brackets for {tournament.name}</h1>
					<form onSubmit={handleSubmit} className="flex flex-col space-y-4" >
						{brackets.map((bracket, index) => (
							<div className="flex flex-col space-y-4 border border-black-3 p-3 rounded-md">
								<label htmlFor={bracket.name}>Bracket Name: </label>
								<input 
									type="text"
									name="name"
									id={bracket.name}
									value={bracket.name}
									placeholder="Bracket Name"
									onChange={(e) => handleChange(e, index)}
									className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-blue-500"
								/>
								<label htmlFor={bracket.style}>Bracket Style: </label>
								<select 
									name="style" 
									id={bracket.style} 
									value={bracket.style} 
									onChange={(e) => handleChange(e, index)} 
									className="border border-black-3 p-3 rounded-md focus:border-blue-500"
								>
									<option value="single">Single Elimination</option>
									<option value="double">Double Elimination</option>
									<option value="robin">Round Robin</option>
								</select>
								<label htmlFor={bracket.capacity}>Bracket Capacity: </label>
								<input 
									type="number"
									name="capacity"
									id={bracket.capacity}
									value={bracket.capacity}
									placeholder="Bracket Capacity"
									onChange={(e) => handleChange(e, index)} 
									className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-blue-500"
								/>
								<button type="button" onClick={() => handleRemoveBracket(index)} className="mt-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300">Remove Bracket</button>
							</div>
						))}
						<div>
							<button type="button" onClick={handleAddBracket} className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300">Add Bracket</button>
						</div>
						<button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300">Submit</button>
					</form>
				</>
			) : (
				<h1>Loading</h1>
			)}
		</main>
	)
}  
"use client"

import { useUserAuth } from "@utils/auth-context";
import { useState, useEffect } from "react";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { createTournament } from "@utils/tournament_services";
import { strg } from "@utils/firebase";
import EditThumbnail from "@components/images/edit-thumbnail";
import { defaultTournament } from "@utils/tournament_services";
import { getHighestID } from "@utils/firebase_services";

export default function Page() {
	const { user } = useUserAuth();
	const [tournament, setTournament] = useState(defaultTournament);

	//Document title
	useEffect(() => {
		document.title = "Tournaments - Create Tournament";
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setTournament((prevTournament) => ({ ...prevTournament, [name]: value }));
	}

	const handleDateChange = (e) => {
		const { name, value } = e.target;
		const date = new Date(value);
		setTournament((prevTournament) => ({ ...prevTournament, [name]: date }))
	};

	// const handleThumbnailChange = async (e) => {
	// 	const file = e.target.files[0];
	// 	const thumbnailRef = ref(strg, `thumbnails/tournaments/${tournament.id}`);
	// 	await uploadBytes(thumbnailRef, file);
	// 	const thumbnailUrl = await getDownloadURL(thumbnailRef);
	// 	setTournament((prevTournament) => ({ ...prevTournament, thumbnail: thumbnailUrl }))
	// };

	const handleThumbnailChange = async (e) => {
		const file = e.target.files[0];
		const thumbnailUrl = URL.createObjectURL(file);
		setTournament((prevTournament) => ({ ...prevTournament, thumbnail: thumbnailUrl }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		const converted_close_date = new Date(tournament.close_date);
		const converted_event_date = new Date(tournament.event_date);

		const file = await fetch(tournament.thumbnail).then(res => res.blob());
		const thumbnailRef = ref(strg, `thumbnails/tournaments/${await getHighestID('tournaments')+1}`);
		await uploadBytes(thumbnailRef, file);
		const thumbnailUrl = await getDownloadURL(thumbnailRef);

		const newTournament = { ...tournament, close_date: converted_close_date, event_date: converted_event_date, owner: user.docId, thumbnail: thumbnailUrl }
		const document = await createTournament(newTournament);
		window.location.href = `/create/${document.docId}`;
	}

	return(
		<main className="bg-white text-black p-6">
		{user ? (
			<form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
				{console.log(user)}
				<label htmlFor="name" className="text-sm font-medium">Name:</label>
				<input
					type="text"
					name="name"
					id="name"
					value={tournament.name}
					placeholder="Tournament Name"
					onChange={handleChange}
					className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-blue-500"
				/>

				<label htmlFor="description" className="text-sm font-medium">Description:</label>
				<textarea
					name="description"
					id="description"
					value={tournament.description}
					placeholder="Tournament Description"
					onChange={handleChange}
					className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-blue-500"
					rows={4}
				/>

				<label htmlFor="game" className="text-sm font-medium">Game:</label>
				<input
					type="text"
					name="game"
					id="game"
					value={tournament.game}
					placeholder="Game Name"
					onChange={handleChange}
					className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-blue-500"
				/>

				<label htmlFor="entrant_limit" className="text-sm font-medium">Entrant Limit:</label>
				<input
					type="number"
					name="entrant_limit"
					id="entrant_limit"
					value={tournament.entrant_limit}
					onChange={handleChange}
					className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-blue-500"
				/>

				<label htmlFor="close_date" className="text-sm font-medium">Registration Close Date:</label>
				<input
					type="date"
					name="close_date"
					id="close_date"
					value={new Date(tournament.close_date).toISOString().split('T')[0]}
					onChange={handleDateChange}
					className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-blue-500"
				/>

				<label htmlFor="event_date" className="text-sm font-medium">Tournament Date:</label>
				<input
					type="date"
					name="event_date"
					id="event_date"
					value={new Date(tournament.event_date).toISOString().split('T')[0]}
					onChange={handleDateChange}
					className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-blue-500"
				/>
				<EditThumbnail handleThumbnailChange={handleThumbnailChange} thumbnail={tournament.thumbnail}/>
				<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">Submit</button>
			</form>
		) : (
			<h1>You must be logged in to create a tournament</h1>
		)}
		</main>
	)
}
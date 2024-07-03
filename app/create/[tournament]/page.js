"use client"

import { getTournament } from "@utils/firebase_services";
import { useState, useEffect } from "react";

export default function Page({ params }) {
	const [tournament, setTournament] = useState();

	useEffect(() => {
        const fetchTournament = async () => {
            const data = await getTournament(params.tournament);
            setTournament(data);
        }
        fetchTournament();
    }, [params]);

	return (
		<main>
			{tournament ? (
				<>
					<h1>Create Brackets</h1>
					{console.log(tournament)}
					<h1>{tournament.name}</h1>
				</>
			) : (
				<h1>Loading</h1>
			)}
		</main>
	)
}
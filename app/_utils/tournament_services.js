import { updateTournament, getTournament, getUserRef, getUser } from "./firebase_services";

//Adds a user to the entrants array of a tournament
//"tournament" is a JavaScript object representing a tournament document
//"user" is a JavaScript object representing a user document
//Returns the updated tournament object
export const joinTournament = async (tournament, user) => {
	//If tournament somehow lacks entrants field, add it
	if (!tournament.entrants) {
		tournament.entrants = [];
	}

	//Check if user is already an entrant
	const entrantIndex = tournament.entrants.findIndex(entrant => entrant.uid === user.uid);
	if (entrantIndex === -1) {
		tournament.entrants.push(user);
		await updateTournament(tournament);
		console.log(`User ${user.id} joined tournament ${tournament.name}`);
	} else {
		console.log(`User ${user.id} is already an entrant in tournament ${tournament.name}`);
	}
	return tournament;
}
import React, { useState } from 'react';
//import { declareWinner, setScore } from '@utils/bracket_services';

export default function Match({match, handleWinner, handleScore}) {
	const [showPopup, setShowPopup] = useState(false);
	//console.log(match)

	// const match = {
	// 	player1: {
	// 		name: "test",
	// 		score: 2,
	// 	},
	// 	player2: {
	// 		name: "lose",
	// 		score: -1
	// 	},
	// 	isBye: false,
	// 	nextMatch: null
	// };

	const togglePopup = () => {
		setShowPopup(!showPopup);
	};

	//Declares a winner, passes the winner to the parent component (single.js, for now)
	const handleDeclareWinner = (player) => {
		console.log("Declaring winner: " + player);
		handleWinner(player);
		togglePopup();
	}

	//Changes the score of a player, passes the new score to the parent component (single.js, for now)
	//Angelo will need to create the interface for this
	const handleChangeScore = (player, score) => {
		console.log("Changing score for " + player + " to " + score);
		handleScore(player, score);
	}

	return (
		<div className="relative">
		<div
			onClick={togglePopup}
			className="max-w-xs mx-auto bg-gray-300 px-4 py-2 rounded-md shadow-md transition duration-200 ease-in-out hover:bg-gray-400 cursor-pointer"
		>
			<div className="flex flex-col items-center">
			<div className="flex items-center justify-between w-full mt-1">
				{match.player1.user && (
				<div className="flex items-center w-full justify-between">
					<h1 className="text-md font-medium text-gray-900">{match.player1.user.username}</h1>
					<div className="w-16 h-8 bg-gray-200 rounded-md flex items-center justify-end px-2">
					<span className="text-sm font-medium text-gray-900">{match.player1.score}</span>
					</div>
				</div>
				)}
			</div>
			<div className="border-t border-gray-400 w-full my-1"></div>
			<div className="flex items-center justify-between w-full mt-1">
				{match.player2.user && (
				<div className="flex items-center w-full justify-between">
					<h1 className="text-md font-medium text-gray-900">{match.player2.user.username}</h1>
					<div className="w-16 h-8 bg-gray-200 rounded-md flex items-center justify-end px-2">
					<span className="text-sm font-medium text-gray-900">{match.player2.score}</span>
					</div>
				</div>
				)}
			</div>
			</div>
		</div>
		{/* Popup panel for match details */}
		{showPopup && (
			<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-60 z-50">
			<div
				onClick={(e) => e.stopPropagation()}
				className="bg-white p-6 rounded-md shadow-lg w-80"
			>
				<p className="text-lg font-semibold mb-4 text-gray-900">Match Details</p>
				{/* <p className="mb-4 text-gray-700">
				<button
					className="text-blue-600 hover:underline"
					onClick={() => handleDeclareWinner("player1")}
				>
					{match.player1.user ? match.player1.user.username : ""}
				</button>
				{" vs "}
				<button
					className="text-blue-600 hover:underline"
					onClick={() => handleDeclareWinner("player2")}
				>
					{match.player2.user ? match.player2.user.username : ""}
				</button>
				</p>
				<p className="mb-4 text-gray-700">
				Score:
				<button
					className="text-gray-800 hover:underline mx-2"
					onClick={() => handleChangeScore("player1", match.player1.score + 1)}
				>
					{match.player1.score}
				</button>
				-
				<button
					className="text-gray-800 hover:underline mx-2"
					onClick={() => handleChangeScore("player2", match.player2.score + 1)}
				>
					{match.player2.score}
				</button>
				</p> */}
				<div className="flex">
					{Object.entries(match).map(([playerName, player], index) => (
						player.user && 
						(
						<div key={index} className="flex flex-col">
							<div key={index} className="flex items-center justify-between">
								<button onClick={() => handleDeclareWinner(playerName)}>{player.user.username}</button>
								<p>{player.score}</p>
							</div>
							{/* Score input */}
							{/* WHAT */}
							<div className="flex justify-evenly">
								{[...Array(6).keys()].map(i => (
									<button key={i} onClick={() => handleChangeScore(playerName, i)}>{i}</button>
								))}
							</div>
						</div>
						)
					))}
				</div>
				<button
				className="mt-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
				onClick={togglePopup}
				>
				Close
				</button>
			</div>
			</div>
		)}
		</div>
	);
	}
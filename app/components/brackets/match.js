import React, { useState } from 'react';
//import { declareWinner, setScore } from '@utils/bracket_services';

export default function Match({match, handleWinner}) {
	const [showPopup, setShowPopup] = useState(false);
	console.log(match)

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

	const handleDeclareWinner = (player) => {
		console.log("Declaring winner: " + player);
		handleWinner(player);
		togglePopup();
	}

	return (
		<main>
		{match &&
		<div onClick={togglePopup} className="max-w-48 mx-auto bg-slate-200 px-2 py-1.5 rounded-sm shadow-md transition duration-250 ease-in-out hover:bg-slate-500 hover:text-white hover:shadow-lg cursor-pointer">
			<div className="flex flex-col items-center justify-center">
			<div className="flex items-center justify-between w-full mt-1">
					{match.player1.user ? (
						<div className='flex'>
							<div className="flex items-center">
									<h1 className="text-md font-medium">{match.player1.user.username}</h1>
							</div>
							<div className="w-8 h-8 bg-gray-300 rounded-md flex items-center justify-center">
								<span className="text-sm font-medium">{match.player1.score}</span>
							</div>
						</div>
					) : (<></>)}
				</div>
				<div className="border-t border-gray-400 w-full my-1"></div>
				<div className="flex items-center justify-between w-full mt-1">
					{match.player2.user ? (
						<div className='flex'>
							<div className="flex items-center">
								<h1 className="text-md font-medium">{match.player2.user.username}</h1>
							</div>
							<div className="w-8 h-8 bg-gray-300 rounded-md flex items-center justify-center">
								<span className="text-sm font-medium">{match.player2.score}</span>
							</div>
						</div>
					) : (<></>)}
				</div>
			</div>

		{showPopup && (
			<div style={{ cursor: 'default' }} className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-50 z-50 text-black">
			<div onClick={(e) => e.stopPropagation()} className="bg-white p-4 rounded-md shadow-md" >
				<p className="text-lg font-medium mb-2">Match Details</p>
				
					<p>
						<button onClick={() => handleDeclareWinner("player1")}>
							{match.player1.user ? match.player1.user.username : ""}
						</button>
						vs
						<button onClick={() => handleDeclareWinner("player2")}>
							{match.player2.user ? match.player2.user.username : ""}
						</button>
						</p>
						
				<p>Score: {match.player1.score} - {match.player2.score}</p>
				<button className="mt-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
						onClick={togglePopup}>
				Close
				</button>
			</div>
			</div>
		)}
		</div>
	}
	</main>
	)
}

import React, { useState } from "react";
//import { declareWinner, setScore } from '@utils/bracket_services';

export default function Match({ match, handleWinner, handleScore }) {
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
  };

  //Changes the score of a player, passes the new score to the parent component (single.js, for now)
  //Angelo will need to create the interface for this
  const handleChangeScore = (player, score) => {
    console.log("Changing score for " + player + " to " + score);
    handleScore(player, score);
  };

  return (
    <div className="relative">
      <div
        onClick={togglePopup}
        className="max-w-xs mx-auto bg-white px-4 py-2 rounded-md shadow-md transition duration-200 ease-in-out hover:bg-sunsab-yellow-hover cursor-pointer"
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-between w-full mt-1">
            {match.player1.user && (
              <div className="flex items-center justify-between w-full">
                <h1 className="text-md font-semibold text-gray-900">
                  {match.player1.user.username}
                </h1>
                <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center px-2">
                  <span className="text-sm font-semibold text-sunsab-yellow">
                    {match.player1.score}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-gray-400 w-full my-2"></div>
          <div className="flex items-center justify-between w-full mt-1">
            {match.player2.user && (
              <div className="flex items-center justify-between w-full">
                <h1 className="text-md font-semibold text-gray-900">
                  {match.player2.user.username}
                </h1>
                <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center px-2">
                  <span className="text-sm font-semibold text-sunsab-yellow">
                    {match.player2.score}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup panel for match details */}
      {showPopup && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
          onClick={togglePopup}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xl font-bold mb-6 text-gray-900 text-center">
              Match Details
            </p>
            <div className="flex items-center justify-around">
              {Object.entries(match).map(
                ([playerName, player], index) =>
                  player.user && (
                    <div key={index} className="flex flex-col items-center">
                      <div className="flex items-center justify-between w-full">
                        {index % 2 === 0 ? (
                          <>
                            <button
                              className="text-lg font-bold text-gray-900"
                              onClick={() => handleDeclareWinner(playerName)}
                            >
                              {player.user.username}
                            </button>
                            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                              <span className="text-xl font-bold text-sunsab-yellow">
                                {player.score}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                              <span className="text-xl font-bold text-sunsab-yellow">
                                {player.score}
                              </span>
                            </div>
                            <button
                              className="text-lg font-bold text-gray-900"
                              onClick={() => handleDeclareWinner(playerName)}
                            >
                              {player.user.username}
                            </button>
                          </>
                        )}
                      </div>
                      <div className="flex space-x-1 mt-2">
                        {[...Array(6).keys()].map((i) => (
                          <button
                            key={i}
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
                            onClick={() => handleChangeScore(playerName, i)}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
            <div className="flex justify-center mt-6">
              <button
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
                onClick={togglePopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

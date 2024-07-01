"use client"
import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { rtdb } from "../../_utils/firebase";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import '../../styling/createEvent.css'; // Assuming you have a separate stylesheet for brackets


const CreateBracket = ({ isOpen, setIsOpen, onBracketCreated }) => {
  const [numParticipants, setNumParticipants] = useState(0);
  const [matches, setMatches] = useState([]);

  const handleChangeNumParticipants = (e) => {
    const { value } = e.target;
    setNumParticipants(parseInt(value));
  };

  const generateBracket = () => {
    // Validate number of participants is a power of 2
    if (!Number.isInteger(Math.log2(numParticipants))) {
      alert('Number of participants must be a power of 2 for single elimination bracket.');
      return;
    }

    const newMatches = [];
    let matchIdCounter = 1;

    // Generate matches for each round
    for (let round = 1; round <= Math.log2(numParticipants); round++) {
      const numMatches = numParticipants / Math.pow(2, round);

      for (let matchIndex = 1; matchIndex <= numMatches; matchIndex++) {
        const match = {
          id: matchIdCounter,
          name: round === Math.log2(numParticipants) ? "Final - Match" : `Round ${round} - Match ${matchIndex}`,
          nextMatchId: null, // Initially set nextMatchId to null
          nextLooserMatchId: null,
          tournamentRoundText: round.toString(),
          startTime: '',
          state: '',
          participants: [{}, {}] // Initialize with empty participants
        };

        newMatches.push(match);
        matchIdCounter++;
      }
    }

    // Link matches to their subsequent rounds
    for (let i = 0; i < newMatches.length; i++) {
      const match = newMatches[i];
      const nextRound = parseInt(match.tournamentRoundText) + 1;
      if (nextRound <= Math.log2(numParticipants)) {
        const nextRoundMatches = newMatches.filter(m => m.tournamentRoundText === nextRound.toString());
        
        // Set nextMatchId for all matches in round 2 to the last match in round 3
        match.nextMatchId = nextRoundMatches[nextRoundMatches.length - 1]?.id || null;

        // Set nextLooserMatchId for even-indexed matches (second match in a pair)
        if (i % 2 === 1) {
          match.nextLooserMatchId = nextRoundMatches[nextRoundMatches.length - 2]?.id || null;
        }
      }
    }

    setMatches(newMatches);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBracketRef = push(ref(rtdb, 'brackets'));
      const newBracketId = newBracketRef.key;
      await set(newBracketRef, { matches });
      console.log('Bracket document written with ID:', newBracketId);
      onBracketCreated(newBracketId); // Pass bracket ID to parent component
      alert('Bracket created successfully!');
      setIsOpen(false); // Close the bracket modal after creation
    } catch (error) {
      console.error('Error adding bracket document: ', error);
      alert('Error adding bracket. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="createBracketModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="my-custom-overlay"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="my-custom-card"
          >
            <FiAlertCircle className="my-custom-text" />
            <div className="relative z-10">
              <h3 className="my-custom-text1">
                Create Bracket
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="my-custom-input">
                  <input
                    type="number"
                    name="numParticipants"
                    value={numParticipants}
                    onChange={handleChangeNumParticipants}
                    placeholder="Number of Participants (must be a power of 2)"
                    required
                  />
                </div>
                <button type="button" onClick={generateBracket}>
                  Generate Bracket
                </button>
                {matches.length > 0 && (
                  <div>
                    {matches.map((match, matchIndex) => (
                      <div key={`match${match.id}`}>
                        <h5>{`${match.name}`}</h5>
                        <div className="my-custom-input">
                          <input
                            type="text"
                            name="nextMatchId"
                            value={match.nextMatchId || ''}
                            readOnly
                            placeholder="Next Match ID"
                          />
                        </div>
                        <div className="my-custom-input">
                          <input
                            type="text"
                            name="nextLooserMatchId"
                            value={match.nextLooserMatchId || ''}
                            readOnly
                            placeholder="Next Looser Match ID"
                          />
                        </div>
                        <div className="my-custom-input">
                          <input
                            type="text"
                            name="tournamentRoundText"
                            value={match.tournamentRoundText}
                            readOnly
                            placeholder="Tournament Round Text"
                          />
                        </div>
                        <div className="my-custom-input">
                          <input
                            type="text"
                            name="state"
                            value={match.state}
                            readOnly
                            placeholder="State"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="my-flex-container">
                  <button type="submit" className="my-exit">
                    Create Bracket
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="my-exit"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateBracket;
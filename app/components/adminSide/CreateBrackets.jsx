"use client"
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState } from "react";
import '../../styling/createEvent.css'; // Assuming you have a separate stylesheet for bracketes

// Firebase
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from "../../_utils/firebase";



const CreateBracket = ({ isOpen, setIsOpen, onBracketCreated }) => {
  const [bracketDetails, setBracketDetails] = useState({
    initial_matches: [],
    matches:  [],
    style: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBracketDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'brackets'), {
        initial_matches: bracketDetails.initial_matches,
        matches: bracketDetails.matches,
        style: bracketDetails.style
      });
      console.log('Bracket document written with ID: ', docRef.id);
      onBracketCreated(docRef.id); // Pass bracket ID to parent component
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
                    type="text"
                    name="initial_matches"
                    value={bracketDetails.initial_matches}
                    onChange={handleChange}
                    placeholder="Initial Matches"
                    required
                  />
                </div>
                <div className="my-custom-input">
                  <input
                    type="text"
                    name="matches"
                    value={bracketDetails.matches}
                    onChange={handleChange}
                    placeholder="Matches"
                    required
                  />
                </div>
                <div className="my-custom-input">
                  <input
                    type="text"
                    name="style"
                    value={bracketDetails.style}
                    onChange={handleChange}
                    placeholder="Bracket Style"
                    required
                  />
                </div>
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
"use client"
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState } from "react";
import '../../styling/createEvent.css'
import { v4 as uuidv4 } from 'uuid';

// Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Authentication method
import { auth } from '../../_utils/firebase'; // Import Firebase auth instance
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from "../../_utils/firebase"; // Ensure db is imported
import { useRouter } from 'next/navigation';

const CreateAllUser = () => {
    
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="layoutCustom">
        <button
          onClick={() => setIsOpen(true)}
          className="my-custom-button"
        >
          Open Modal
        </button>
        <CreateUser isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    );
  };

const CreateUser = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    email: ' ',
    name: ' ',
    pronouns: ' ',
    username: ' '
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Generate a random user_id using uuidv4
    const user_id = uuidv4();

    // Example of adding user details to Firestore
    const docRef = await addDoc(collection(db, 'users'), {
      user_id, // Randomly generated user ID
      email: userDetails.email,
      name: userDetails.name,
      pronouns: userDetails.pronouns,
      username: userDetails.username
    });
    console.log('Document written with ID: ', docRef.id);
    alert('User details added successfully!');

    // Register the user with Firebase Authentication
    const { email, password } = userDetails; // Assuming you also collect password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    router.push('./signup');

    setIsOpen(false); // Close modal after adding user details
    // Reset form (optional, depending on your use case)
    setUserDetails({
      email: '',
      name: '',
      pronouns: '',
      username: ''
    });
  } catch (error) {
    console.error('Error adding document or registering user:', error);
    alert('Error adding user details or registering user. Please try again.');
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="my-custom-overlay"
        >
          <motion.div
            initial={{ scale: 0, rotate: '12.5deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            exit={{ scale: 0, rotate: '0deg' }}
            onClick={(e) => e.stopPropagation()}
            className="my-custom-card"
          >
            <FiAlertCircle className="my-custom-text" />
            <div className="relative z-10">
              <h3 className="my-custom-text1">User Details</h3>
              <form onSubmit={handleSubmit}>
                <div className="my-custom-input">
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="my-custom-input">
                  <input
                    type="text"
                    name="name"
                    value={userDetails.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="my-custom-input">
                  <input
                    type="text"
                    name="pronouns"
                    value={userDetails.pronouns}
                    onChange={handleChange}
                    placeholder="Pronouns"
                    required
                  />
                </div>
                <div className="my-custom-input">
                  <input
                    type="text"
                    name="username"
                    value={userDetails.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="my-flex-container">
                  <button type="submit" className="my-exit">
                    Save User Details
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

export default CreateAllUser;
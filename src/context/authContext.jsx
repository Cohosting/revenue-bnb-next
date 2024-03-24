import React, { useState, createContext, useEffect, useContext } from 'react';
import dynamic from 'next/dynamic';

import jwt from 'jsonwebtoken';
import {  doc, getDoc } from 'firebase/firestore'; // Import Firestore modules
import { db } from "./../lib/firebase"

export const AuthContext = createContext(null)
const TOKEN_KEY = 'revenuebnb_token';

export const AuthContextComponent = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    const [isUserSearched, setUserSearched] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false)
  
    useEffect(() => {
      const checkLocalStorageToken = async () => {
        // Check if a token exists in localStorage
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          try {
            // Verify the token
            const decodedToken = jwt.decode(token);
            // Check if the token has an expiration time
            if (decodedToken && decodedToken.exp) {
              const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
              if (decodedToken.exp < currentTime) {
                // Token has expired
                localStorage.removeItem("revenuebnb_token")
                setCurrentUser(null);
                setUserSearched(true)

                return;
              }
            } else {
              // Token doesn't have an expiration claim
              setCurrentUser(null);
              console.log('Token does not have an expiration claim.');
              return;
            }
  
            // Fetch user data based on the user ID (adjust this logic to your Firestore structure)
            const userId = decodedToken.userId;
            const userRef = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userRef);
  
            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              setCurrentUser(userData);
            } else {
              setCurrentUser(null);
              console.log('User data not found.');
            }
          } catch (error) {
            console.error('Token verification or decoding error.', error);
            setCurrentUser(null);
          }
          setUserSearched(true)

        } else {
          console.log("Token is null")
          setCurrentUser(null); 
          setUserSearched(true)
        }
      };
  
      checkLocalStorageToken();
    }, []);


    return (
      <AuthContext.Provider value={{ currentUser, setCurrentUser, isUserSearched, showAuthModal, setShowAuthModal }}>
        {children}
      </AuthContext.Provider>
    );
  };

export function useAuth() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContext;
}
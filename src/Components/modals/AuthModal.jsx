import { Button, Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Input, Text, SlideFade, Radio, Stack, RadioGroup, Spinner, Collapse } from '@chakra-ui/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { debounce, set } from 'lodash'; // External library for debounce
import { addDoc, collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import jwt from 'jsonwebtoken';
import { sentResultMail } from '../../lib/Mail';
import stateProvider from '../../context/stateProvider';
import { setBaseResultDoc } from '../../lib/reports';
import { AuthContext } from '../../context/authContext';
import Confirmation from '../../auth/Confirmation';
function isValidEmail(email) {
  // Regular expression pattern for email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailPattern.test(email);
}
function generateToken(userId, reportId) {
  // Generate token with a payload

  try {
    const payload = { userId, reportId };
    const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!secretKey) {
      console.error('JWT secret key not found in environment variables');
      // Handle the error appropriately
    }
  
    const token = jwt.sign(payload, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.log("Error generating JWT?:", error)
  }

}
export const AuthModal = () => {
  const [showConfirmingEmail, setShowConfirmingEmail] = useState(false)
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  const [userCheckLoading, setUserCheckLoading] = useState(false);
  const { showAuthModal, setShowAuthModal } = useContext(AuthContext)
  const [isUserNotExist, setIsUserNotExist] = React.useState(false);
  const [foundUser, setFoundUser] = useState(null)
  const [isDisabled, setIsDisabled] = useState(true);
  const debounceTimeout = useRef(null);
  const [isNewUser, setIsNewUser] = useState(null);
  const [searchPending, setSearchPending] = useState(false);

  const {
    propertyCoordinates,
    counts,
    location,
    state

  } = useContext(stateProvider);
  const { bedrooms, bathrooms, guests } = counts;
  const [userInfo, setUserInfo] = React.useState({
    email: '',
    fullName: '',
    userType: 'Property Owner',
  });
  useEffect(() => {

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

    };
  }, []);

  
  const handleChange = (e, shouldDebouce= true) => {
    setError('')

    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });

  }; 
  const handleEmailChange = (e) => {
    setIsDisabled(true); // Disable button as soon as user types
    setUserInfo({ ...userInfo, email: e.target.value });
    setIsNewUser(null);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (isValidEmail(e.target.value)) {
      debounceTimeout.current = setTimeout(() => {
        setSearchPending(true);  // Indicate that a search is pending
        searchUser(e.target.value);
      }, 500);
    } else {
      setUserCheckLoading(false);
      setIsUserNotExist(false);
      setIsDisabled(true); // Keep the button disabled if email is invalid
    }
};

const searchUser = async (value) => {
    setUserCheckLoading(true);
    setIsUserNotExist(false);

    if (!isValidEmail(value))  {
      setUserCheckLoading(false);
      setIsDisabled(true); // Keep the button disabled if email is invalid
      setSearchPending(false); // Indicate that the search is no longer pending
      return;
    };

    const collRef = collection(db, 'users');
    const  q = query(collRef, where('email', '==', value));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setIsUserNotExist(true);
    } else {
      setFoundUser(querySnapshot.docs[0].data());
      setIsUserNotExist(false);
    }

    setUserCheckLoading(false);
    setIsDisabled(searchPending); // Disable the button if a search is pending
    setSearchPending(false); // Indicate that the search is no longer pending
};
  const handleGenerateResult = async () => {
    try {
      if (!isUserNotExist && foundUser) {
        console.log("Starting to create result for existing user...");
      } else if (!userInfo.email) {
        throw new Error("User email is not provided.");
      } else if (isUserNotExist && (!userInfo.fullName || !userInfo.userType)) {
        throw new Error("User full name or user type is not provided for a new user.");
      }
  
      setIsLoading(true);
  
      let reportId, token, ref, commonBody;
  
      if (!isUserNotExist && foundUser) {
        try {
          reportId = await setBaseResultDoc({
            location,
            bedrooms,
            bathrooms,
            guests,
            coordinates: propertyCoordinates,
            createdByEmail: foundUser.email,
            amenities: state.selectedValue,
            createdBy: foundUser.id,
          });
        } catch (error) {
          console.error('Error setting base result document:', error);
          throw error; 
        }
  
        token = generateToken(foundUser.id, reportId,);
        ref = doc(db, 'users', foundUser.id);
        try {
          await updateDoc(ref, { token });
        } catch (error) {
          console.error('Error updating document:', error);
          throw error;
        }
  
        commonBody = {
          location,
          bedrooms,
          bathrooms,
          guests,
          coordinates: propertyCoordinates,
          createdByEmail: foundUser.email,
          amenities: state.selectedValue,
          createdBy: foundUser.id,
          reportId,
          existingUser: true,
          email: foundUser.email,
          fullName: foundUser.fullName,
          userType: foundUser.userType,
        };
  
        try {
          await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(commonBody),
          });
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
  
        try {
          await sentResultMail(reportId, location, propertyCoordinates, userInfo.email, userInfo.fullName, bedrooms, token);
        } catch (error) {
          console.error('Error sending result mail:', error);
          throw error;
        }
  
      } else {
        ref = doc(collection(db, 'users'));
  
        try {
          reportId = await setBaseResultDoc({
            location,
            bedrooms,
            bathrooms,
            guests,
            coordinates: propertyCoordinates,
            createdByEmail: userInfo.email,
            amenities: state.selectedValue,
            createdBy: ref.id,
          });
        } catch (error) {
          console.error('Error setting base result document:', error);
          throw error;
        }
  
        token = generateToken(ref.id, reportId,);
  
        try {
          await sentResultMail(reportId, location, propertyCoordinates, userInfo.email, userInfo.fullName, bedrooms, token);
        } catch (error) {
          console.error('Error sending result mail:', error);
          throw error;
        }
  
        try {
          await setDoc(ref, {
            email: userInfo.email,
            fullName: userInfo.fullName,
            userType: userInfo.userType,
            token,
            id: ref.id,
            isNewUser: true,
          });
        } catch (error) {
          console.error('Error setting document:', error);
          throw error;
        }
  
        commonBody = {
          location,
          bedrooms,
          bathrooms,
          guests,
          coordinates: propertyCoordinates,
          createdByEmail: userInfo.email,
          amenities: state.selectedValue,
          createdBy: ref.id,
          reportId,
          existingUser: false,
          email: userInfo.email,
          fullName: userInfo.fullName,
          userType: userInfo.userType,
        };
  
        try {
          await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(commonBody),
          });
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
      }
  
      setIsLoading(false);
      setShowAuthModal(false);
      setShowConfirmingEmail(true);
      
    } catch (err) {
      console.error("Error in handleGenerateResult function:", err.message);
      setIsLoading(false);
    }
  }

/*   const handleGenerateResult = async () => {

    if(!isUserNotExist && foundUser) {
      console.log("Result is creating for existing user")
      setIsLoading(true)
      try {

  
        const reportId = await setBaseResultDoc({
          location,
          bedrooms,
          bathrooms,
          guests,
          coordinates: propertyCoordinates,
          createdByEmail: foundUser.email,
          amenities: state.selectedValue,
          createdBy: foundUser.id
        });  
        const token = generateToken(foundUser.id, reportId,);
        const ref = doc(db, 'users', foundUser.id)
        await updateDoc( ref, {
          token
        })

        await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            location,
            bedrooms,
            bathrooms,
            guests,
            coordinates: propertyCoordinates,
            createdByEmail: foundUser.email,
            amenities: state.selectedValue,
            createdBy: foundUser.id,
            reportId,
            existingUser: true,
            email: foundUser.email,
            fullName: foundUser.fullName,
            userType: foundUser.userType,
          })
        })
       await sentResultMail(
          reportId,
          location,
          propertyCoordinates,
          userInfo.email,
          userInfo.fullName,
          bedrooms,
          token
        ); 
        setIsLoading(false)
        setShowAuthModal(false);
        setShowConfirmingEmail(true)

        
            } catch(err) {
        console.log("Error creating result for existing user:", err);

        setIsLoading(false)
      }

    

      return
    }
    if(!userInfo.email) {
      setError("Please fill all the input")
    };

    if(isUserNotExist) {
      if(!userInfo.fullName || !userInfo.userType) {
        setError("Please fill all the input")
        return
      }
    };
    setIsLoading(true)

    try {
      const ref = doc(collection(db, 'users'));

      const reportId = await setBaseResultDoc({
        location,
        bedrooms,
        bathrooms,
        guests,
        coordinates: propertyCoordinates,
        createdByEmail: userInfo.email,
        amenities: state.selectedValue,
        createdBy: ref.id
      });  
      const token = generateToken(ref.id, reportId,);
      await sentResultMail(
        reportId,
        location,
        propertyCoordinates,
        userInfo.email,
        userInfo.fullName,
        bedrooms,
        token
      ); 
      await setDoc(ref, {
        email: userInfo.email,
        fullName: userInfo.fullName,
        userType: userInfo.userType,
        token,
        id: ref.id,
        isNewUser: true
      });
      await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location,
          bedrooms,
          bathrooms,
          guests,
          coordinates: propertyCoordinates,
          createdByEmail: foundUser.email,
          amenities: state.selectedValue,
          createdBy: foundUser.id,
          reportId,
          existingUser: false,
          email: userInfo.email,
          fullName: userInfo.fullName,
          userType: userInfo.userType,
        })
      })
  


      setIsLoading(false)
      setShowAuthModal(false);
      setShowConfirmingEmail(true)

    } catch(err) {
      console.log("Error creating rreports and token:", err)
      setIsLoading(false)

    }
 
  }
 */

  return (
    <>
   
    <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} >
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Welcome to RevenueBnB</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
      <Box>
            <Text>Email</Text>
            <Input onChange={handleEmailChange} value={userInfo.email} name='email' />
          </Box>
          {
            userCheckLoading && (
              <Spinner my={3} />
            )
          }

   
              <Collapse in={isUserNotExist === true}>
       <Box my={2}>
            <Text>Full Name</Text>
            <Input onChange={(e) => handleChange(e, false)} value={userInfo.fullName} name='fullName' />
          </Box>

          <Box my={2}>
            <Text>I am...</Text>
           
            <RadioGroup
  onChange={(val) => {
    setUserInfo({ ...userInfo, userType: val });
  }}
  value={userInfo.userType}
>
  <Stack direction="column">
    <Radio size="sm" name="userType" colorScheme="orange" value="propertyOwner">
      Property Owner
    </Radio>
    <Radio size="sm" name="userType" colorScheme="orange" value="buyer">
      Buyer
    </Radio>
    <Radio size="sm" name="userType" colorScheme="orange" value="realEstateAgent">
      Real Estate Agent
    </Radio>
  </Stack>
</RadioGroup>
            
            </Box>
      </Collapse>
          
          {
            error && <Text my={3} color={'red.300'} >{error}</Text>
          }
          
      </ModalBody>

      <ModalFooter>
        <Button borderRadius={'6px'}  fontFamily={'GTMedium'} fontWeight={'400'} bg={'rgb(247, 34, 219)'} color={'white'}  isDisabled={isDisabled} onClick={handleGenerateResult} isLoading={isLoading} colorScheme='blue' mr={3}  >
  Get your result
         
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  <Modal size={'2xl'}  isOpen={showConfirmingEmail} onClose={() => setShowConfirmingEmail(false) }  >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton onClick={() => setShowConfirmingEmail(false) } />
          <ModalBody>
            <Confirmation />
          </ModalBody>
        </ModalContent>
      </Modal>

  </>

  )
}

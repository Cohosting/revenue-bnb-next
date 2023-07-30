import React, { useState, useEffect, useRef, useContext } from 'react';
import { getFirestore, doc, getDoc, setDoc, query, where, getDocs, collection, addDoc, updateDoc } from 'firebase/firestore';
import { Button, Input, Stack, FormControl, Spinner, Box, Fade, Collapse, Text, Flex, useMediaQuery, Image, InputLeftElement, InputGroup, RadioGroup, Radio } from "@chakra-ui/react";
import { db } from './../lib/firebase';
import jwt from 'jsonwebtoken'
import { AuthContext } from '../context/authContext';
import { AiFillLock, AiOutlineMail, AiOutlineUser } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';




const CustomInput = ({
  value,
  handleChange,
  icon,
  sx,
  isMargin = true,
  ...otherProps
  
}) => {
  let inputStyle = {
    fontFamily: 'GTMedium',
    borderRadius: '24px',
    border: '2px solid #E2E8F0',
    height: '3.125rem',
    color: 'rgb(80,80,81)',
    transition: 'all 250ms ease 0s',
    _placeholder: {
        color: 'rgb(80,80,81)',
    },
    _hover: { border: '2px solid rgb(163, 223, 230)' },
    _focus: {},
    _active: {},
    ...sx
};

  return (
    <InputGroup marginBottom={ isMargin && '10px'}>
            {icon && (
                <InputLeftElement color='rgb(247, 34, 219)' width='4.5rem' pr='25px' children={icon} h='100%' />
            )}

            <Input
                value={value}
                sx={{
                     ...inputStyle, 
                }}
                onChange={handleChange}
                pr='4.5rem'
                {...otherProps}
            />
        </InputGroup>
  )
}

function generateToken(userId, ) {
  // Generate token with a payload
  try {
    const payload = { userId };
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
const UserForm = ({
  results,
}) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isNewUser, setIsNewUser] = useState(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false); // state to manage loading of form submission
  const [isLoadingNextStep, setIsLoadingNextStep] = useState(false); // state to manage loading of next step button
  const [userType, setUserType] = useState('propertyOwner');
  const cooldownTimeout = useRef(null);
  const debounceTimeout = useRef(null);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const { setCurrentUser } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('verificationToken');
    if (token) {
      // handle case where token is already saved
    }
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (cooldownTimeout.current) {
        clearTimeout(cooldownTimeout.current);
      }
    };
  }, []);

  const checkUser = async (email) => {
    setIsLoading(true);
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    setIsLoading(false);
    if (!querySnapshot.empty) {
      setIsNewUser(false);
    } else {
      setIsNewUser(true);
    }
  };

  const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  const generateVerificationCode = () => {
    // Generate random 5 digit number
    return Math.floor(10000 + Math.random() * 90000);
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsNewUser(null);
    setIsVerificationSent(false);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (cooldownTimeout.current) {
      clearTimeout(cooldownTimeout.current);
      setCooldown(false);
    }
    if (isValidEmail(e.target.value)) {
      debounceTimeout.current = setTimeout(() => {
        checkUser(e.target.value);
      }, 500); // adjust this delay as needed
    }
  };

  const sendVerificationCode = async () => {
    // If cooldown is active, return immediately
    if (cooldown) {
      return;
    }
    // If it's a new user, make sure the required fields are filled before sending the code
    if (isNewUser && !(firstName && lastName && phoneNumber && revertFormattedNumber(phoneNumber).length === 10  )) {
      return;
    };
    setIsLoadingNextStep(true); // Set loading state before sending code


    // Generate a new verification code
    const code = generateVerificationCode();
    
    // If new user, create new document with user data and verification code
    // If existing user, update the document with new verification code

    if (isNewUser) {
      const ref = doc(collection(db, 'users'))
      await setDoc(ref, {
        email,
        firstName,
        lastName,
        phoneNumber,
        verificationCode: code,
        id: ref.id,
        fullName: `${firstName} ${lastName}`,
        userType
      });
    } else {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      const userDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'users', userDoc.id), { verificationCode: code });
    }
    
    const msg = {
      to: email,
      message: {
        subject: 'Welcome to our app!',
        text: `Hello ${firstName}, welcome to our app! Your verification code: ${code}`,
        // html: '<p>HTML version of the email</p>',
      }
    };
    await addDoc(collection(db, 'mail'), msg);
    setIsLoadingNextStep(false); // Reset loading state after sending code

    setCooldown(true);
    setTimeout(() => setCooldown(false), 60000);
    setIsVerificationSent(true);
  };

  const handleSubmit = async () => {
    setSubmitLoading(true); // Set loading state before form submission

    try {
      // Compare the entered verification code with the code saved in Firestore
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      // Check if user exists
      if (querySnapshot.empty) {
        console.log('No user found with this email.');
        return;
      }
  
      // If user exists, proceed with verification
      const user = querySnapshot.docs[0].data();
  
      if (user.verificationCode === Number(verificationCode)) {
        const ref  = doc(db, 'users', querySnapshot.docs[0].id );
        await updateDoc(ref, {
          verificationCode: null,
          emailVerified: true
        })

        const token = generateToken(querySnapshot.docs[0].id);
        localStorage.setItem('revenuebnb_token', token);

  
        // If the codes match, proceed with next steps...
        console.log('Verification successful');
        window.location.reload();
      } else {
        // If the codes do not match, show an error message...
        console.log('Verification failed');
      }
    } catch (error) {
      // Log any error that occurred during the process
      console.error("Error during verification:", error);
    }
    setSubmitLoading(false); // Reset loading state after form submission

  };

  const goBack = () => {
    setIsVerificationSent(false);
  };
    let TEXT_COLOR = '#242E43'
    const txtStyles = {
        lineHeight: '1.1',
        letterSpacing: '-2px',
    };

    function formatPhoneNumber(phoneNumber) {
      var cleaned = ('' + phoneNumber).replace(/\D/g, '');
    
      if (cleaned.length < 10) {
        return cleaned;
      }
    
      var areaCode = cleaned.substring(0,3);
      var centralOffice = cleaned.substring(3,6);
      var stationNumber = cleaned.substring(6,10);
    
      var formatted = '(' + areaCode + ') ' + centralOffice + '-' + stationNumber;
    
      return formatted;
    }
    
    function revertFormattedNumber(formattedNumber) {
      var reverted = formattedNumber.replace(/\D/g, '');
      
      return reverted;
    }
    
    const handleInputChange = (e) => {
      const inputValue = e.target.value;
      
      if(inputValue === '') {
        setPhoneNumber('')
        return;
      }
    
      const revertedNumber = revertFormattedNumber(inputValue);
    
      // Skip formatting if reverted number is empty
      if(revertedNumber === '') return;
    
      const numericValue = parseInt(revertedNumber, 10);
    
      if (isNaN(numericValue)) return;
    
      const formattedValue = formatPhoneNumber(revertedNumber);
      setPhoneNumber(formattedValue);
    };

  return (

    <>

<Flex justifyContent={'center'} flexDir={'column'} height={'100%'} w={'100%'}>
                    <Flex alignItems={'center'} justifyContent={'center'} height={'100%'} >
                        <Flex width={'60%'} justify={'center'} direction='column'>

                            <Text sx={{ ...txtStyles, fontFamily: 'GTMedium ', color: TEXT_COLOR, mt: !isLargerThan768 && '40px' }} textAlign={'center'} fontSize={['35px', '46px']}>                View Annual Revenue Estimate

                            </Text>
                            <Box >
                                <Text
                                    mt={'20px'}
                                    textAlign={'center'}
                                    fontSize={'24px'}
                                    letterSpacing={'.7px'}
                                    lineHeight='1.1'
                                    fontFamily={'GTMedium'}
                                >
                                    {results?.location}
                                </Text>
                                <Text mb={5} textAlign={'center'} fontFamily={'GTMedium'}>
                                    {results?.bedrooms} bedrooms · {results?.bathrooms} baths
                                </Text>
                            </Box>



                            <Stack spacing={3}>
      {!isVerificationSent && (
        <>
          <FormControl>
            <CustomInput
            isMargin={false}
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            icon={<AiOutlineMail />}
            

/>

            {isLoading && <Spinner my={3} />}
          </FormControl>
          <Collapse in={isNewUser === true}>
            <Box>
              <FormControl>
              <CustomInput
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            icon={<AiOutlineUser />}
            

/>

              </FormControl>
              <FormControl>
              <CustomInput
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            icon={<AiOutlineUser />}
            

/>
     
              </FormControl>
              <FormControl>

<Flex sx={{
                                    fontFamily: 'GTMedium',
                                    borderRadius: '24px',
                                    border: '2px solid #E2E8F0',
                                    height: '3.125rem',
                                    color: 'rgb(80,80,81)',
                                    transition: 'all 250ms ease 0s',
                                    _placeholder: {
                                        color: 'rgb(80,80,81)',
                                    },
                                    _hover: { border: '2px solid rgb(163, 223, 230)' },
                                    _focus: {},
                                    _active: {},
                                }} alignItems={'center'}>

                                    <Box p={3}>
                                        <Flex>
                                            <Image borderRadius={'100%'} w={'25px'} height={'25px'} src='https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/800px-Flag_of_the_United_States.svg.png?20151118161041' />
                                            <Text ml={2}>+1</Text>
                                        </Flex>
                                    </Box>
                                    <Input
                                  
                                  value={formatPhoneNumber(phoneNumber)}
                                          onChange={ handleInputChange} 
                                             outline={'none'} border={'none'} _focus={{
                                        border: 'none',
                                        outline: 'none'
                                    }}
                                    _active={{
                                        border: 'none',
                                        outline: 'none'
                                    }
                                    }

                                    />


                                </Flex>

              </FormControl>
            </Box>
            <Box my={1}>
              <Text fontWeight={700} color={'gray.500'} fontSize={'22px'} >
              I am...
              </Text>

              <RadioGroup colorScheme={'pink'} onChange={(val) => setUserType(val)} defaultValue={userType}>
  <Stack  spacing={3} direction='column'>
  <Radio size="sm" name="userType"  value="propertyOwner">
      Property Owner
    </Radio>
    <Radio size="sm" name="userType"  value="buyer">
      Buyer
    </Radio>
    <Radio size="sm" name="userType"  value="realEstateAgent">
      Real Estate Agent
    </Radio>
  </Stack>
</RadioGroup>
            </Box>
          </Collapse>
          <Button borderRadius={'6px'}  fontFamily={'GTMedium'} fontWeight={'400'} bg={'rgb(247, 34, 219)'} color={'white'} isLoading={isLoadingNextStep} onClick={sendVerificationCode} disabled={ (phoneNumber &&  revertFormattedNumber(phoneNumber).length !== 10) ||

// Check other conditions for disabling the button
cooldown ||
isNewUser === null ||
(isNewUser && (!firstName || !lastName || !phoneNumber || !userType))
}>
            Request Verification Code
          </Button>
          <Fade in={cooldown}>
            <Text>You can request a new code in 1 minute</Text>
          </Fade>
        </>
      )}
      {isVerificationSent && (
        <>
          <FormControl>
          <CustomInput
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Verification code"
            icon={<AiFillLock />}
            

/>

          </FormControl>
          <Button borderRadius={'6px'}  fontFamily={'GTMedium'} fontWeight={'400'} bg={'rgb(247, 34, 219)'} color={'white'} isLoading={submitLoading} onClick={handleSubmit} disabled={!verificationCode}>
            Submit
          </Button>
          <Button variant={'ghost'} onClick={goBack}>
            Go Back
          </Button>
        </>
      )}
    </Stack>
                        </Flex>
                        
                    </Flex>
                        </Flex>   
   
  </>
  );
};

export default UserForm;
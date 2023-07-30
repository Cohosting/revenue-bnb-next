import {
  Button,
  Checkbox,
  Flex,
  Grid,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';

import GoogleLogo from './../Images/google_logo.png'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Lottie from 'lottie-react';
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import graph from '../../src/lotties/graph.json';
import stateProvider from '../context/stateProvider';
import { getAirtableSync } from '../lib/airtable';
import { db } from '../lib/firebase';
import { sentResultMail } from '../lib/Mail';
import { setBaseResultDoc } from '../lib/reports';
import { createUserData, googleSignIn } from './../lib/auth';
import './../lib/firebase';
import { useRouter } from 'next/router';

const Signup = ({ values, v, setValues, handleLoginModal, onSuccessModal }) => {
  const [isPrivacyPolicChecked, setIsPrivacyPolicChecked] = useState(null)
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');
  const { onSignupClose } = v;
  const router = useRouter();
  const {
    setIsConfirming,
    setIsLogging,
    setAuthStep,
    state,
    propertyCoordinates,
    counts,
    location,
    getMonthlyBreakdown,
    isItFromHeader,
    onClose,
    progressHandler,
    isFirebaseGoogleAuth,
    setIsFirebaseGoogleAuth,
    setIsItFromHeader

  } = useContext(stateProvider);
  const { bedrooms, bathrooms, guests } = counts;
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false);

  const [isDisabled, setIsDisabled] = useState(true);
  const [alreadyExist, setAlreadyExist] = useState(false);

  const inputStyles = {
    color: '',
    fontSize: '16px',
    fontWeight: 'semibold',
    border: '1px solid #d6d6d6',
    borderRadius: '7px',
    _placeholder: {
      fontSize: '16px',
      color: '#6b6b6b',
      fontWeight: 'semibold',
    },
  };

  const buttonStyles = {
    fontSize: '14px',
    fontWeight: 'semibold',
    // background: '#4F59B9',
    bg: '#000000',
    cursor: 'pointer',
    color: '#FFF',
    borderRadius: '8px',
    _focus: {
      // background: '#FFFF',
    },
    _hover: {
      // background: '#FFFF',
    },
    _active: {
      // background: '#FFFF',
    },
  };

  const changeHandler = (e) => {
    setValues((prevstate) => ({
      ...prevstate,
      [e.target.id]: e.target.value,
    }));

    if (!e.target.value) {
      setIsDisabled(true);
      return;
    }
    if (e.target.id === 'email' && !e.target.value.includes('@')) {
      setIsDisabled(true);
      return;
    }

    if (e.target.id === 'password' && e.target.value.length <= 8) {
      setIsDisabled(true);
      return;
    }
    setIsDisabled(false);
  };
  const handleUserCreate = async () => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      const authObject = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const user = authObject.user;
      console.log(user)
      const userRef = await createUserData(user, values)


      if (isItFromHeader) {
        onSignupClose()
        setIsLoading(false);
        return;
      }

      const reportId = await setBaseResultDoc({
        location,
        bedrooms,
        bathrooms,
        guests,
        coordinates: propertyCoordinates,
        createdBy: userRef.id,
        amenities: state.selectedValue,
      });

      localStorage.setItem('lastId', reportId);
      localStorage.setItem(
        'result',
        JSON.stringify({
          anualAndMonthlyData: {},
          location,
          bedrooms,
          bathrooms,
          guests,
          coordinates: propertyCoordinates,
          createdBy: userRef.id,
          nightlyData: [],
        })
      );
      sentResultMail(
        reportId,
        location,
        propertyCoordinates,
        values.email,
        values.firstName + ' ' + values.lastName,
        bedrooms
      );

      setIsLoading(false);
      setAuthStep('confirmation');
      setIsConfirming(true);
      getMonthlyBreakdown(bedrooms, bathrooms, guests, propertyCoordinates, {
        ...values,
        id: user.uid,
      }, params);
      onSignupClose()

      onSuccessModal()

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setAlreadyExist(true);
      }
      setIsLoading(false);
      console.log(err.code);
    }
  };

  const handleResultCreate = async (user) => {
    const userRef = await createUserData(user, values);

    if (isItFromHeader) {
      onSignupClose();
      return;
    };
    const reportId = await setBaseResultDoc({
      location,
      bedrooms,
      bathrooms,
      guests,
      coordinates: propertyCoordinates,
      createdBy: userRef.id,
      amenities: state.selectedValue,
    });


    router.push(`/result/${reportId}`)
  }

  const featureLabel = {
    fontWeight: 500,
    fontSize: '12px',
    fontFamily: 'GTMedium',
  };
  return (
    <Flex direction={'column'}>
      <Lottie
        style={{ height: '150px', width: '150px', marginInline: 'auto' }}
        animationData={graph}
        loop={true}
      />
      <Text
        textAlign={'center'}
        fontSize='25px'
        color={'#000000'}
        fontWeight='bold'
        mt='-1rem'
        lineHeight={'1.2'}
        fontFamily={'GTBold'}
      >
        Your results are ready! Sign up to view.
      </Text>
      <Button onClick={() => {
        setIsFirebaseGoogleAuth(true)
        googleSignIn(handleResultCreate)
      }} fontSize={'15px'} fontFamily={'GTMedium'} textTransform="capitalize" variant={'outline'} mt={4}>

        <Image w={'25px'} height={'25px'} mr={2} src={GoogleLogo.src} />
        sign in with google
        {
          isFirebaseGoogleAuth && (
            <Spinner size={'sm'} ml={2} />
          )
        }
      </Button>
      <Flex mt={4} align={'center'}>
        <hr style={{ width: `100%` }} />
        <Text fontFamily={'GTMedium'} color={'gray'} mx={3}>
          or
        </Text>
        <hr style={{ width: `100%` }} />
      </Flex>

      <Grid
        templateColumns={'repeat(2,1fr)'}
        fontSize='12px'
        color={'#6B6B6B'}
        my='1.5rem'
        px='0.9rem'
        rowGap={'8px'}
      >
        <Flex align={'center'} gridGap='.5rem'>
          <FeatherIcon icon='calendar' className={'feather-icon'} size={20} />
          <Text sx={featureLabel} fontSize={'12px'} fontWeight='bold'>
            Monthly Breakdown
          </Text>
        </Flex>
        <Flex align={'center'} gap='.5rem'>
          <FeatherIcon
            icon='credit-card'
            className={'feather-icon'}
            size={20}
          />
          <Text sx={featureLabel} fontSize={'12px'} fontWeight='bold'>
            Investment Score
          </Text>
        </Flex>
        <Flex align={'center'} gap='.5rem'>
          <FeatherIcon icon='moon' className={'feather-icon'} size={20} />
          <Text sx={featureLabel} fontSize={'12px'} fontWeight='bold'>
            Nightly Rate
          </Text>
        </Flex>
        <Flex align={'center'} gap='.5rem'>
          <FeatherIcon icon='award' className={'feather-icon'} size={20} />
          <Text sx={featureLabel} fontSize={'12px'} fontWeight='bold'>
            Annual Report
          </Text>
        </Flex>
      </Grid>
      <Flex direction={'column'} gap='.7rem' pb='2rem'>
        <Stack>
          <Flex gap='.5rem'>
            <Input
              placeholder='First name'
              id={'firstName'}
              type={'text'}
              value={values.firstName}
              onChange={changeHandler}
              sx={{ ...inputStyles }}
            />
            <Input
              placeholder='Last name'
              type={'text'}
              id={'lastName'}
              value={values.lastName}
              onChange={changeHandler}
              sx={{ ...inputStyles }}
            />
          </Flex>
          <Input
            placeholder='Email'
            id={'email'}
            type={'email'}
            value={values.email}
            onChange={changeHandler}
            sx={{ ...inputStyles }}
          />
          <Input
            type={'password'}
            placeholder='Password'
            id={'password'}
            value={values.password}
            onChange={changeHandler}
            sx={{ ...inputStyles }}
          />
          <Input
            placeholder='Phone Number (optional)'
            id={'phone'}
            type={'tel'}
            value={values.phone}
            onChange={changeHandler}
            sx={{ ...inputStyles }}
          />
        </Stack>
      </Flex>
      {alreadyExist && (
        <Text
          color={'#c91f1f'}
          fontWeight={500}
          fontFamily={'GTMedium'}
          fontSize={'17px'}
          marginBottom={'16px'}
        >
          This email address is already used by another account! Login or change
          your mail
        </Text>
      )}

      <Flex>
        <Checkbox onChange={(e) => setIsPrivacyPolicChecked(e.target.checked)} isChecked={isPrivacyPolicChecked} alignSelf={'flex-start'} marginTop={'5px'}>


        </Checkbox>
        <Text ml={2} fontFamily={'GTMedium'}>

          I agree with the <Text onClick={() => router.push('/privacy-policy')} textDecor={'underline'} cursor={'pointer'} as={'span'} color={'rgb(247, 34, 219)'} > privacy policy</Text> and <Text textDecor={'underline'} color={'rgb(247, 34, 219)'} as={'span'} cursor={'pointer'} onClick={() => router.push('/terms-and-condition')} > the terms and condition </Text>
        </Text>
      </Flex>
      {isPrivacyPolicChecked !== null && !isPrivacyPolicChecked && (
        <Text
          mt={2}
          color={'#c91f1f'}
          fontWeight={500}
          fontFamily={'GTMedium'}
          fontSize={'17px'}
          marginBottom={'16px'}
        >
          Please check the box
        </Text>
      )}
      <Flex justifyContent={'center'}>
        <Button
          isLoading={isLoading}
          onClick={() => {
            handleUserCreate();
          }}
          alignSelf={'center'}
          sx={{
            ...buttonStyles,
          }}
        >
          Sign Up
        </Button>
      </Flex>

      <Text
        fontFamily={'GTBold'}
        textAlign={'center'}
        fontSize='13px'
        fontWeight={'bold'}
        color='#6b6b6b'
        my='1.5rem'
      >
        Already have an account?{' '}
        <Text
          cursor={'pointer'}
          as='span'
          color={'#0088FF'}
          onClick={() => {
            handleLoginModal()
            setIsItFromHeader(true)
            /* setIsLogging(true);
            setAuthStep('login'); */
          }}
        >
          Login
        </Text>
      </Text>
    </Flex>
  );
};

export default Signup;

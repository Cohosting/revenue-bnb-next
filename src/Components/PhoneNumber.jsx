import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import stateProvider from '../context/stateProvider';
import { db } from '../lib/firebase';

const PhoneNumber = ({ info }) => {
  const { currentUser } = useContext(stateProvider);
  const [phoneNumber, setPhoneNumnber] = useState(currentUser?.phone);
  const [oldPhoneNumber, setOldPhoneNumber] = useState(currentUser?.phone);
  const [isLargerThan600] = useMediaQuery('(min-width:600px)');
  const [isLargerThan1000] = useMediaQuery('(min-width: 1000px)');
  const route = useRouter();
  const { id } = route.query;
  const [isSyncing, setIsSyncing] = useState(false);

  const navigate = useRouter()
  const dynamicStyles = isLargerThan1000 &&
    route.pathname.includes('result') && {
    w: '80%',
    maxW: '1000px',
    margin: '0 auto',
  };

  const boxStyles = {
    bg: '#009dae',
    mx: isLargerThan600 ? '1.875rem' : '1rem',
    my: '1rem',
    mb: '1.5rem',
    mt: '1.5rem',
    borderRadius: '24px',
    p: '1rem',
    pb: '1rem',
  };

  const inputStyles = {
    color: '#000',
    bg: '#ffff',
    borderRadius: '8px',
    _placeholder: {
      color: '#6B6B6B',
      fontSize: '15px',
      fontWeight: 'medium',
    },
    _focus: {
      borderColor: '',
    },
    _hover: {
      borderColor: '',
    },
    _active: {
      borderColor: '',
    },
  };

  const handleUpdate = async () => {
    if (currentUser.phone === phoneNumber) {
      return;
    }
    setIsSyncing(true);
    try {
      const reportRef = doc(db, 'users', currentUser.id);
      await updateDoc(reportRef, {
        phone: phoneNumber,
      });
      const functions = getFunctions();
      const updatePhoneAirtableSync = httpsCallable(functions, 'updatePhoneAirtableSync');
      updatePhoneAirtableSync({
        newPhoneNumber: phoneNumber, userId: currentUser.id
      });
      setIsSyncing(false);
      toast.success('Phone Number Synced Successfully');
    } catch (err) {
      console.log(err);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    setPhoneNumnber(currentUser?.phone);
    setOldPhoneNumber(currentUser?.phone);
  }, [currentUser]);
  return (
    <Box bg='#F6F6F6' sx={{ ...dynamicStyles }}>

      <Button onClick={() => navigate.push('/')} ml={4} variant={'ghost'}>
        <AiOutlineArrowLeft /> <Text ml={2}>Back to Search</Text>
      </Button>
      <ToastContainer />
      <Flex
        sx={{
          ...boxStyles,
          color: ' #ffffff',
          lineHeight: '1.2',
          fontWeight: 'bold',
          px: '1.2rem',
          mt: '1rem'
        }}
        direction='column'
        fontFamily={'GTBold'}
      >
        <Text fontSize={'14px'}>Review Your Results</Text>
        <Text fontSize={'22px'}>Vacation Rental Expert</Text>
        <InputGroup mt='.4rem'>
          <InputLeftElement
            children={
              <FeatherIcon size={24} color='rgb(107, 107, 107)' icon='phone' />
            }
          />
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumnber(e.target.value)}
            sx={{
              ...inputStyles,
              borderTopRightRadius: '24px',
              borderBottomRightRadius: '24px',
            }}
            placeholder='Enter phone number'
            type={'tel'}
          />
          <InputRightElement
            onClick={handleUpdate}
            sx={{
              background: '#000000',
              borderEndRadius: '8px',
              w: '16%',
              cursor:
                currentUser?.phone === phoneNumber ? 'not-allowed' : 'pointer',
            }}
            children={
              isSyncing ? (
                <Spinner />
              ) : (
                <FeatherIcon color='rgb(255, 255, 255)' icon='arrow-right' />
              )
            }
          />
        </InputGroup>
      </Flex>
    </Box>
  );
};

export default PhoneNumber;

import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Lottie from 'lottie-react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import stateProvider from '../context/stateProvider';
import { db } from '../lib/firebase';
import message from '../lotties/message.json';

const Confirmation = ({ values }) => {
  const navigate = useRouter()
  const [isResending, setIsResending] = useState(false);
  const { onClose } = useContext(stateProvider);

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

  const handleResend = async () => {
    setIsResending(true);
    const userId = getAuth().currentUser.uid
    try {
      const userRef = doc(db, 'users', userId)
      const random4Number = Math.floor(1000 + Math.random() * 9000);
      // how to get current user to implement the
      const lastId = localStorage.getItem('lastId')
      await updateDoc(userRef, {
        confirmationCode: random4Number
      })
/*       await sendConfirmationEmail('', values.email, random4Number, lastId);
 */
    } catch (err) {
      console.log(err)
    }
    setIsResending(false)

  }

  const handleRedirect = () => {
    const lastId = localStorage.getItem('lastId');

    if (lastId) {
      onClose()
      navigate.push(`result/${lastId}`)

    } else {
      throw new Error('unable to find lastId of the result');
    }

  };


  useEffect(() => {
    window.SavvyCal('inline', { link: 'RevenueBnb/chat', selector: '#savvycal' });

  }, [])


  return (
    <Flex direction={'column'} gap='0.5rem' pb='1rem'>
      <Lottie
        style={{
          height: '160px',
          width: '160px',
          marginInline: 'auto',
        }}
        animationData={message}
        loop={true}
      />

      <Box textAlign={'center'}>
        <Text fontWeight={'600'} fontFamily={'GTBold'} fontSize={'30px'}>Congratulation!</Text>
        <Text fontWeight={600} fontFamily={'GTBold'} color={'#6B6B6B'} fontSize={'18px'}>We've emailed your results to you.  </Text>
        <Text fontWeight={600} fontFamily={'GTBold'}   fontSize={'20px'}>Review results with a professional</Text>

      </Box>

      <Box
          id='savvycal'
      />
{/*       <Button
        isLoading={isResending}
        alignSelf={'center'}
        sx={{
          ...buttonStyles,
          mt: '0.5rem',
          mb: '1rem'
        }}

        onClick={() => {
          
        }}

      >
      Schedule


      </Button> */}
    </Flex>
  );
};

export default Confirmation;

import { Button, Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Login from '../../auth/Login';
import Signup from '../../auth/Signup';
import stateProvider from '../../context/stateProvider';
import { db } from '../../lib/firebase';
import ForgotPassword from '../ForgotPassword';
import HistoryModal from './HistoryModal';
import { AuthContext } from '../../context/authContext';

export const History = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['hasSubmitForm']);
  const { isOpen: isForgotPassword, onOpen: onForgotPassword, onClose: onForgotClose } = useDisclosure();
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { isOpen: is, onOpen: on, onClose: close } = useDisclosure();
  const { isOpen: isSignUpOpen, onOpen: onSignupOpen, onClose: onSignupClose } = useDisclosure();
  const { currentUser } = useContext(AuthContext)
  const { isOpen, onOpen: setOpen, onClose } = useDisclosure();
  const route = useRouter();

  const handleLoginModal = () => {
    onSignupClose();
    onLoginOpen()
  }
  const handleSignModal = () => {
    onLoginClose();
    onSignupOpen()
  }

  const handleForgotPassword = () => {
    onLoginClose();
    onForgotPassword()
  }

  const handleSignout = () => {
    const auth = getAuth();
    signOut(auth);
    removeCookie('hasSubmitForm')
  }

  const {
    isUserAvailable,
    history,
    setHistory,
    progressHandler,
    onOpen,
    setIsItFromHeader,
    values,
    setValues
  } = useContext(stateProvider);

  const buttonStyles = {
    fontSize: '14px',
    fontWeight: 'semibold',

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

  /*   useEffect(() => {
    if (!currentUser) return;

    (async () => {
      let collectionRef = collection(db, 'reports');
      const reportQuery = query(
        collectionRef,
        where('createdBy', '==', currentUser.id)
      );
      const snapshot = await getDocs(reportQuery);
      let data = [];
      snapshot.forEach(el => data.push(el.data()));

      function compare(a, b) {
        if (a.location < b.location) {
          return -1;
        }
        if (a.location > b.location) {
          return 1;
        }
        return 0;
      }

      console.log(JSON.stringify(data.sort(compare)))
      setHistory(data);
    })();
  }, [currentUser]); */

  return (
    <>
      {route.pathname.includes('/') && (
        <Button
          isLoading={!isUserAvailable.isKnown}
          onClick={() => {
            if (currentUser) {
              setOpen();
            }
          }}
          sx={{
            ...buttonStyles,
            // marginInline: 'auto 2rem',
          }}
        >
          {currentUser &&  'Account' }
        </Button>
      )}
      <Modal onClose={onSignupClose} isOpen={isSignUpOpen} isCentered motionPreset='scale'>
        <ModalOverlay />
        <ModalContent mx='2rem' borderRadius={'24px'}>
          <ModalBody>
            <Signup values={values}
              setValues={setValues}
              handleLoginModal={handleLoginModal}
              v={{
                isSignUpOpen, onSignupOpen, onSignupClose
              }}
              /* onSuccessModal={onSuccessModal}  */ />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal onClose={onLoginClose} isOpen={isLoginOpen} isCentered motionPreset='scale'>
        <ModalOverlay />
        <ModalContent mx='2rem' borderRadius={'24px'}>
          <ModalBody>
            <Login

              handleForgotPassword={handleForgotPassword}
              handleSignModal={handleSignModal}
              onClose={onLoginClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal onClose={onForgotClose} isOpen={isForgotPassword} isCentered motionPreset='scale'>
        <ModalOverlay />
        <ModalContent mx='2rem' borderRadius={'24px'}>
          <ModalBody>
            <ForgotPassword />

          </ModalBody>
        </ModalContent>
      </Modal>

      {/*             <Modal onClose={onSuccessClose} isOpen={isSuccessModal} isCentered motionPreset='scale'>
                <ModalOverlay />
                <ModalContent mx='2rem' borderRadius={'24px'}>
                    <ModalBody>
                        <Confirmation />
                    </ModalBody>
                </ModalContent>
            </Modal> */}

      <HistoryModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

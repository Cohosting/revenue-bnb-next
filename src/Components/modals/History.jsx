import { Button, Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useCookies } from 'react-cookie';
import Login from '../../auth/Login';
import Signup from '../../auth/Signup';
import stateProvider from '../../context/stateProvider';
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

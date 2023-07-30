import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner
} from '@chakra-ui/react';
import { ArrowRight } from 'phosphor-react';
import { useContext, useState } from 'react';
/* import { useNavigate } from 'react-router-dom';
 */import Signup from '../../auth/Signup';
import stateProvider from '../../context/stateProvider';
import { setBaseResultDoc } from '../../lib/reports';
import ForgotPassword from '../ForgotPassword';
import { ConfirmationModal } from './../../Components/modals/ConfirmationModal';
import { LoginModal } from './../../Components/modals/LoginModal';

export const SignupModal = ({ showCalculate = true }) => {
  const [showLoading, setShowLoading] = useState(false);
  const navigate = `useNavigate()`;
  const {
    currentUser,
    propertyCoordinates,
    counts,
    location,
    isOpen,
    onOpen,
    onClose,
    values,
    setValues,
    isConfirming,
    isLogging,
    isForgotPassword
  } = useContext(stateProvider);
  const { bedrooms, bathrooms } = counts;

  const buttonStyles = {
    fontSize: '14px',
    fontWeight: 'semibold',

    background: '#FFFF',
    cursor: 'pointer',
    color: '#000',
    borderRadius: '8px',
    _focus: {
      background: '#FFFF',
    },
    _hover: {
      background: '#FFFF',
    },
    _active: {
      background: '#FFFF',
    },
  };

  const handleCalculate = async () => {
    setShowLoading(true);
    const id = await setBaseResultDoc({
      bedrooms,
      bathrooms,
      coordinates: propertyCoordinates,
      createdBy: currentUser.id,
      location,
    });
    setShowLoading(false);

    navigate(`result/${id}`);
  };
  return (
    <>
      {showCalculate && (
        <Button
          alignSelf={'end'}
          mt='1.5rem'
          gap={'.5rem'}
          sx={{ ...buttonStyles }}
          onClick={() => {
            /*             if (currentUser && currentUser.isEmailVerified === undefined) {
                          onOpen();
                          setAuthStep('confirmation');
                          setIsConfirming(true);
                          return;
                        } */
            if (!currentUser) {
              onOpen();
            } else {
              handleCalculate();
            }
          }}
        >
          Calculate Now
          <ArrowRight color='#000' size={30} />
          {showLoading && <Spinner />}
        </Button>
      )}
      <Modal onClose={onClose} isOpen={isOpen} isCentered motionPreset='scale'>
        <ModalOverlay />
        <ModalContent mx='2rem' borderRadius={'24px'}>
          <ModalBody>
            {isConfirming ? (
              <ConfirmationModal values={values} close={onClose} />
            ) : isForgotPassword ? (
              <ForgotPassword />
            ) : isLogging ? (
              <LoginModal close={onClose} />
            ) : (
              <Signup values={values} setValues={setValues} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

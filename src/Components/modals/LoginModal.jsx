import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  
} from '@chakra-ui/react';
import { useContext } from 'react';
import stateProvider from '../../context/stateProvider';
import Login from './../../auth/Login';

export const LoginModal = ({ close }) => {
  const { isLogging, setIsLogging } = useContext(stateProvider);

  const closeModal = () => {
    close()
  };

  return (
    <>
      <Modal
        onClose={closeModal}
        isOpen={isLogging}
        isCentered
        motionPreset='scale'
      >
        <ModalOverlay />
        <ModalContent mx={'2rem'} borderRadius={'24px'}>
          <ModalBody pr={'0'}>
            <Login />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

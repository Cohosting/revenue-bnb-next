import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  Input,
  Text,
  Flex,
} from '@chakra-ui/react';

import React, { useEffect, useRef, useState } from 'react';

const ShareModal = ({ isClicked, isOpen, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  const value = useRef();
  const pathName = window.location.href;
  useEffect(() => {}, [isClicked]);

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
    alignSelf: 'start',
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

  const copyToClipBoard = () => {
    value.current.select();

    navigator.clipboard.writeText(value.current?.value);

    setIsCopied(true);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mx={'2rem'} borderRadius={'10px'}>
          <ModalBody fontFamily={'GTMedium'} mt={'20px'} mb={'30px'}>
            <Flex gap='1rem' direction='column'>
              <Text>Result Url</Text>
              <Input
                ref={value}
                sx={{ ...inputStyles }}
                defaultValue={pathName}
                isDisabled
              />
              <Button
                sx={{ ...buttonStyles }}
                onClick={copyToClipBoard}
                width={['95px', '100%']}
              >
                {isCopied ? 'Copied' : 'Copy Link'}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShareModal;

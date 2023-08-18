import { Button, Flex } from '@chakra-ui/react';
import { useContext } from 'react';
import stateProvider from './../../context/stateProvider';

const StepButton = ({ isDisable,  }) => {
  const { pageChange, isAuthenticated, pageBack } = useContext(stateProvider);

  const buttonStyles = {
    fontSize: '14px',
    fontWeight: 'semibold',
    background: 'none',
    cursor: 'pointer',
    color: '#212529',
    borderRadius: '8px',
    // color: isAuthenticated ? 'rgba(79, 89, 185, 1)' : '',

    _focus: {
      boxShadow: '0',
    },
    _hover: {
      background: '#664AE9',
    },
    _active: {
      background: '#664AE9',
    },
  };

  return (
    <Flex justify={'space-between'} align={'center'} mt='1.5rem'>
      <Button
        as={'u'}
        sx={{
          ...buttonStyles,
          _focus: {
            boxShadow: '0',
          },
          _hover: {
            background: '#FFFF',
          },
          _active: {
            background: '#FFF',
          },
        }}
        onClick={() => pageBack()}
      >
        Back
      </Button>

      <Button
        isDisabled={isDisable}
        onClick={() => pageChange()}
        sx={{
          pointerEvents: isDisable && 'none',
          ...buttonStyles,
          background: isDisable ? '#D1D1D1' : '#664AE9',
          color: '#FFFFFF',
          px: '1.5rem',
        }}
      >
        Select Amenities
      </Button>
    </Flex>
  );
};

export default StepButton;

import { Button, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import React, { useContext } from 'react';
import stateProvider from './../../context/stateProvider';

const Counter = ({ text, value, icon, color, isDisabled }) => {
  const [isLargerThan1200] = useMediaQuery('(min-width: 1200px)');

  const { setCounts, counts } = useContext(stateProvider);

  const buttonStyles = {
    border: 'none',
    borderRadius: '2rem',
    padding: '0',
    color: '#b5b5b5',
    background: '#FFFFFF',
    _hover: {
      background: '#fff',
      border: 'none',
    },
    _active: {
      background: '#fff',
      border: 'none',
    },
    _focus: {
      background: '#fff',
      border: 'none',
    },
  };

  const addItem = () => {
    const textLower = text.toLowerCase();

    if (text === 'Bathrooms') {
      setCounts({
        ...counts,
        [textLower]: counts[textLower] + 0.5,
      });
    } else {
      setCounts({
        ...counts,
        [textLower]: parseInt(counts[textLower]) + 1,
      });
    }
  };

  const removeItem = () => {
    const textLower = text.toLowerCase();
    if (counts[textLower] === 1) return;

    if (text === 'Bathrooms') {
      setCounts({
        ...counts,
        [textLower]: counts[textLower] - 0.5,
      });
    } else {
      setCounts({
        ...counts,
        [textLower]: parseInt(counts[textLower]) - 1,
      });
    }
  };

  return (
    <Flex
      height={'38px'}
      overflow={'hidden'}
      justify={'space-between'}
      mt="1.3rem"
      color={color}
    >
      <Flex justify={'center'} align="center" gap=".7rem" pl={'.8rem'}>
        {icon}

        <Text
          fontSize={'16px'}
          fontWeight="500"
          fontFamily={'Open Sans'}
          color={'#6B6B6B'}
        >
          {text}
        </Text>
      </Flex>
      <Flex
        width={!isLargerThan1200 ? '7rem' : '8rem'}
        align="center"
        border="1px solid #E5E5E5"
        justify="space-around"
        borderRadius="50px"
        color={'#0A0E52'}
        overflow={'hidden'}
      >
        <Button onClick={removeItem} id={`${text}dec`} sx={{ ...buttonStyles }}>
          -
        </Button>
        <Text fontSize="1.25rem" fontWeight={'medium'} color={'#b5b5b5'}>
          {value}
        </Text>
        <Button id={`${text}inc`} onClick={addItem} sx={{ ...buttonStyles }}>
          +
        </Button>
      </Flex>
    </Flex>
  );
};

export default Counter;

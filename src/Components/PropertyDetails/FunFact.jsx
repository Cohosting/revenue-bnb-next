import { Text, useMediaQuery } from '@chakra-ui/react';
import React from 'react';

const FunFact = () => {
  return (
    <Text
      color={'#6b6b6b'}
      px='2.75rem'
      fontSize={'12px'}
      textAlign='center'
      fontWeight={'bold'}
      mb='1.5rem'
    >
      Did you know:
      <Text as={'span'} fontWeight={'medium'}>
        {' '}
        Fun Useful Fact About Vacation Rentals
      </Text>
    </Text>
  );
};

export default FunFact;

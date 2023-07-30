import { Box, Link, Text } from '@chakra-ui/react';
import React from 'react';

const TipBox = ({ title, tip, link }) => {
  return (
    <Box
      p='12px 16px 12px 16px'
      bg='#e6e6e6'
      borderRadius={'8px'}
      fontSize='12px'
      textAlign='center'
      color='grey'
    >
      <Text fontSize={'13px'} as={'div'} fontWeight='bold' fontFamily={'GTBold'}>
        {title}:
      </Text>
      <Text fontSize={'13px'} my={'2px'} fontFamily={'GTMedium'} fontWeight="600" letterSpacing={'0.5px'}> {tip}</Text>
      <Link color={'#009DAE'} fontSize={'13px'} fontFamily={'GTMedium'} textDecoration='underline' fontWeight={'bold'}>
        {link}
      </Link>
    </Box>
  );
};

export default TipBox;

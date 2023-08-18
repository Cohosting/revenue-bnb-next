import { Box, Flex, Image, Link, Text } from '@chakra-ui/react';
// import ChevronDown from './Icons/ChevronDown';
import FeatherIcon from 'feather-icons-react';
import React, { useState } from 'react';
import Logo from '../Images/cohostinlogo.png';
import { LayoutBox } from './Layout/LayoutBox';

export const Recommendation = ({ name, percentage, site, number }) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <>
      <Flex direction={'column'}>
        <Text>Management we trust</Text>
      </Flex>
    </>
    // );
  );
};



const Managers = () => {
  return (
    <LayoutBox shouldHeight100={false}>
      <Box
        height='19px'
        w='19px'
        mt='-1.6rem'
        ml='17.5rem'
        bg='#fff'
        borderLeft='1px solid #e5e5e5'
        borderTop='1px solid #e5e5e5'
        transform={'rotate(45deg)'}
      />
      <Flex
        direction={'column'}
        gap={'.5rem'}
        p='1rem'
        pt='.5rem'
        color={'#000'}
        fontSize='12px'
        fontWeight={'bold'}
        fontFamily={'GTBold'}
      >
        <Text textAlign={'center'} fontSize={'20px'}>
          Management we trust
        </Text>
        <Box my={2}>
          <Image src={Logo.src} w='232px' h='80px' />
        </Box>
        <Check text='15% Management fee' />
        <Check text='Dynamic pricing' />
        <Check text='24/7 Guest support' />
        <Check text='Maintenance & Housekeeping' />
        <Check text='Find out more ' link={'cohostin.com'} />
      </Flex>
    </LayoutBox>
  );
};

export default Managers;

export const Check = ({ text, link }) => {
  return (
    <Flex fontFamily={'GTBold'} align={'center'} gap='.25rem'>
      <FeatherIcon icon={'check'} color='rgb(0, 157, 174)' />
      <Text display={'flex'} alignItems={'center'}>
        {text}
        {link && (
          <Link
            textDecor={'underline'}
            color='#1161ff'
            href='https://www.cohostin.com/'

          >
            <Text ml={1} fontSize={'13px'}>
              cohostin.com

            </Text>
          </Link>
        )}
      </Text>
    </Flex>
  );
};

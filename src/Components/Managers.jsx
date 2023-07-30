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
      {/* <Grid
        border={`1px solid ${isClicked ? '#0A0E52' : '#E5E5E5'}`}
        borderRadius={'12px'}
        borderBottom={isClicked && 'none'}
        borderBottomRadius={isClicked && 'none'}
        sx={{
          padding: '.7rem',
        }}
        onClick={() => setIsClicked(!isClicked)}
      >
        <Flex justifyContent='space-between' align={'center'} mx='0.5rem'>
          <Text color={isClicked ? '#0A0E52' : '#6B6B6B'}>{name}</Text>
          <Flex align={'center'} color={isClicked ? '#212529' : '#6B6B6B'}>
            <Text fontWeight={'medium'} mr='1rem'>
              {percentage}% <br />
              <Text as='span' ml='0.3rem'>
                Fee
              </Text>
            </Text>
            <ChevronDown cls={isClicked && 'rotateForward'} />
          </Flex>
        </Flex>
      </Grid> */}
      {/* {isClicked && (
        <Grid
          border={`1px solid ${isClicked ? '#0A0E52' : '#E5E5E5'}`}
          borderTop={'none'}
          borderRadius={'12px'}
          borderTopRadius='0px'
          direction={'column'}
          className='animation'
          mt='-1.5rem'
          fontWeight={'medium'}
        >
          <Divider mx='1.2rem' w='90%' borderColor={'#EEEEEE'} />
          <Text fontSize={'12px'} color={'#6B6B6B'} p='1rem' pb={'.5rem'}>
            Website:{' '}
            <Link fontSize={'14px'} color={'#0A0E52'} href={'https://' + site}>
              {site}
            </Link>
          </Text>
          <Text fontSize={'12px'} color={'#6B6B6B'} px='1rem' pb={'.5rem'}>
            Phone number:{' '}
            <Text fontSize={'14px'} color={'#0A0E52'} as={'span'}>
              {number}
            </Text>
          </Text>
        </Grid> */}
      {/* )} */}
    </>
    // );
  );
};

// const recommended = [
//   {
//     name: 'Cohostin',
//     percentage: '15',
//     site: 'www.cohostin.com',
//     phone: '+1 608-313-0295',
//   },
//   {
//     name: 'Redsands',
//     percentage: '30',
//     site: 'www.redsands.com',
//     phone: '+1 608-313-0295',
//   },
//   {
//     name: 'Redrock',
//     percentage: '35',
//     site: 'www.redrock.com',
//     phone: '+1 608-313-0295',
//   },
// ];

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

import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useContext, useState } from 'react';
import stateProvider from '../../context/stateProvider';
import { ResultContext } from './../../pages/result/[id]';
import { LayoutBox } from '../Layout/LayoutBox';
import Share from './../../Images/svgfile/share.svg';
import dynamic from 'next/dynamic';
const ShareModal = dynamic(() => import('../modals/ShareModal'));

const Price = ({ average, professional }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {  setSelectedName } = useContext(stateProvider);

  const { location, bathrooms, bedrooms, guests, } = useContext(ResultContext);
  const buttonStyles = {
    fontSize: '16px',
    fontWeight: 'medium',
    background: '#000',
    cursor: 'pointer',
    color: '#FFFFFF',
    borderRadius: '8px',

    _focus: {
      background: '',
    },
    _hover: {
      background: '',
    },
    _active: {
      background: '',
    },
  };

  const btn = null;

  return (
    <LayoutBox sx={{ height: 'max-content' }}>

      <Flex ml='.5rem' direction={'column'} gap='1rem'>
        <Flex justify={'space-between'} width='100%'>
          <Box>
            <Text
              fontSize={'20px'}
              as='div'
              fontWeight={'bold'}
              lineHeight='1.2'
              fontFamily={'GTBold'}
            >
              Annual Report <Text mt={'0.1rem'}>{location}</Text>
            </Text>
            <Text
              fontFamily={'GTMedium'}
              as='span'
              color={'grey'}
              fontWeight='500'
            >
              {bedrooms} bedrooms · {bathrooms} baths
            </Text>
          </Box>
          <Button sx={{ ...buttonStyles }} onClick={() => onOpen()}>
            <Image src={Share.src} alt='share icon' />
            <ShareModal isOpen={isOpen} onClose={onClose} />
          </Button>
        </Flex>
        <Flex
          sx={{
            border: '1px solid #d6d6d6',
            alignSelf: 'start',
            p: '1px 5px 1px 10px',
            borderRadius: '14px',
            fontSize: '12px',
            color: '#6b6b6b',
            mb: '-1.8rem',
            ml: '1rem',
            zIndex: '20',
            bg: '#e6e6e6',
            fontWeight: 'medium',
            fontFamily: 'GTMedium',
          }}
        >
          Average Host
        </Flex>

        <DetailBox
          yearly={average.revenue}
          monthly={average.occupancy_rate}
          nightly={average.average_daily_rate}
        />
        <Flex
          justify={'center'}
          align='center'
          sx={{
            border: '1px solid #d6d6d6',
            alignSelf: 'start',
            p: '1px 5px 1px 10px',
            borderRadius: '14px',
            mb: '-1.8rem',
            ml: '1rem',
            zIndex: '20',
            bg: '#009DAE',
            fontWeight: 'medium',
            fontFamily: 'GTMedium',
          }}
        >
          <Text color={'#FFF'} fontSize='12px' mr='6px'>
            Professional Host{' '}
          </Text>
          <Text
            cursor={'pointer'}
            as='span'
            p='1px 5px 0px 5px'
            bg='#fff'
            color={'#009DAE'}
            borderRadius='9px'
            fontSize={'9px'}
            onClick={() => {
              setSelectedName('Managers')
            }}
          >
            Learn More
          </Text>
        </Flex>
        <DetailBox
          yearly={professional.revenue}
          monthly={professional.occupancy_rate}
          nightly={professional.average_daily_rate}
        />
      </Flex>
    </LayoutBox>
  );
};

export default Price;

export const DetailBox = ({ yearly, nightly, monthly }) => {
  const txtStyles = {
    color: '#000',
    fontSize: '25px',
    lineHeight: '1.2',
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: 'GTBold',
  };

  const boxStyles = {
    boxShadow: '0px 20px 50px 0px rgba(198, 217, 225, 0.25)',
    border: '1px solid #e5e5e5',
    p: '1rem',
    borderRadius: '12px',
    gap: '1rem',
    color: 'grey',
    fontSize: '12px',
    fontWeight: 'medium',
    fontFamily: 'GTBold',
  };

  return (
    <Grid sx={{ ...boxStyles }} templateColumns='repeat(3,1fr)'>
      <Text pt={'4px'} sx={{ ...txtStyles, }} as='div'>
        ${new Intl.NumberFormat('en-US').format(yearly)}
        <Text fontSize={'12px'} color='grey'>
          per year
        </Text>
      </Text>

      <Flex
        pt={'4px'}
        direction={'column'}
        align='center'
        px='1.5rem'
        borderInline={'1px solid #d6d6d6'}
      >
        <FeatherIcon icon='moon' color='#009DAE' />
        <Text>${nightly}</Text>
      </Flex>

      <Flex pt={'4px'} direction={'column'} align='center'>
        <FeatherIcon icon='calendar' color='#009DAE' />
        <Text>{monthly}%</Text>
      </Flex>
    </Grid>
  );
};

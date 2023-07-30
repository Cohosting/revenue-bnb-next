import { Flex, Text, useMediaQuery } from '@chakra-ui/react';
import React, { useContext } from 'react';
import stateProvider from '../../context/stateProvider';

const Locations = () => {
  const { setLocation, getPropertyCoordinates, setIsSelectedFromDropdown } =
    useContext(stateProvider);
  const [isLargerThan1400] = useMediaQuery('(min-width: 1400px)');
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const topLocations = [
    'St. George, UT',
    'Myrtle Beach, SC',
    'La Verkin, UT',
    'Garden City, UT',
    'San Clemente, CA',
  ];

  return (
    <Flex
      gridGap='.4rem'
      align={'center'}
      color={'#6b6b6b'}
      // px="2.75rem"
      pl={isLargerThan1400 ? '2.75rem' : '1.75rem'}
      pr={isLargerThan1400 && '1.75rem'}
      mb='1.5rem'
      flexWrap={'wrap'}
      fontSize={'12px'}
    >
      <Text fontFamily='GTBold' fontWeight={'bold'}>
        Top Locations:
      </Text>
      {topLocations.map((el) => (
        <Text
          fontFamily={'GTMedium'}
          cursor={'pointer'}
          onClick={() => {
            getPropertyCoordinates(el);
            setLocation(el);
            setIsSelectedFromDropdown(true);
          }}
          sx={{
            padding: '3px 10px 3px 10px',
            background: '#e0e0e0',
            fontWeight: 'medium',
            borderRadius: '14px',
            border: '1px solid #d6d6d6',
          }}
        >
          {el}
        </Text>
      ))}
    </Flex>
  );
};

export default Locations;

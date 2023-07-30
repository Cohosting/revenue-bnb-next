import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useMediaQuery,
  useOutsideClick,
} from '@chakra-ui/react';
import React, { useContext, useRef, useState } from 'react';
import { MapPin } from 'react-feather';
import { LayoutBox } from '../Layout/LayoutBox';
import stateProvider from './../../context/stateProvider';
import Amenities from './Amenities';
import Guests from './Guests';

const PropertyDetails = (sx) => {
  const { step, location } = useContext(stateProvider);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isLargerThan1200] = useMediaQuery('(min-width: 1200px)');

  // useEffect(() => {
  //   if (location !== '') {
  //     // setIsActive(true);
  //   }
  // }, [location]);

  return (
    <LayoutBox
      sx={{
        ...sx,
        marginTop: isLargerThan768 ? '-3rem' : '0',
        alignSelf: 'center',
        height: 'auto',
      }}
    >
      <InputField />

      {step === 1 && <Guests />}
    </LayoutBox>
  );
};

export default PropertyDetails;

export const InputField = () => {
  const {
    setPropertyCoordinates,
    location,
    setIsSelectedFromDropdown,
    isSelectedFromDropdown,
    dropdownLocationError,
    setDropdownLocationError,
  } = useContext(stateProvider);
  const address = useInput(location);

  const inputStyles = {
    fontFamily: 'GTMedium',
    color: `rgba(107, 107, 107, 0.81)`,
    fontWeight: 'medium',
    fontSize: '16px',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    background: address.value !== '' && '#e5e5e5',

    _placeholder: {
      color: '#6B6B6B',
    },
    _focus: {
      // border: '1px solid #664AE9',
    },
  };

  const ref = useRef();
  useOutsideClick({
    ref: ref,
    handler: () => {
      address.setShow(false);
      /*       if (!isSelectedFromDropdown) {
        address.setError(true)
      } */
    },
  });

  return (
    <Flex ref={ref} direction={'column'} position={'relative'}>
      <InputGroup>
        <InputLeftElement
          pl={'0.5rem'}
          mt={'.3rem'}
          zIndex={13}
          pointerEvents={'none'}
          children={
            <MapPin
              color={address.value !== '' ? 'rgb(107, 107, 107)' : '#000000'}
              size={24}
            />
          }
        />
        <Input
          autoFocus
          onFocus={(e) => {
            address.setShow(true);
          }}
          placeholder='Enter your address'
          {...address}
          onChange={(e) =>
            address.onChange(e, () => {
              setIsSelectedFromDropdown(false);
            })
          }
          size={'lg'}
          pl='2.7rem'
          zIndex={12}
          sx={{ ...inputStyles }}
          isTyping={address.value !== ''}
          _placeholder={{
            color: 'red',
          }}
        />
      </InputGroup>
      {dropdownLocationError && (
        <Text
          color={'#EE4444'}
          ml={'5px'}
          mt={'5px'}
          fontWeight={'500'}
          fontSize={'15px'}
          fontFamily={'GTMedium'}
        >
          Unable to verify address please select from the dropdown
        </Text>
      )}
      {address.show && location !== '' && (
        <Box
          border={'1px solid #e6e6e6'}
          borderRadius='8px'
          zIndex='11'
          pos={'absolute'}
          top='2rem'
          w='100%'
          bg={'#FFF'}
          p='.7rem'
          pl={'5px'}
          pt={'1rem'}
        >
          {address.suggestions.map((suggestion, index) => {
            return (
              <Flex
                key={`address-suggestion-${index}`}
                px={'10px'}
                _hover={{
                  bg: '#e5e5e5',
                }}
                align={'center'}
                gap='.4rem'
                onClick={() => {
                  setPropertyCoordinates(suggestion.geometry.coordinates);
                  address.setShow(false);
                  address.setLocation(suggestion.place_name);
                  setIsSelectedFromDropdown(true);
                  setDropdownLocationError(false);
                }}
                cursor={'pointer'}
              >
                <Box>
                  <MapPin />
                </Box>
                <Text py='.4rem' key={index}>
                  {suggestion.place_name}
                </Text>
              </Flex>
            );
          })}
        </Box>
      )}
    </Flex>
  );
};

export const useInput = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const { setLocation, location, setDropdownLocationError } =
    useContext(stateProvider);

  const handleChange = async (e, cb) => {
    if (location === undefined) {
      setLocation('');
    }
    setLocation(e.target.value);

    try {
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.target.value}.json?types=country,address,place&access_token=pk.eyJ1IjoiaGltZWwxMjYiLCJhIjoiY2wxZ2FoeHM4MDd2OTNyb3JlcHZub3R4biJ9.iXUC5niBfA83FT2MYlWvpg&autocomplete=true&country=US`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (data.features.length) {
        console.log(data.features)
        setSuggestions(data.features);
        setShow(true);
      }
      setDropdownLocationError(false);
      cb();
    } catch (error) {
      setDropdownLocationError(true);
      console.log('Error fetching data, ', error);
    }
  };

  return {
    value: location,
    setLocation,
    onChange: handleChange,
    suggestions,
    setSuggestions,
    error,
    show,
    setError,
    setShow,
  };
};

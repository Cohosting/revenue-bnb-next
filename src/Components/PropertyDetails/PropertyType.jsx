import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import stateProvider from './../../context/stateProvider';
import Condo from './../Icons/Condo';
import PrivateHome from './../Icons/PrivateHome';
import ShareSpace from './../Icons/SharedSpace';
import StepButton from './../UI/StepButton';

const icons = [
  { icon: <Condo />, name: 'Condo' },
  { icon: <PrivateHome />, name: 'Private Home' },
  { icon: <ShareSpace />, name: 'Shared space' },
];

export const Svg = ({ element, name }) => {
  const { propertyName, selectedProperty } = useContext(stateProvider);
  const changeHandler = (e) => {
    propertyName(name);
  };

  return (
    <GridItem
      cursor='pointer'
      alignSelf={'stretch'}
      p={'.6rem'}
      border={`1px solid ${selectedProperty === name ? '#4F59B9' : '#DAD9D9'}`}
      borderRadius='12px'
      onClick={changeHandler}
    >
      <Flex
        height={'100%'}
        justify='center'
        borderRadius='2rem'
        direction='column'
        textAlign='center'
      >
        <Box
          id={name}
          mt='.5rem'
          color={selectedProperty === name ? '#4F59B9' : '#B6B6B6'}
        >
          {element}
        </Box>
        <Text
          fontSize='.8rem'
          fontWeight='medium'
          mt='.2rem'
          color={selectedProperty === name ? '#4F59B9' : '#B6B6B6'}
        >
          {name}
        </Text>
      </Flex>
    </GridItem>
  );
};

const PropertyType = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const { isBuyer, setIsBuyer, selectedProperty } = useContext(stateProvider);

  const buttonStyles = {
    borderRadius: '12px',
    paddingBlock: '1.3rem',
    fontSize: '14px',
    fontWeight: 'medium',
    background: '#FFFFFF',
    _hover: {
      // background: '#FBFBFF',
    },
    _active: {
      // background: '#FBFBFF',
    },
    _focus: {
      // background: '#FBFBFF',
    },
  };

  // let isDisable = true;

  const clickChange = (e) => {
    if (selectedProperty) {
      setIsDisable(false);
    }

    const { target } = e;
    if (target.innerText.includes('Yes')) {
      setIsClicked(true);
      setIsBuyer(false);
      return;
    } else if (target.innerText.includes('No')) {
      setIsBuyer(true);
      setIsClicked(false);
    }
  };

  return (
    // <LayoutBox text={'Propety type?'}>
    //   <Divider />
    <>
      <Flex direction={'column'} gap='1.5rem'>
        <Grid
          templateColumns={'repeat(3,1fr)'}
          gap='.5rem'
          mt='1.56rem'
          height={'85px'}
          alignItems='center'
        >
          {icons.map((el) => (
            <Svg element={el.icon} name={el.name} key={Math.random()} />
          ))}
        </Grid>
        <Text color={'#0A0E52'} fontSize='18px' fontWeight={'semibold'}>
          Do you own this property?
        </Text>
        <Divider />

        <Flex gap='1rem'>
          <Button
            sx={{
              ...buttonStyles,

              color: isClicked && !isBuyer ? '#4F59B9' : '#6B6B6B',
              border: `1px solid ${
                isClicked && !isBuyer ? '#664AE9' : '#DADADA'
              }`,
              paddingRight: '3.5rem',
            }}
            onClick={clickChange}
          >
            Yes!
          </Button>
          <Button
            sx={{
              ...buttonStyles,
              color: !isClicked && isBuyer ? '#4F59B9' : '#6B6B6B',
              border: `1px solid ${
                !isClicked && isBuyer ? '#664AE9' : '#DADADA'
              }`,
            }}
            onClick={clickChange}
          >
            No, looking to buy
          </Button>
        </Flex>
      </Flex>
      <StepButton isDisable={isDisable} />
    </>
    // </>
  );
};

export default PropertyType;

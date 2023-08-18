import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image, Spinner, Text,
  
  useMediaQuery
} from '@chakra-ui/react';
import { ArrowRight } from 'phosphor-react';
import React, { useContext, useState } from 'react';
/* import { useNavigate } from 'react-router-dom';
 */import Car from './../../Images/car.png';
import HotTub from './../../Images/Screen.png';
import BBQGrill from './../../Images/Screengrill.png';
import Wifi from './../../Images/wifi.png';
import { setBaseResultDoc } from '../../lib/reports';
import { SignupModal } from '../modals/SignupModal';
import stateProvider from './../../context/stateProvider';
import Gym from './../../Images/gym.png';
import Ocean from './../../Images/ocean.png';
import Resort from './../../Images/resort.png';
import Pool from './../../Images/Screenfgfg.png';

const path = [
  { file: Pool, name: 'Private Pool' },
  { file: HotTub, name: 'Private Hot tub' },
  { file: Wifi, name: 'Wifi' },
  { file: Gym, name: 'Gym' },
  { file: Car, name: 'Free parking' },

  { file: BBQGrill, name: 'Grill' },
  { file: Ocean, name: 'Ocean front' },
  { file: Resort, name: 'Resort Amenities ' },
];

export const Svg = ({ path, name }) => {
  const [isClicked, setIsClicked] = useState(false);
  const { state, dispatch } = useContext(stateProvider);
  const { selectedValue } = state;

  const clickHandler = () => {
    setIsClicked(!isClicked);

    if (!selectedValue?.includes(name)) {
      dispatch({ type: 'selection', payload: name });
    } else if (!isClicked) {
      dispatch({ type: 'deletion', payload: name });
    }
  };

  return (
    <GridItem
      // maxW={'4rem'}
      maxH={'6rem'}
      cursor='pointer'
      background={`${selectedValue?.includes(name) ? '#F8F8F8' : '#FFFFFF'}`}
      border={`1px solid ${selectedValue?.includes(name) ? '#212529' : '#DAD9D9'
        }`}
      borderRadius='12px'
      onClick={clickHandler}
      py='1rem'
    >
      <Flex
        justify='center'
        align='center'
        borderRadius='2rem'
        direction='column'
        textAlign='center'
      >
        <Box>
          <Image width={30} height={30} src={path} alt='icon' />
        </Box>
        <Text
          color={'black'}
          fontSize='13px'
          fontWeight='medium'
          lineHeight={'1.2'}
          mt={'2px'}
          padding={'4px'}

        // mt='.2rem'
        >
          {name}
        </Text>
      </Flex>
    </GridItem>
  );
};

const Amenities = () => {
  const [showLoading, setShowLoading] = useState(false);
/*   const navigate = useNavigate()
 */  const { pageChange, pageBack, progressHandler, counts, propertyCoordinates, location, currentUser, isUserAvailable } =
    useContext(stateProvider);
  const { bedrooms,
    bathrooms, guests } = counts
  const [isLargerThan1400] = useMediaQuery('(min-width: 1400px)');


  const buttonStyles = {
    background: '#FFFF',
    cursor: 'pointer',
    color: '#000000',
    borderRadius: '8px',
    _focus: {
      background: '#FFFF',
    },
    _hover: {
      background: '#FFFF',
    },
    _active: {
      background: '#FFFF',
    },
    fontFamily: 'GTMedium',
    fontWeight: '16px',
    fontWeight: 500
  };

  return (
    <>
      <Grid templateColumns={'repeat(4,1fr)'} gap='.5rem' mt='1.3rem'>
        {path.map((el) => (
          <Svg path={el.file} name={el.name} key={Math.random()} />
        ))}
      </Grid>
      <Flex justify={'space-between'}>
        <Button
          alignSelf={'end'}
          mt='1.5rem'
          sx={{
            ...buttonStyles,
            backgroundColor: '#FFFF',
            color: '#212529',
            _focus: {
              boxShadow: '0',
            },
            _hover: {
              background: 'none',
            },
            _active: {
              background: 'none',
            },
          }}
          onClick={() => pageBack()}
        >
          Back
        </Button>
        {!isLargerThan1400 && <SignupModal />}
        {isLargerThan1400 && (
          <Button
            alignSelf={'end'}
            mt='1.5rem'
            gap={'.5rem'}
            sx={{ ...buttonStyles }}
            onClick={async () => {

              if (isUserAvailable.isUserAvailable) {
                setShowLoading(true);
                const id = await setBaseResultDoc({
                  guests,
                  bedrooms,
                  bathrooms,
                  coordinates: propertyCoordinates,
                  createdBy: currentUser.id,
                  location,
                });
                setShowLoading(false);



                /*                 navigate(`result/${id}`);
                 */

              } else {
                progressHandler('register');
                pageChange();

              }

            }}
          >
            Calculate Now
            <ArrowRight color='#000000' size={30} />

            {
              showLoading && (

                <Spinner />
              )
            }
          </Button>
        )}

      </Flex>
    </>
  );
};

export default Amenities;

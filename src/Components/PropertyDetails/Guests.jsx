import { Button, Flex, Spinner, useMediaQuery } from '@chakra-ui/react';
import { ArrowRight, Bed, Shower, Users } from 'phosphor-react';
import React, { useContext, useState } from 'react';
/* import { useNavigate } from 'react-router-dom';
 */import { setBaseResultDoc } from '../../lib/reports';
// import Bathrooms from '../Icons/Bathrooms';
// import Bedrooms from '../Icons/Bedrooms';
import stateProvider from './../../context/stateProvider';
import Counter from './Counter';

const buttonStyles = {
  fontFamily: 'GTMedium',
  fontSize: '17px',
  fontWeight: 'medium',
  background: 'none',
  cursor: 'pointer',
  color: '#000000',
  borderRadius: '8px',
  _focus: {
    boxShadow: '0',
  },
  _hover: {
    // background: '#664AE9',
  },
  _active: {
    // background: '#664AE9',
  },
};

const Guests = () => {
  const {
    pageChange,
    state,
    getPropertyCoordinates,
    counts,
    isSelectedFromDropdown,
    setDropdownLocationError,
    pageBack, progressHandler, propertyCoordinates, location, currentUser, isUserAvailable, onOpen
  } = useContext(stateProvider);
  const { bedrooms, bathrooms, guests } = counts
  const [showLoading, setShowLoading] = useState(false);
  const [isLessThen767px] = useMediaQuery('(max-width: 767px)')
  /* 
    const navigate = useNavigate();
   */
  let navigate = '';
  const icons = [
    {
      value: counts.bedrooms,
      icon: <Bed color="#000000" size={25} />,
      text: 'Bedrooms',
    },
    {
      value: counts.bathrooms,
      icon: <Shower color="#000000" mirrored="true" size={25} />,
      text: 'Bathrooms',
    },
    {
      value: counts.guests,
      icon: <Users color="#000000" size={25} />,
      text: 'Guests',
    },
  ];

  return (
    <>
      <Flex
        color={'rgba(10, 14, 82, 1)'}
        fontSize="1.3rem"
        fontWeight={'semibold'}
        direction={'column'}
        overflow={'hidden'}
      >
        {icons.map(el => (
          <Counter
            value={el.value}
            text={el.text}
            icon={el.icon}
            // isDisabled={false}
            key={Math.random()}
          />
        ))}
      </Flex>
      <Button
        // isDisabled={isDisable}
        alignSelf={'flex-end'}
        /*     style={{
                  WebkitAlignSelf: 'flex'
                }} */
        mt="1.5rem"
        gap={'.5rem'}
        sx={{ ...buttonStyles }}
        onClick={async () => {
          if (!isSelectedFromDropdown) {
            setDropdownLocationError(true);
            return;
          }


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



            navigate(`result/${id}`);


          } else {
            if (!isLessThen767px) {

              progressHandler('register');
              pageChange();
            } else {
              onOpen()
            }

          }


        }}
      >
        Calculate
        {
          showLoading && (
            <Spinner size={'md'} />
          )
        }
        <ArrowRight color="#000000" size={30} />
      </Button>
    </>
  );
};

export default Guests;

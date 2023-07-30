import { Box, Flex, Text } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useContext } from 'react';
import stateProvider from './../context/stateProvider';
import Investment from './Investment';
import { LayoutBox } from './Layout/LayoutBox';
import Managers from './Managers';
import MonthlyData from './MonthlyData';
import NightlyData from './NightlyData';

const Breakdown = ({ monthlyData }) => {
  const { selectedName, isAuthenticated } = useContext(stateProvider);

  const iconsDetails = [
    { icon: 'calendar', name: 'Monthly' },
    /*     { icon: 'moon', name: 'Nightly' },
     *//*     { icon: 'credit-card', name: 'Investment score' },
 */    { icon: 'briefcase', name: 'Managers' },
  ];
  return (
    <>
      <LayoutBox shouldHeight100={false} sx={{ height: 'max-content' }}>
        <Flex textAlign={'center'} overflow='scroll' className='scroll'>
          {iconsDetails.map((el) => (
            <SVG
              element={el.icon}
              text={el.name}
              id={el.name}
              key={Math.random()}
            />
          ))}
        </Flex>
      </LayoutBox>

      <>
        {/* {!isAuthenticated && <BreakDownSign />} */}
        {isAuthenticated && selectedName === 'Monthly' && (
          <MonthlyData monthlyData={monthlyData} />
        )}
        {isAuthenticated && selectedName === 'Managers' && <Managers />}
        {isAuthenticated && selectedName === 'Investment score' && (
          <Investment />
        )}
        {isAuthenticated && selectedName === 'Nightly' && <NightlyData />}
      </>
    </>
  );
};

export default Breakdown;

export const SVG = ({ element, text }) => {
  const { selectedName, clickHandler, isAuthenticated } =
    useContext(stateProvider);

  const changeHandler = () => {
    clickHandler(text);
  };

  const boxStyles = {
    borderRadius: '14px',
    textAlign: 'center',
    fontSize: '12px',
    justifyContent: 'center',
    alignItems: 'center',
    p: '4px 10px',
    gap: '.3rem',
    fontWeight: 'medium',
    cursor: "pointer"
  };

  return (
    <Flex
      sx={{ ...boxStyles }}
      onClick={changeHandler}
      bg={selectedName === text && isAuthenticated ? '#009dae' : '#ffff'}
      color={selectedName === text && isAuthenticated ? '#fff' : '#6B6B6B'}
    >
      {selectedName === text && isAuthenticated && (
        <Box onClick={changeHandler}>
          <FeatherIcon size={17} color='#fff' icon={element} />
        </Box>
      )}
      <Text
        onClick={changeHandler}
        lineHeight={'14px'}
        textAlign='center'
        whiteSpace={'nowrap'}
      >
        {text}
      </Text>
    </Flex>
  );
};

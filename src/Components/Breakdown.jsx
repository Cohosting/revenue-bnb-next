import dynamic from 'next/dynamic';
import { Box, Flex, Grid, GridItem, SimpleGrid, Text } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useContext } from 'react';
import stateProvider from './../context/stateProvider';
import { LayoutBox } from './Layout/LayoutBox';
import { CompareableListings } from './UI/CompareableListings'
import { Map } from './Map';
// Dynamically importing the components
const Investment = dynamic(() => import('./Investment'));
const Managers = dynamic(() => import('./Managers'));
const MonthlyData = dynamic(() => import('./MonthlyData'));
const NightlyData = dynamic(() => import('./NightlyData'));

const Breakdown = ({ monthlyData, results }) => {
  const { comps } = results
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
          <>
          <MonthlyData monthlyData={monthlyData} />
            <Box px={'35px'}>
              <Text fontSize={'24px'}>Similar listing</Text>

              <Box my={2}>
                <CompareableListings listings={comps} results={results} />

              </Box>
            </Box>
            {/*             <Map compareableProperty={comps} results={results} />
 */}
          </>
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

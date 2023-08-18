import { Box, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import stateProvider from '../../context/stateProvider';
import Locations from './../PropertyDetails/Locations';

export const LayoutBox = ({ text, children, sx, isAuth, shouldHeight100 = true }) => {
  const { step } = useContext(stateProvider);
  const [isLargerThan600] = useMediaQuery('(min-width: 600px)');
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isLargerThan1000] = useMediaQuery('(min-width: 1000px)');

  const route = useRouter();

  const dynamicStyles = isLargerThan1000 &&
    route.pathname.includes('result') && {
    w: '98%',
    maxW: '1000px',
    margin: '0 auto',
    bg: '#F6F6F6',
  };

  const boxStyles = {
    boxShadow: '0px 40px 40px 0px rgba(198, 217, 225, 0.25)',
    bg: '#FFF',
    border: !isAuth && '1px solid #e5e5e5',
    mx: isLargerThan600 ? '1.775rem' : '1rem',
    mb: '1rem',
    mt: !route.pathname.includes('result') && '1rem',
    borderRadius: '24px',
    p: '1rem',
    color: '#212529',
  };

  return (
    <Box
      bg={!isLargerThan768 && '#F5F5F5'}
      w='100%'
      h={shouldHeight100 && '100%'}
      sx={{ ...sx, ...dynamicStyles }}
    >
      <Flex direction={'column'} sx={{ ...boxStyles }}>
        {text && (
          <Text mb='1rem' fontWeight={'semibold'} fontSize='18px'>
            {text}
          </Text>
        )}
        {children}
      </Flex>
      {route.pathname === '/' && step === 1 && <Locations />}
      {route.pathname === '/' && (
        <Box pb={'30px'} marginTop={'40px'} fontSize={'15px'} color={'#6B6B6B'} fontWeight={500} fontFamily={'GT Eesti Text Light'}>
          <Text textAlign={'center'} lineHeight={1.2}>Copywrite &copy;{new Date().getFullYear()}</Text>
          <Flex align={'center'} justifyContent={'center'}>
            <Text>Terms of use</Text>
            &nbsp;
            &
            &nbsp;

            <Text>Privacy Policy</Text>
          </Flex>
        </Box>
      )}

    </Box>
  );
};

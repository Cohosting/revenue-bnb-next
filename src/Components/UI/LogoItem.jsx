import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import Login from '../../auth/Login';
import Signup from '../../auth/Signup';
import { History } from '../modals/History';
import HistoryModal from '../modals/HistoryModal';
import PropertyDetails from '../PropertyDetails/PropertyDetails';
import Confirmation from './../../auth/Confirmation';
import stateProvider from './../../context/stateProvider';
import Banner from './../../Images/banner.png';
import DesktopBanner from './../../Images/desktopbanner.jpg';
import Logo from './../../Images/revenuebnb_logo.png';
import mainLogo from './../../Images/main_logo.svg';
import ForgotPassword from '../ForgotPassword';
import { useRouter } from 'next/router';

const buttonStyles = {
  fontSize: '14px',
  fontWeight: 'semibold',
  height: '2.5rem',

  background: '#000000',
  cursor: 'pointer',
  color: '#FFFFFF',
  my: '2rem',
  _focus: {
    boxShadow: '0',
  },
  _hover: {
    background: '#000000',
  },
  _active: {},
};

const textStyles = {
  fontWeight: 'semibold',
  fontSize: '28px',
  lineHeight: '1.2em',
  p: '1.5rem',
};
const boxStyles = {
  border: '1px solid #d6d6d6',
  alignSelf: 'center',
  px: '1rem',
  borderRadius: '14px',
  color: '#6b6b6b',
  bg: '#e0e0e0',
  fontWeight: 'medium',
};

const LogoItem = () => {
  const [isLargerThan1400] = useMediaQuery('(min-width: 1400px)');
  const [isLargerThan1600] = useMediaQuery('(min-width: 1600px)');
  const [isLargerThan1800] = useMediaQuery('(min-width: 1800px)');
  const [isLargerThan600] = useMediaQuery('(min-width: 600px)');
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isLargerThan700] = useMediaQuery('(min-height: 700px)');
  const [isLargerThan1000] = useMediaQuery('(min-width: 1000px)');
  const [isLargerThan1200] = useMediaQuery('(min-width: 1200px)');
  const { isOpen, onClose, onOpen } = useDisclosure();

  const router = useRouter();

  const {
    progress,
    authStep,
    values,
    setValues,
    progressHandler,
    setIsItFromHeader,
    isUserAvailable,
    setIsLogging, setAlreadyExist, setAuthStep
  } = useContext(stateProvider);

  const dynamicStyles = isLargerThan1000 &&
    router.pathname.includes('result') && {
    w: '98%',
    maxW: '1000px',
    margin: '0 auto',
  };


  return (
    <>
      <Grid
        sx={{
          color: '#000',
          textAlign: 'center',
          ...dynamicStyles,
        }}
        templateColumns={isLargerThan768 && '1fr 1fr'}
      >
        {isLargerThan768 && (
          <>
            {!router.pathname.includes('result') && (
              <>
                <GridItem h='100vh'>
                  <Grid h='100%' templateRows={'max-content 1fr'}>
                    <Flex ml='5rem' my='2rem' align={'center'} gap='.15rem'>
                      <Image src={mainLogo} h='30px' w='30px' />
                      <Text
                        textAlign='left'
                        fontWeight={'medium'}
                        fontFamily={'Kurale'}
                        fontSize='27px'
                        color={'#000000'}
                      >
                        RevenueBnB
                      </Text>
                    </Flex>
                    <Flex
                      direction={'column'}
                      alignSelf='center'
                      mt={
                        !isLargerThan700
                          ? '0rem'
                          : !isLargerThan1200
                            ? '0rem'
                            : !isLargerThan1400
                              ? '0rem'
                              : '0'
                      }
                    >
                      <Image
                        src={DesktopBanner.src}
                        h={!isLargerThan1200 ? 'auto' : !isLargerThan1600 ? '450px' : isLargerThan1800 ? '550px' : '520px'}
                        w='100%'
                        alt='banner img'
                      />
                      <Text
                        sx={{
                          ...boxStyles,
                        }}
                      >
                        Free Forever
                      </Text>

                      <Text
                        sx={{
                          pb: '0',
                          mt: '.4rem',
                          mx: 'auto',
                          w: isLargerThan1400 ? '65%' : '80%',
                        }}
                        color={'#000000'}
                        fontSize={
                          isLargerThan1400
                            ? '34px'
                            : isLargerThan1200
                              ? '27px'
                              : isLargerThan768
                                ? '24px'
                                : ''
                        }
                        textAlign={'center'}
                        lineHeight={'140%'}
                        fontWeight={'bold'}
                        fontFamily='GTBold'
                      >
                        Unlimited vacation rental price prediction.
                      </Text>
                    </Flex>
                  </Grid>
                </GridItem>
                <GridItem bg='#fff'>
                  <Grid
                    h={'100%'}
                    templateRows={' max-content 1fr'}
                    justifyContent='center'
                  >
                    <Flex align={'baseline'} style={{

                      WebkitJustifyContent: 'flex-end',
                      WebkitAlignItems: 'baseline',
                      /*                 -webkit-justify-content: flex-end;
                align-items: flex-end;
                -webkit-align-items: flex-end; */
                    }}>
                      {
                        isUserAvailable.isKnown && !isUserAvailable.isUserAvailable && (
                          <Button variant={''} onClick={() => {
                            progressHandler('register');
                            setIsItFromHeader(true);
                            setAuthStep('login')

                          }}>Login</Button>

                        )
                      }

                      <Button
                        isLoading={!isUserAvailable.isKnown}
                        onClick={() => {
                          if (isUserAvailable.isUserAvailable) {
                            onOpen();
                          } else {
                            progressHandler('register');
                            setAuthStep('register')

                            setIsItFromHeader(true);
                          }
                        }}
                        sx={{
                          ...buttonStyles,
                          justifySelf: 'end',
                          mr:
                            progress !== 'register'
                              ? '2.5rem'
                              : !isLargerThan1000
                                ? '2.5rem'
                                : '',
                          mb: '4rem',
                          p: '1rem',
                        }}
                      >
                        {isUserAvailable.isUserAvailable ? 'Account' : 'Sign up'}
                      </Button>
                    </Flex>

                    {progress === 'property' && (
                      <PropertyDetails
                        maxW={
                          isLargerThan1400
                            ? '450px'
                            : isLargerThan1200
                              ? '420px'
                              : isLargerThan768
                                ? '400px'
                                : ''
                        }
                      />
                    )}
                    {progress === 'register' && (
                      <Box
                        bg='#FFF'
                        sx={{
                          px: '2rem',
                          pb: '2rem',
                          pr: authStep === 'login' && '0',
                          maxW: '430px',
                          alignSelf: 'center',
                          height: '',
                          marginTop: !isLargerThan1000 && '-5vh',
                          boxShadow:
                            isLargerThan1000 &&
                            '0px 20px 50px 0px rgba(198, 217, 225, 0.25)',
                          borderRadius: '24px',
                        }}
                      >
                        {authStep === 'register' && (
                          <Signup values={values} setValues={setValues} />
                        )}
                        {authStep === 'confirmation' && <Confirmation />}
                        {authStep === 'login' && <Login />}
                        {authStep === 'forgotPassword' && <ForgotPassword shouldPadding={true} />}

                      </Box>
                    )}
                  </Grid>
                </GridItem>
              </>
            )}
            {router.pathname.includes('result') && <DesktopLayout />}
          </>
        )}

        {!isLargerThan768 && (
          <>
            <Flex
              w='100%'
              height='5rem'
              align='center'
              pt='1.5rem'
              justify={'space-between'}
              px={isLargerThan600 ? '1.775rem' : '1rem'}
            >
              <Flex align='center'>
                <Image w={'30px'} h={'30px'} src={mainLogo} />
                <Text fontFamily={'Kurale'} fontSize='27px' color={'#000'}>
                  RevenueBnB
                </Text>
              </Flex>
              <History />
            </Flex>

            {router.pathname === '/' && (
              <>
                <Image mt={'1rem'} w='100%' src={Banner.src} alt='banner img' />

                <Text
                  as={'div'}
                  sx={{
                    ...boxStyles,
                    justifySelf: 'center',
                    px: '1rem',
                  }}
                  fontFamily='GTMedium'
                  marginTop={'0.6rem'}
                  paddingTop={'1.5px'}
                  paddingBottom={'1.5px'}
                  fontSize={'15px'}
                >
                  Free Forever
                </Text>
                <Text
                  sx={{ ...textStyles, pb: '0', pt: '.5rem' }}
                  color={'#000000'}
                  fontWeight={'bold'}
                  fontFamily='GTBold'
                  className='hero-title'
                >
                  Unlimited vacation rental price prediction.
                </Text>
              </>
            )}
          </>
        )}
        <HistoryModal isOpen={isOpen} onClose={onClose} />
      </Grid>
    </>
  );
};

export default LogoItem;

const DesktopLayout = () => {
  return (
    <>
      <GridItem height='5rem'>
        <Flex
          fontFamily={'Kurale'}
          fontSize='27px'
          ml='2.2rem'
          color={'#000'}
          my='1.5rem'
          align={'center'}
          gap='.15rem'
        >
          <Image src={mainLogo.src} w={'30px'} h={'30px'} />
          <Text
            textAlign='left'
            fontWeight={'medium'}
            fontSize='27px'
            color={'#000000'}
          >
            RevenueBnB
          </Text>
        </Flex>
      </GridItem>
      <GridItem alignItems='end' height='5rem' mr='2rem'>
        <Flex h='100%' align='center' justifyContent={'flex-end'}>
          <History />
        </Flex>
      </GridItem>
    </>
  );
};

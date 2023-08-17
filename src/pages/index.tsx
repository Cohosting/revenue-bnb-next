import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Box, Button, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useMediaQuery, useOutsideClick } from '@chakra-ui/react'
import { useContext, useEffect, useRef } from 'react';
import { Header } from './../Components/Header'
import stateProvider from '../context/stateProvider';
import { getAddress } from '../lib/mapbox';
import companiesImage from './../Images/companies.png'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { BiTargetLock } from 'react-icons/bi';
import { GoLocation } from 'react-icons/go'
import { MapPin } from 'react-feather';
import { AuthModal } from './../Components/modals/AuthModal'
import { BsCurrencyDollar } from 'react-icons/bs'
/* @ts-ignore */
import Slider from "react-slick";
import { setBaseResultDoc } from './../lib/reports'
import { useInput } from './../Components/PropertyDetails/PropertyDetails'
import { useRouter } from 'next/router';
import { AuthContext } from '../context/authContext';
import dynamic from 'next/dynamic';
const MobileSearch = dynamic(() => import('../Components/MobileSearch'));
const SavvyCal = dynamic(() => import('./../Components/savvyCall'));
function isEven(n: any) {
  return n % 2 == 0;
}

let exampleData = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1600889005341-b9a629045f12?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    text: 'Myrtle Beach, SC',
    coordinates: [-78.8900409, 33.6956461]
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1585094482292-22b9ffb54d32?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    text: 'Joshua Tree, CA',
    coordinates: [-116.3209349, 34.1265262]
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1506335004836-f0bfacc1cdd9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80',
    text: 'Choachella Valley, CA',
    coordinates: [-119.960433, 35.311325]

  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1577801961331-d6719362d442?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    text: 'Sarasota, FL',
    coordinates: [-82.5308545, 27.3365805]
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1586934767479-5afba876dc68?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    text: 'Palm Springs, CA',
    coordinates: [-116.4952977, 33.7721794]
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1579970018561-4ceaecacdcec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80',
    text: 'Austin, TX',
    coordinates: [-97.7436995, 30.2711286]
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1647089370517-f464bc89dce9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    text: 'Nashville, TN',
    coordinates: [-86.7742984, 36.1622767]
  },
  {
    imageUrl: 'https://topbrunchspots.com/wp-content/uploads/2022/05/AF1QipOFo8Vi7hX-uxTGJHXKuyEfvl4oFuEg2_r6Q6OWw1600-h1000-k-no-1024x768.jpeg',
    text: 'Hurricane, UT',
    coordinates: [-113.289888, 37.1750272]
  },

]


function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (


    <Box className={className}
      style={{ ...style, display: "block", boxShadow: ' 0px 3px 3px 0px rgba(158, 157, 164, 0.3)' }}
      onClick={onClick}>
      sdfsdf
    </Box>

  );
}

export default function Home() {
  const { currentUser: CU, isUserSearched, setShowAuthModal } = useContext<any>(AuthContext);
  const { counts, setCounts, isUserAvailable, setLocation, setPropertyCoordinates } = useContext<any>(stateProvider); 
  //  @ts-ignore
  const { bathrooms, bedrooms, guests } = counts;
  const [isLessThan680] = useMediaQuery('(max-width: 680px)')
  const navigate = useRouter()
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isOpen: showLoading, onOpen: setShowLoading } = useDisclosure();
  const { isOpen: isSignUpOpen, onOpen: onSignupOpen, onClose: onSignupClose } = useDisclosure();
  const { isOpen: isSuccessModal, onOpen: onSuccessModal, onClose: onSuccessClose } = useDisclosure();
  const { isOpen: isLocationError, onOpen: onLocationError, onClose: onLocationErrorClose } = useDisclosure();

  let labelStyle = {
    fontSize: '14px',
    fontFamily: 'GTBold'
  }

  const ref = useRef()
  const {
    location,
    setIsSelectedFromDropdown,

    setDropdownLocationError,
    propertyCoordinates,
    setIsItFromHeader,
  } = useContext<any>(stateProvider);
  const address = useInput();
  const outsideRef = useRef()
  const settings = {
    infinite: true,
    speed: 500,
    slidesToScroll: 4,
    dots: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SampleNextArrow />,
    variableWidth: true
  };

  useOutsideClick({
    /* @ts-ignore */
    ref: outsideRef,
    handler: () => address.setShow(false),
  })

  const addItem = (text: any) => {
    const textLower = text.toLowerCase();

    if (text === 'Bathrooms') {
      setCounts({
        ...counts,
        [textLower]: counts[textLower] + 0.5,
      });
    } else {
      setCounts({
        ...counts,
        [textLower]: parseInt(counts[textLower]) + 1,
      });
    }
  };
  const removeItem = (text: any) => {
    const textLower = text.toLowerCase();
    if (counts[textLower] === 1) return;

    if (text === 'Bathrooms') {
      setCounts({
        ...counts,
        [textLower]: counts[textLower] - 0.5,
      });
    } else {
      setCounts({
        ...counts,
        [textLower]: parseInt(counts[textLower]) - 1,
      });
    }
  };

  const getCurrentLocation = (setLocation: any) => {
    onOpen();

    try {
      let callbacks = async (s: any) => {
        const { coords } = s;
        const address = await getAddress(coords.longitude, coords.latitude);
        if (address && address.isError && address.isError === true) {
          onClose();
          onLocationError();
        } else {
          setLocation(address);
          onClose();
        }
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          callbacks,
          (error) => {
            onClose();
/*             onLocationError(error);
 */          }
        );
      } else {
        console.log('Geolocation is not supported by this browser');
        onClose();
        onLocationError();
      }
    } catch (error) {
      console.log('An error occurred while retrieving the current location:', error);
      onClose();
/*       onLocationError(error);
 */    }
  };


  const calculatePrediction = async () => {
    if (!location || !bedrooms || !bathrooms) return

    /* Lng lat */
    // replace this logic with current new user logic
    if (CU && isUserSearched) {
      /* This part get called if we have user */

      setShowLoading();
      const id = await setBaseResultDoc({
        ...counts,
        coordinates: propertyCoordinates,
        createdBy: CU.id,
        location,
      });


      /* @ts-ignore */
      await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location,
          bedrooms,
          bathrooms,
          guests,
          coordinates: propertyCoordinates,
          createdByEmail: CU.email,
          createdBy: CU.id,
          reportId: id,
          existingUser: true,
          email: CU.email,
          fullName: CU.fullName,
          userType: CU.userType,
        })
      })
      setShowLoading();

      navigate.push(`result/${id}`);
    } else if (!CU && isUserSearched) {
      /* Or show the moddal of the auth!!!! */
      setShowAuthModal(true)


      // This ask for authentication!
      /* setIsItFromHeader(false)
      onSignupOpen() */
    }
  }

  useEffect(() => {
    address.setShow(false);

  }, [location])
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        direction={'column'}
        bg={'#F6F6F6'}
        height={'100vh'}
        overflowY={'auto'}
      >
        <SavvyCal />
        <AuthModal />
        <Box bg={'white'} height={'100vh'} overflowY={'auto'}>
          <Header
            isSuccessModal={isSuccessModal}
            onSuccessModal={onSuccessModal}
            onSuccessClose={onSuccessClose}
            isOpen={isSignUpOpen}
            onOpen={onSignupOpen}
            onClose={() => {
              onSignupClose();
              setIsItFromHeader(false)

            }
            } />
          <Flex px={['20px', '30px']} alignItems={'center'} flexDir={'column'} pt={'20px'} maxW={'100%'} w="800px" margin={'auto'} >
            <Flex mt={['15px', '35px']} mb={'20px'} alignItems={'center'} p={1} px={'16px'} py={'7px'} borderRadius="31px" boxShadow={'0 0 0 3px rgb(210 4 125 / 5%)'} border={'1px solid rgb(252, 212, 248)'} w={'320px'} maxW="100%">
              <Text color={'rgb(247, 34, 219)'} fontFamily={'GTMedium'} >New</Text>
              <Box mx={'15px'} w={'2px'} height={'23px'} bg={'#e2e8f0'} />
              <Text fontFamily={'GTMedium'} color={'black'}>Introducing advanced reports</Text>
            </Flex>
            <Box textAlign={'center'} fontSize={['30px', '30px', '40px']} fontFamily={'GTBold'} mb={['15px', '35px']} >
              <Text >Find your next vacation </Text>
              <Text mt={'-10px'}>rental investment<Text as={'span'} color={'rgb(247, 34, 219)'} >.</Text></Text>
            </Box>

            {
              !isLessThan680 ? (
                <>

                  <Flex justifyContent={'space-between'} alignItems={'center'} w={'100%'} maxW={'650px'} borderRadius={'12px'} py={'11px'} px={'15px'} border={'1px solid  #e2e8f0'} boxShadow={'0px 1px 3px -2px rgba(158, 157, 164, 0.49)'}>
                    <Flex pos={'relative'}>
                      <Flex onClick={() => ref.current.focus()} cursor="pointer" overflow={'hidden'} borderRight="1px solid #e2e8f0" w={'200px'} alignItems={'center'}>
                        <GoLocation />
                        <Box ml={'10px'} w={'140px'}>
                          <Text sx={labelStyle}>Where</Text>
                          <Box  >
                            <input ref={ref} style={{
                              width: "100%",
                              border: 'none',
                              outline: 'none',
                              fontFamily: 'GTMedium'
                            }}
                              {...address}
                              onFocus={(e) => {
                                address.setShow(true);
                              }}
                              onChange={(e) =>
                                address.onChange(e, () => {
                                  setIsSelectedFromDropdown(false);
                                })
                              }

                              placeholder='Enter  Address' />
                            {address.show && location !== '' && (
                              <Box ref={outsideRef} left={0} top={'60px'} zIndex={23232} pos={'absolute'} bg="white" boxShadow={'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;'} borderRadius={'12px'} >
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
                                      fontFamily={'GTRegular'}
                                      onClick={() => {
                                        setPropertyCoordinates(suggestion.geometry.coordinates);
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

                          </Box>

                        </Box>
                      </Flex>
                      <Box flex={1} paddingRight="50px" paddingLeft={'20px'} >
                        <Text sx={labelStyle}>Bedrooms</Text>
                        <Flex alignItems={'center'} justifyContent={'center'} color={'rgb(158, 157, 164)'} >
                          <AiOutlineMinus onClick={() => removeItem('Bedrooms')} cursor={'pointer'} />
                          <Text mx={2} fontSize="14px" >{bedrooms}</Text>
                          <AiOutlinePlus onClick={() => addItem('Bedrooms')} cursor={'pointer'} />
                        </Flex>
                      </Box>
                      <Box flex={1} paddingLeft={'50px'} borderLeft="1px solid #e2e8f0"  >
                        <Text sx={labelStyle}>Bathrooms</Text>
                        <Flex alignItems={'center'} justifyContent={'center'} color={'rgb(158, 157, 164)'}  >
                          <AiOutlineMinus onClick={() => removeItem('Bathrooms')} cursor={'pointer'} />
                          <Text mx={2} fontSize="14px" >{bathrooms}</Text>
                          <AiOutlinePlus onClick={() => addItem('Bathrooms')} cursor={'pointer'} />
                        </Flex>
                      </Box>
                    </Flex>

                    <Button isLoading={showLoading} onClick={calculatePrediction} height={'36px'} fontSize={'15px'} bg={'rgb(247, 34, 219)'} color={'white'} fontFamily={'GTBold'}>
                      Calculate
                    </Button>
                  </Flex>
                  <Flex w={'100%'} maxW={'650px'} alignItems={'center'} justifyContent={'space-between'} mt={'14px'} >
                    <Flex alignItems={'center'}>
                      <Box bg={'rgb(252, 174, 241)'} color={'rgb(247, 34, 219)'} padding={'3px'} borderRadius={'100px'} display={'inline-block'}>
                        <BsCurrencyDollar />
                      </Box>
                      <Flex alignItems={'center'} fontSize={'18px'}>
                        <Text ml={2} mr={2} color={'rgb(247, 34, 219)'} fontFamily={'GTMedium'}>
                          Free forever
                        </Text>
                        <Text fontFamily={'GTLight'} >
                          unlimited searches
                        </Text>

                      </Flex>

                    </Flex>
                    <Flex color={'rgb(247, 34, 219)'} alignItems={'center'} fontFamily={'GTMedium'}>
                      {
                        isOpen && (
                          <Spinner mr={1} />
                        )
                      }
                      <BiTargetLock />
                      <Text cursor={'pointer'} ml={2} onClick={() => getCurrentLocation(address.setLocation)}>

                        Near me now</Text>
                    </Flex>
                  </Flex>
                </>

              ) : <MobileSearch
                addItem={addItem}
                removeItem={removeItem}
                address={address}
                setPropertyCoordinates={setPropertyCoordinates}
                setIsSelectedFromDropdown={setIsSelectedFromDropdown}
                setDropdownLocationError={setDropdownLocationError}
                isOpen={isOpen}
                counts={counts}
                getCurrentLocation={() => getCurrentLocation(address.setLocation)}
                calculatePrediction={calculatePrediction}
                outsideRef={outsideRef}
              />
            }

            <Box w={'100%'} mt={'70px'}>
              <Slider {...settings}>

                {
                  exampleData.map((el, idx) => (
                    <div style={{
                      width: !isLessThan680 ? '150px' : '130px'
                    }}>
                      <Box onClick={() => {
                        setLocation(el.text);
                        setPropertyCoordinates(el.coordinates)

                      }} cursor={'pointer'} mx={'10px'} pt={isEven(idx) && '50px'} >
                        <Image objectFit={'cover'} borderRadius={'10px'} src={el.imageUrl} w={'250px'} height={'170px'} />
                        <Text textAlign={'center'} mt={2} fontFamily={'GTMedium'} fontSize={'12px'} fontWeight={'500'} > Search location</Text>
                        <Text fontFamily={'GTBold'} textAlign="center" fontSize={['12px', '14px']}> {el.text} </Text>
                      </Box>
                    </div>

                  ))
                }

              </Slider>
            </Box>

            {/* Company Image */}
            <Box w="100%" mt={'100px'} >
              <Image src={companiesImage.src} w={'100%'} />
            </Box>

          </Flex>


          <Modal isCentered isOpen={isLocationError} onClose={onLocationErrorClose}>
            <ModalOverlay />
            <ModalContent fontFamily={'GTMedium'}>
              <ModalHeader color={'red'}>Location Error</ModalHeader>
              <ModalBody>
                <Text>
                  Having trouble getting your location. Please input your location. Thank you.
                </Text>
              </ModalBody>

              <ModalFooter>
                <Button bg={'rgb(247, 34, 219)'} w={'100%'} colorScheme='blue' mr={3} onClick={onLocationErrorClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box >

      </Flex>
    </>
  )
}

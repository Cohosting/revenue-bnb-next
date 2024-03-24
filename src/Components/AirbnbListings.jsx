import React from 'react';
import {
    Box,
    Heading,
    Text,
    Image,
    Flex,
    Stack,
    HStack,
    Icon,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { ChevronRight } from 'react-feather';

export const AirbnbListing = ({
    isOpen, onClose, property
}) => {
    if (!isOpen) return;
    return (

        <Modal size={'2xl'} isOpen={isOpen} onClose={onClose} >
            <ModalOverlay />
            <ModalContent>

                <ModalBody p={0} fontFamily={'GT Eesti Text Light'} >
                    <Flex borderBottom={'1px solid'} borderColor={'gray.200'} >
                        <Image borderTopLeftRadius={'6px'} w={'50%'} src={` https://a0.muscache.com/im/pictures/${property?.thumbnail_url}?aki_policy=large`} alt="Trailer" />
                        <Text top={3} bg={'white'} py={'5px'} borderRadius={'20px'} px={'10px'} left={3} pos={'absolute'} fontSize="12px" color="gray.500">
                            109 mi
                        </Text>
                        <Box p={2} flex={1}>
                            <Box  >
                                <Text fontSize={'18px'} mr={2}>
                                    ${property.annual_revenue_ltm} <small>/yr</small>
                                    <ModalCloseButton />
                                </Text>

                                <Text mt={1} fontSize="sm" fontWeight="semibold">
                                    {property.bedrooms} Bedroom • {property.bathrooms} Bath • {property.accommodates} Guests
                                </Text>
                                <Text borderBottom={'1px solid'} borderColor={'gray.200'} py={3}>{property.name}
                                </Text>
                                <Flex mt={2} fontSize={'14px'} alignItems={'center'} justifyContent={'space-between'} >
                                    <Text>ADR</Text>
                                    <Text>${property.average_daily_rate_ltm}</Text>
                                </Flex>
                                <Flex my={3} fontSize={'14px'} alignItems={'center'} justifyContent={'space-between'} >
                                    <Text>Occupancy</Text>
                                    <Text>{property.average_occupancy_rate_ltm}%</Text>
                                </Flex>
                                <Flex fontSize={'14px'} alignItems={'center'} justifyContent={'space-between'} >
                                    <Text>Reviews</Text>
                                    <Text>{property.review_scores_rating}({property.
                                        visible_review_count})</Text>
                                </Flex>
                            </Box>


                        </Box>

                    </Flex>
                    <Box px={'25px'} py={'20px'}>

                        <Button mb={3} borderRadius={'40px'} bg={'black'} color={'white'} mt={4} size="sm">
                            Amenities
                        </Button>
                        {
                            Object.entries(property.amenities).map((amenity) => (
                                <Flex py={1} borderBottom={'1px solid'} borderColor={'gray.200'} color={'rgb(106, 109, 119)'} fontSize={'15px'} alignItems={'center'} justifyContent={'space-between'}>
                                    <Text textTransform={'capitalize'}>{amenity[0]}</Text>
                                    <Text> {amenity[1] === true ? 'Yes' : 'No'}</Text>
                                </Flex>
                            ))
                        }

                    </Box>
                </ModalBody>

                <ModalFooter boxShadow={'rgba(1, 1, 1, 0.05) 0px 0px 5px 2px'} justifyContent={'flex-start'}>
                    <Flex alignItems={'center'} onClick={() => window.open(`https://www.airbnb.com/rooms/${property.listing_id}`)}>
                        <Button borderRadius={0} size={'sm'} variant={'unstyled'} borderBottom={'1px solid '}>View on airbnb</Button><ChevronRight />

                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>

    );
};


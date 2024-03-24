import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import React, { FC } from 'react'
import { MapPin } from 'react-feather';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { BiTargetLock } from 'react-icons/bi';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GoLocation } from 'react-icons/go';

const MobileSearch: FC<any> = ({ address, location, addItem, counts, removeItem, setPropertyCoordinates, setIsSelectedFromDropdown, setDropdownLocationError, handleGetCurrentLocation, isOpen, handleCalculatePrediction, outsideRef }) => {
    let labelStyle = {
        fontSize: '14px',
        fontFamily: 'GTBold'
    }
    let { bedrooms, bathrooms, guests } = counts
    return (
      <Box w={"100%"}>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          w={"100%"}
          maxW={"650px"}
          borderRadius={"12px"}
          py={"11px"}
          px={"15px"}
          border={"1px solid  #e2e8f0"}
          boxShadow={"0px 1px 3px -2px rgba(158, 157, 164, 0.49)"}
        >
          <Flex pos={"relative"} flex={1}>
            <Flex flex={1} overflow={"hidden"} w={"100%"} alignItems={"center"}>
              <GoLocation />
              <Box ml={"10px"} w={"100%"}>
                <Text sx={labelStyle}>Where</Text>
                <Box>
                  <input
                    autoComplete="off"
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      fontFamily: "GTMedium",
                    }}
                    {...address}
                    onFocus={(e) => {
                      address.setShow(true);
                    }}
                    A1
                    onChange={(e) =>
                      address.onChange(e, () => {
                        setIsSelectedFromDropdown(false);
                      })
                    }
                    placeholder="Enter  Address"
                  />
                  {address.show && location !== "" && (
                    <Box
                      ref={outsideRef}
                      left={0}
                      top={"60px"}
                      zIndex={23232}
                      pos={"absolute"}
                      bg="white"
                      boxShadow={"rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;"}
                      borderRadius={"12px"}
                    >
                      {address.suggestions.map((suggestion, index) => {
                        return (
                          <Flex
                            key={`address-suggestion-${index}`}
                            px={"10px"}
                            _hover={{
                              bg: "#e5e5e5",
                            }}
                            align={"center"}
                            gap=".4rem"
                            fontFamily={"GTRegular"}
                            onClick={() => {
                              setPropertyCoordinates(
                                suggestion.geometry.coordinates
                              );
                              address.setShow(false);
                              address.setLocation(suggestion.place_name);
                              setIsSelectedFromDropdown(true);
                              setDropdownLocationError(false);
                            }}
                            cursor={"pointer"}
                          >
                            <Box>
                              <MapPin />
                            </Box>
                            <Text py=".4rem" key={index}>
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
            <Flex>
              {isOpen && <Spinner alignSelf={"center"} size={"sm"} mr={1} />}
              <Box
                onClick={handleGetCurrentLocation}
                cursor={"pointer"}
                alignSelf={"center"}
                bg={"rgb(255, 174, 242)"}
                borderRadius="8px"
                p={"7px"}
              >
                <BiTargetLock fontSize={"22px"} color={"rgb(247, 34, 219)"} />
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          px={"35px"}
          mt={3}
          justifyContent={"space-between"}
          alignItems={"center"}
          w={"100%"}
          maxW={"650px"}
          borderRadius={"12px"}
          py={"11px"}
          border={"1px solid  #e2e8f0"}
          boxShadow={"0px 1px 3px -2px rgba(158, 157, 164, 0.49)"}
        >
          <Flex flexDir={"column"} alignItems={"flex-start"} flex={1}>
            <Text sx={labelStyle}>Bedrooms</Text>
            <Flex alignItems={"center"} color={"rgb(158, 157, 164)"}>
              <AiOutlineMinus
                onClick={() => removeItem("Bedrooms")}
                cursor={"pointer"}
              />
              <Text mx={2} fontSize="14px">
                {bedrooms}
              </Text>
              <AiOutlinePlus
                onClick={() => addItem("Bedrooms")}
                cursor={"pointer"}
              />
            </Flex>
          </Flex>
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            flex={1}
            borderLeft="1px solid #e2e8f0"
          >
            <Text sx={labelStyle}>Bathrooms</Text>
            <Flex alignItems={"center"} color={"rgb(158, 157, 164)"}>
              <AiOutlineMinus
                onClick={() => removeItem("Bathrooms")}
                cursor={"pointer"}
              />
              <Text mx={2} fontSize="14px">
                {bathrooms}
              </Text>
              <AiOutlinePlus
                onClick={() => addItem("Bathrooms")}
                cursor={"pointer"}
              />
            </Flex>
          </Flex>
          <Flex
            alignItems={"flex-end"}
            flexDirection={"column"}
            flex={1}
            borderLeft="1px solid #e2e8f0"
          >
            <Text sx={labelStyle}>Guests</Text>
            <Flex alignItems={"center"} color={"rgb(158, 157, 164)"}>
              <AiOutlinePlus
                onClick={() => addItem("Guests")}
                cursor={"pointer"}
              />
              <Text mx={2} fontSize="14px">
                {guests}
              </Text>
              <AiOutlineMinus
                onClick={() => removeItem("Guests")}
                cursor={"pointer"}
              />
            </Flex>
          </Flex>
        </Flex>
        <Button
          onClick={handleCalculatePrediction}
          mt={6}
          w="100%"
          height={"36px"}
          fontSize={"15px"}
          bg={"rgb(247, 34, 219)"}
          color={"white"}
          fontFamily={"GTBold"}
        >
          Calculate
        </Button>
        <Flex justifyContent={"center"} mt={5} alignItems={"center"}>
          <Box
            bg={"rgb(252, 174, 241)"}
            color={"rgb(247, 34, 219)"}
            padding={"3px"}
            borderRadius={"100px"}
            display={"inline-block"}
          >
            <BsCurrencyDollar />
          </Box>
          <Flex alignItems={"center"} fontSize={"16px"}>
            <Text
              ml={2}
              mr={2}
              color={"rgb(247, 34, 219)"}
              fontFamily={"GTMedium"}
            >
              Free forever
            </Text>
            <Text fontFamily={"GTLight"}>unlimited searches</Text>
          </Flex>
        </Flex>
      </Box>
    );
}

export default MobileSearch;

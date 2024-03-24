// DesktopSearch.js
import React from 'react';
import { Flex, Text, Button, InputGroup, InputLeftElement, Input, Box, Spinner } from '@chakra-ui/react';
import { GoLocation } from 'react-icons/go';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { BsCurrencyDollar } from 'react-icons/bs';
import { BiTargetLock } from 'react-icons/bi';
import { MapPin } from 'react-feather';

const DesktopSearch = ({ ref, labelStyle, showLoading, address, handleCalculatePrediction, calculatePrediction, setPropertyCoordinates, handleGetCurrentLocation, addItem, isOpen, removeItem, bedrooms, bathrooms, outsideRef, setDropdownLocationError, setIsSelectedFromDropdown }) => {
    return (
        <>

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
                <Flex pos={"relative"}>
                    {/* @ts-ignore */}
                    <Flex
                        onClick={() => ref?.current?.focus()}
                        cursor="pointer"
                        overflow={"hidden"}
                        borderRight="1px solid #e2e8f0"
                        w={"200px"}
                        alignItems={"center"}
                    >
                        <GoLocation />
                        <Box ml={"10px"} w={"140px"}>
                            <Text sx={labelStyle}>Where</Text>
                            <Box>
                                <input
                                    ref={ref}
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
                                        boxShadow={
                                            "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;"
                                        }
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
                                                        address.setLocation(
                                                            suggestion.place_name
                                                        );
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
                    <Box flex={1} paddingRight="50px" paddingLeft={"20px"}>
                        <Text sx={labelStyle}>Bedrooms</Text>
                        <Flex
                            alignItems={"center"}
                            justifyContent={"center"}
                            color={"rgb(158, 157, 164)"}
                        >
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
                    </Box>
                    <Box
                        flex={1}
                        paddingLeft={"50px"}
                        borderLeft="1px solid #e2e8f0"
                    >
                        <Text sx={labelStyle}>Bathrooms</Text>
                        <Flex
                            alignItems={"center"}
                            justifyContent={"center"}
                            color={"rgb(158, 157, 164)"}
                        >
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
                    </Box>
                </Flex>

                <Button
                    isLoading={showLoading}
                    onClick={handleCalculatePrediction}
                    height={"36px"}
                    fontSize={"15px"}
                    bg={"rgb(247, 34, 219)"}
                    color={"white"}
                    fontFamily={"GTBold"}
                >
                    Calculate
                </Button>
            </Flex>
            <Flex
                w={"100%"}
                maxW={"650px"}
                alignItems={"center"}
                justifyContent={"space-between"}
                mt={"14px"}
            >
                <Flex alignItems={"center"}>
                    <Box
                        bg={"rgb(252, 174, 241)"}
                        color={"rgb(247, 34, 219)"}
                        padding={"3px"}
                        borderRadius={"100px"}
                        display={"inline-block"}
                    >
                        <BsCurrencyDollar />
                    </Box>
                    <Flex alignItems={"center"} fontSize={"18px"}>
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
                <Flex
                    color={"rgb(247, 34, 219)"}
                    alignItems={"center"}
                    fontFamily={"GTMedium"}
                >
                    {isOpen && <Spinner mr={1} />}
                    <BiTargetLock />
                    <Text
                        cursor={"pointer"}
                        ml={2}
                        onClick={() => handleGetCurrentLocation()}
                    >
                        Near me now
                    </Text>
                </Flex>
            </Flex>
        </>

    );
};

export default DesktopSearch;

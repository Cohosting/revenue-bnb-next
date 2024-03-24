import { Box, Flex, Image, Text, VStack } from '@chakra-ui/react'
import React from 'react'

export const CompareableItem = () => {
    return (
        <Flex borderRadius={'6px'} w={'max-content'} alignItems={'center'} bg={'white'} p={1}>
            <Image borderRadius={'6px'} w={'100px'} height={'100px'} src='https://cdn.pixabay.com/photo/2017/04/10/22/28/residence-2219972_1280.jpg' />
            <Box fontFamily={'GT Eesti Text Light'} ml={3} pr={3}>
                <VStack fontWeight={400} fontSize={'14px'} alignItems={'flex-start'}>
                    <Text><strong>$42,229</strong><small>/yr</small></Text>
                    <Text>3 Br • 2 Ba • 9 Guests</Text>
                    <Text>The Lazy S Retreat II</Text>
                    <Text>$149 ADR 76% Occup.</Text>
                </VStack>
            </Box>
        </Flex>
    )
}


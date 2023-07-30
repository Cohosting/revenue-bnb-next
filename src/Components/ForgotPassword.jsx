import { Box, Button, Flex, Input, Text, useMediaQuery } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';


import { FiKey } from 'react-icons/fi';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { MdDone } from 'react-icons/md';


import { sentPasswordResetEmail } from '../lib/auth';
import stateProvider from '../context/stateProvider';

const ForgotPassword = ({ shouldPadding = false }) => {
    const { progressHandler, setIsItFromHeader, setAuthStep, setIsLogging, setIsForgotPassword } = useContext(stateProvider)
    const [email, setEmail] = useState('');
    const [isSuccess, setIsSuccess] = useState(false)
    const [isLessThen767px] = useMediaQuery('(max-width: 767px)');

    const [isLoading, setIsLoading] = useState(false)

    const buttonStyles = {
        fontSize: '14px',
        fontWeight: 'bold',
        bg: '#000000',
        cursor: 'pointer',
        color: '#FFFF',
        borderRadius: '7px',
        _focus: {
            // background: '#FFFF',
        },
        _hover: {
            // background: '#FFFF',
        },
        _active: {
            // background: '#FFFF',
        },
    };
    const loginButtonStyles = {
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderRadius: '7px',
        _focus: {
            // background: '#FFFF',
        },
        _hover: {
            // background: '#FFFF',
        },
        _active: {
            // background: '#FFFF',
        },
    };

    const handlePasswordReset = async () => {
        setIsLoading(true);
        const isSent = await sentPasswordResetEmail(email);
        setIsLoading(false)

        if (isSent) {
            setIsSuccess(true)
        }

    }

    let buttonText = 'Reset Your password';

    if (isSuccess) {
        buttonText = <><MdDone style={{
            marginRight: '10px'
        }} /> Sent </>
    }
    return (
        <Flex pr={shouldPadding ? 7 : ''} pt={8} alignItems={'center'} justifyContent={'center'} flexDir={'column'}>
            {/* icon */}
            <Flex w={'60px'} height={'60px'} bg={'#23d3d380'} align={'center'} justifyContent={'center'} borderRadius={'100%'}>
                <FiKey />
            </Flex>
            <Text fontFamily={'GTBold'} fontSize={'22px'} my={3}>Forgot Password</Text>
            <Text fontFamily={'GTMedium'} color={'#717172'}>No worries, we will send you reset instructions</Text>

            <Box w={'100%'} marginTop={'10px'}>
                <Text fontFamily={'GTMedium'} textAlign={'left'}>Email</Text>
                <Input type={'email'} value={email} onChange={(e) => setEmail(e.currentTarget.value)} mt={2} fontFamily={'GTMedium'} placeholder='Enter your email' />
                <Button onClick={handlePasswordReset} isLoading={isLoading} sx={buttonStyles} mt={4} fontFamily={'GT Eesti Text Light'} w={'100%'}>{buttonText}</Button>
            </Box>

            <Box>
                <Button onClick={() => {
                    if (!isLessThen767px) {
                        progressHandler('register');
                        setIsItFromHeader(true);
                        setAuthStep('login')
                    } else {
                        setIsForgotPassword(false)
                        setIsLogging(true);
                        setAuthStep('login');
                    }
                }} sx={loginButtonStyles} variant={'ghost'} mt={'10px'} fontSize={'15px'}> <AiOutlineArrowLeft style={{
                    marginRight: '10px'
                }} /> Back to login</Button>
            </Box>
        </Flex>
    )
}


export default ForgotPassword;
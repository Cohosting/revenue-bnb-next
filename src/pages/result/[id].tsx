import { Box, Button, Flex, Progress, Text, useDisclosure } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import graph from '../../lotties/graph.json';
import Schedule from '../../Components/modals/schedule';
import LogoItem from '../../Components/UI/LogoItem';
import stateProvider from '../../context/stateProvider';
import { fetchData, getReportDetails, updateViewCountAndSendWebhook } from '../../lib/reports';
import Breakdown from '../../Components/Breakdown';
import Price from '../../Components/PropertyDetails/Price';
import { AiOutlineArrowLeft } from 'react-icons/ai'

import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';
import { useForm, } from "react-hook-form";
import { useRouter } from 'next/router';
import Head from 'next/head';
import { AuthContext } from '../../context/authContext';
import SavvyCal from '../../Components/savvyCall';
import UserForm from '../../auth/ViewedByAuth';
import { useLegacyEffect } from './../../hooks/useEffectLegacy';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const ResultContext = createContext(null);


const Result: FC<any> = ({ data }) => {
    let defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        "User ID": uuidv4()
    };
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true)
    const { control, formState: { errors }, handleSubmit, reset, watch, setValue, } = useForm({ defaultValues });

    let watchr = watch(['phone'])
    const router = useRouter();
    const { id } = router.query
    const { monthlyData, onClose } = useContext(stateProvider);
    const { currentUser } = useContext(AuthContext);
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [isNightlyGenarating, setIsNightlyGenarating] = useState(true);
    const [expense, setExpense] = useState({});
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState({
        isError: false,
        errorMessage: '',
    });
    const [cookies, setCookie, removeCookie] = useCookies(['hasSubmitForm']);
    const { isOpen, onOpen, onClose: onScheduleClose } = useDisclosure()


    const onError = msg => {
        setError({
            ...error,
            isError: true,
            errorMessage: msg,
        });
    };
    const { isError } = error;
    useLegacyEffect(() => {
        const token = localStorage.getItem('revenuebnb_token');
        if (!token) {
            /* @ts-ignore */
            const docRef = doc(db, "reports", id);
            getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                    setResults(docSnap.data())
                } else {
                    console.log("No such document!");
                }
                setLoading(false);

            }).catch((error) => {
                console.log("Error getting document:", error);
            }
            );
        }
        if (!id || !currentUser) return;
        fetchData(id)
            .then(fetchedData => {
                setLoading(false)
                setResults(fetchedData)
                /* @ts-ignore */
                if (fetchedData.isError) {
                    setError({
                        isError: true,
                        errorMessage: "Unknown error occured"
                    });
                    onOpen();
                }
            })
            .catch(err => {
                console.log({ err });

                setLoading(false)

                setError({
                    isError: true,
                    errorMessage: "Unknown error occured"
                });
                onOpen();
            });


        updateViewCountAndSendWebhook(id, currentUser.id, {
            requestSentBy: currentUser
        })
            .catch(err => console.error('Failed to update view count and send webhook:', err));
    }, [id, currentUser]);


    const updateNightly = data => {
        setResults({
            ...results,
            nightlyData: data,
        });
    };

    const updateFormattedNightlyData = data => {
        setResults({
            ...results,
            formattedNightlyData: data,
        });
    };

    const updateNightlyState = (nightlyData, formattedNightlyData) => {
        setResults({
            ...results,
            nightlyData,
            formattedNightlyData,
        });
    };

    // removing last active result

    useEffect(() => {
        onClose()

        const id = localStorage.getItem('lastId');

        if (id) {
            localStorage.removeItem('lastId');
        }
    }, []);

    useEffect(() => {
        if (progress < 90) {
            const value = Math.floor(1 + Math.random() * 30);
            setTimeout(() => {

                if (loading) {
                    setProgress(value + progress);
                }

            }, 800);
        }
    }, [progress]);


    let TEXT_COLOR = '#242E43'
    const txtStyles = {
        lineHeight: '1.1',
        letterSpacing: '-2px',
    };



    const getFormErrorMessage = (name) => {
        return errors[name] && <Text color={'#ff6565'} fontFamily={'GTMedium'} my={2} >{errors[name].message}</Text>
    };
    let formatPhoneNumber = (str) => {
        //Filter only numbers from the input
        let cleaned = ('' + str).replace(/\D/g, '');

        //Check if the input is of correct length
        let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        };

        return null
    };

    console.log({ is: (Object.keys(currentUser || {}).length === 0) && !cookies.hasSubmitForm })
    return (

        <ResultContext.Provider
            value={{
                ...results,
                updateNightly,
                updateFormattedNightlyData,
                expense,
                setExpense,
                updateNightlyState,
                isNightlyGenarating,
                setIsNightlyGenarating,
            }}
        >
            <Box>
                <Head>
                    <title> Revenuebnb - {data.location}</title>
                    <meta name="description" content={`Revenuebnb Vacation Rental revenue prediction for ${data.location}`} />
                    <meta property="og:title" content={`Revenuebnb - ${data.location}`} />
                    <meta property="og:description" content={`Revenuebnb Vacation Rental revenue prediction for ${data.location}`} />
                    <meta property="og:url" content="https://snipcart.com/" />
                    <meta property="og:type" content="website" />
                </Head>
            </Box>

            <SavvyCal />


            {loading ? (
                <Flex
                    height={'100vh'}
                    align={'center'}
                    flexDir={'column'}
                    justifyContent={'center'}
                >
                    <Lottie
                        style={{ height: '200px', width: '200px', marginInline: 'auto' }}
                        animationData={graph}
                        loop={true}
                    />
                    <Text mt={'-26px'} fontSize={'24px'} fontWeight={'bold'}>
                        Results are loading
                    </Text>
                    <Progress
                        sx={{
                            borderRadius: '5px',
                            bg: '#E5E5E5',
                            '& > div': {
                                bg: '#00EAA0',
                            },
                        }}
                        mt={'10px'}
                        w={'55%'}
                        value={progress}
                        height={'17px'}
                    />
                </Flex>
            ) : (Object.keys(currentUser || {}).length === 0) && !cookies.hasSubmitForm ? (

                    <>
                        <UserForm results={results} />



                        {/*
                <Flex justifyContent={'center'} flexDir={'column'} height={'100%'} w={'100%'}>
                    <Flex alignItems={'center'} justifyContent={'center'} height={'100%'} >
                        <Flex width={'60%'} justify={'center'} direction='column'>

                            <Text sx={{ ...txtStyles, fontFamily: 'GTMedium ', color: TEXT_COLOR, mt: !isLargerThan768 && '40px' }} textAlign={'center'} fontSize={['35px', '46px']}>                View Annual Revenue Estimate

                            </Text>
                            <Box >
                                <Text
                                    mt={'20px'}
                                    textAlign={'center'}
                                    fontSize={'24px'}
                                    letterSpacing={'.7px'}
                                    lineHeight='1.1'
                                    fontFamily={'GTMedium'}
                                >
                                    {results.location}
                                </Text>
                                <Text mb={5} textAlign={'center'} fontFamily={'GTMedium'}>
                                    {results.bedrooms} bedrooms · {results.bathrooms} baths
                                </Text>
                            </Box>

                            <form onSubmit={handleSubmit(handleClickCookie)} >
                                <Flex
                                    direction={isLargerThan768 ? 'row' : 'column'}
                                    gap={!isLargerThan768 ? '0rem' : '.6rem'}
                                >
                                    <Box flex={1}>
                                        <Controller name="firstName" control={control}
                                            rules={{ required: 'First name is required.', }}
                                            render={({ field, fieldState }) => (
                                                <CustomInput
                                                    handleChange={handleChange}
                                                    icon={<BiUserCircle color='rgb(247, 34, 219)' />}
                                                    // @ts-ignore

                                                    placeholder='First Name'
                                                    name='firstName'
                                                    id={field.name} {...field}
                                                />
                                            )} />
                                        {getFormErrorMessage('firstName')}

                                    </Box>


                                    <Box flex={1} sx={{
                                        mt: !isLargerThan768 ? '20px' : '0px',
                                        w: '100%'
                                    }}>

                                        <Controller name="lastName" control={control}
                                            rules={{ required: 'Last name is required.', }}
                                            render={({ field, fieldState }) => (
                                                <CustomInput
                                                    handleChange={handleChange}

                                                    icon={<BiUserCircle color='rgb(247, 34, 219)' />}
                                                    // @ts-ignore

                                                    placeholder='Last Name'
                                                    name='lastName'
                                                    id={field.name} {...field}
                                                />
                                            )} />
                                        {getFormErrorMessage('lastName')}


                                    </Box>
                                </Flex>
                                <Box my={3} mt={2}>
                                    <Controller name="email" control={control}
                                        rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' } }}
                                        render={({ field, fieldState }) => (
                                            <CustomInput


                                                handleChange={handleChange}

                                                icon={<BiUserCircle color='rgb(247, 34, 219)' />}
                                                // @ts-ignore

                                                placeholder='Email'
                                                name='email'
                                                id={field.name} {...field}
                                            />
                                        )} />
                                    {getFormErrorMessage('email')}

                                </Box>


                                <Flex sx={{
                                    fontFamily: 'GTMedium',
                                    borderRadius: '24px',
                                    border: '2px solid #E2E8F0',
                                    height: '3.125rem',
                                    color: 'rgb(80,80,81)',
                                    transition: 'all 250ms ease 0s',
                                    _placeholder: {
                                        color: 'rgb(80,80,81)',
                                    },
                                    _hover: { border: '2px solid rgb(163, 223, 230)' },
                                    _focus: {},
                                    _active: {},
                                }} alignItems={'center'}>

                                    <Box p={3}>
                                        <Flex>
                                            <Image borderRadius={'100%'} w={'25px'} height={'25px'} src='https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/800px-Flag_of_the_United_States.svg.png?20151118161041' />
                                            <Text ml={2}>+1</Text>
                                        </Flex>
                                    </Box>
                                    <Input onChange={(e) => {


                                        setValue('phone', e.target.value)
                                        setIsPhoneNumberValid(true)
                                    }} type={'text'} name="phone" value={formatPhoneNumber(watchr[0])} outline={'none'} border={'none'} _focus={{
                                        border: 'none',
                                        outline: 'none'
                                    }}

                                    />


                                </Flex>

                                {
                                    !isPhoneNumberValid ? (

                                        <Text color={'#ff6565'} fontFamily={'GTMedium'} my={2} >Please input a valid number</Text>
                                    ) : ''
                                }


                                <Button w={'100%'} type='submit' fontFamily={'GTMedium'} isLoading={isCookiesLoading} mt={4} fontWeight={'400'} bg={'rgb(247, 34, 219)'} color={'white'}  >
                                    View result
                                </Button>
                            </form>


                        </Flex>
                    </Flex>
                        </Flex>    */}   </>
            ) : !isError ? (
                        <Box bg={'#F6F6F6'} maxW={'1000px'} margin={'0 auto'} >
                    <LogoItem />

                            <Box maxW={'1000px'} w={'98%'} margin={'0 auto'} >
                                <Button onClick={() => router.push('/')} ml={4} variant={'ghost'}>
                                    <AiOutlineArrowLeft /> <Text ml={2}>Back to Search</Text>
                                </Button>
                            </Box>

                    <Price
                                average={results.last_12_months_summary.quartiles['50th_percentile']}
                                professional={results.last_12_months_summary.quartiles['90th_percentile']}
                    />
                    <Breakdown
                        monthlyData={
                                    results.monthly_summary
                        }
                    />
                    <Box marginTop={'40px'} paddingBottom={'20px'} fontSize={'15px'} color={'#6B6B6B'} fontWeight={500} fontFamily={'GT Eesti Text Light'}>
                        <Text textAlign={'center'} lineHeight={1.2}>Copywrite &copy;{new Date().getFullYear()}</Text>
                        <Flex align={'center'} justifyContent={'center'}>
                            <Text>Terms of use</Text>
                            &nbsp;
                            &
                            &nbsp;

                            <Text>Privacy Policy</Text>
                        </Flex>
                    </Box>


                </Box>
            ) : (
                <Schedule isOpen={isOpen} onOpen={onOpen} onClose={onScheduleClose} />
            )}
        </ResultContext.Provider>
    );
};

export async function getServerSideProps(context: any) {
    try {
        const data: any = await getReportDetails(context.query.id);

        if (!data) {
            console.log('undefined  data')
            return {
                props: {}, // will be passed to the page component as props
            }
        } else {
            return {
                props: { data }, // will be passed to the page component as props
            }
        }

    } catch (err) {
        console.log(err)
        return {
            props: {}, // will be passed to the page component as props
        }
    }


}

export default Result;

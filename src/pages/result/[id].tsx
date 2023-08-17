import dynamic from 'next/dynamic';
import { Box, Button, Flex, Progress, Text, useDisclosure } from '@chakra-ui/react';
import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import graph from '../../lotties/graph.json';
import LogoItem from '../../Components/UI/LogoItem';
import stateProvider from '../../context/stateProvider';
import { fetchData, getReportDetails, updateViewCountAndSendWebhook } from '../../lib/reports';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import Head from 'next/head';
import { AuthContext } from '../../context/authContext';
import { useLegacyEffect } from './../../hooks/useEffectLegacy';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Dynamically importing the components
const Lottie = dynamic(() => import('lottie-react'));
const Schedule = dynamic(() => import('../../Components/modals/schedule'));
const Breakdown = dynamic(() => import('../../Components/Breakdown'));
const Price = dynamic(() => import('../../Components/PropertyDetails/Price'));
const SavvyCal = dynamic(() => import('../../Components/savvyCall'));
const UserForm = dynamic(() => import('../../auth/ViewedByAuth'));
export const ResultContext = createContext(null);


const Result: FC<any> = ({ data }) => {
    let defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        "User ID": uuidv4()
    };
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
        console.log('legacy effect run with id', id, currentUser)
        if (!id || !currentUser) {
            console.log('no id or user')
            return;
        };

        console.log('Data is about to get fetched')
        fetchData(id)
            .then(fetchedData => {
                console.log(`Data fetched`, fetchedData)
                setResults(fetchedData)
                /* @ts-ignore */
                if (fetchedData.isError) {
                    console.log('Error happend')
                    setError({
                        isError: true,
                        errorMessage: "Unknown error occured"
                    });
                    onOpen();
                }
            })
            .catch(err => {
                console.log({ err });


                setError({
                    isError: true,
                    errorMessage: "Unknown error occured"
                });
                onOpen();
            })
            .finally(() => {
                setLoading(false)
            });



        updateViewCountAndSendWebhook(id, currentUser.id, {
            requestSentBy: currentUser,


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
                        <UserForm results={data} />


                    </>
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
    context.res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )
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

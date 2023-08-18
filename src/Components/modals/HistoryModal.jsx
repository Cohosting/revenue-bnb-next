import { Box, Button, Divider,  Flex, Image, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, Text } from '@chakra-ui/react';
import { collection, getDocs,  getFirestore,  query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import stateProvider from '../../context/stateProvider';
import { BsSearch } from 'react-icons/bs'

import Close from './../../Images/svgfile/closeButton.svg';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/authContext';


const getFilteredHistory = (history, searchText) => {
    let filteredHistory;
    filteredHistory = history.filter((el) => el.location.toLowerCase().includes(searchText.toLowerCase()))
    filteredHistory = filteredHistory.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.location === value.location
        ))
    )
    return filteredHistory
}

const HistoryModal = ({ isOpen, onClose }) => {
    const [searchText, setSearchText] = useState('')
    const navigate = useRouter();
    const {  history, setHistory } = useContext(stateProvider);
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        if (!currentUser) return;

        (async () => {
            const db = getFirestore();
            let collectionRef = collection(db, 'reports');
            const reportQuery = query(
                collectionRef,
                where('createdBy', '==', currentUser.id),
            );
            const snapshot = await getDocs(reportQuery);
            let data = [];
            snapshot.forEach(el => data.push(el.data()));
            data = data.sort((a, b) => a.location.localeCompare(b.location))
            setHistory(data);
        })();
    }, [currentUser]);

    return (
        <Modal
            onClose={onClose}
            isOpen={isOpen}
            isCentered
            motionPreset="slideInBottom"
        >
            <ModalOverlay />
            <ModalContent height={'max-content'} maxHeight={'80vh'} mx="2rem" borderRadius={'24px'}>
                <Button
                    sx={{
                        p: '1.5rem',
                        marginInline: '.1rem auto ',
                        my: '.5rem',
                        borderRadius: '50px',
                        background: '#FFFFFF',

                        _focus: {
                            boxShadow: '0',
                        },
                        _hover: {
                            background: '#FFF',
                        },
                        _active: {},
                    }}
                    onClick={onClose}
                >
                    <Image src={Close.src} alt="close button" />
                </Button>

                <Flex px="1.5rem" mb="1.5rem" direction={'column'} gap=".5rem">
                    <Box color={'black'} fontWeight={'bold'} fontSize={'18px'}>
                        {currentUser && currentUser.firstName && currentUser.firstName}{' '}
                        {currentUser && currentUser.lastName && currentUser.lastName}
                    </Box>
                    <Text fontSize={'14px'} fontWeight="medium" color={'#6B6B6B'}>
                        {currentUser && currentUser.email && currentUser.email}
                    </Text>
                </Flex>
                <Divider />
                <Box px={'21px'} mt={'15px'} >
                    <Text mb='4px' ml={1} fontFamily={'GTMedium'}
                    >Search</Text>
                    <InputGroup >
                        <InputLeftElement
                            pointerEvents='none'
                            children={<BsSearch />}
                        />

                        <Input
                            py={'20px'}
                            borderRadius={'16px'}
                            value={searchText}

                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder='Here is a sample placeholder'
                            size='sm'
                        />
                    </InputGroup>

                </Box>
                <ModalBody px={'0'} mt="1.5rem" overflowY={'auto'}>
                    <Text
                        px="1.5rem"
                        color={'#009dae'}
                        fontSize={'16px'}
                        fontWeight={'bold'}
                    >
                        History
                    </Text>
                    {currentUser ? (
                        getFilteredHistory(history, searchText).map((el, idx) => (
                            <Flex
                                key={Math.random()}
                                mt="1.5rem"
                                px="1.5rem"
                                gap=".5rem"
                                align={'center'}
                                cursor={'pointer'}
                                onClick={() => {
                                    navigate.push(`/result/${el.id}`);
/*                                     window.location.reload()
 */                                }}
                            >
                                <Button
                                    sx={{
                                        background: 'rgba(229, 229, 229, 0.6)',
                                        borderRadius: '50px',
                                        height: '1.8rem',
                                        minWidth: '1.8rem',
                                        px: '0',
                                        color: 'blacš',
                                        fontSize: '14px',
                                        fontWeight: 'medium',
                                    }}
                                >
                                    {idx + 1}
                                </Button>
                                <Text
                                    color={'#212529'}
                                    fontSize={'14px'}
                                    fontFamily={'GTMedium'}
                                >
                                    {el.location}
                                </Text>
                            </Flex>
                        ))
                    ) : (
                        <Text color={'gray'} ml={6} mt={'3px'}>
                            {' '}
                            Verify Your account to Unlocked all feature
                        </Text>
                    )}
                </ModalBody>
                <Divider mt="1rem" />
                <ModalFooter justifyContent={'center'} p={'1.5rem'}>
                    <Button
                        sx={{
                            background: 'black',
                            color: '#FFF',
                            borderRadius: '8px',

                            _focus: {
                                boxShadow: '0',
                            },
                            _hover: {
                                background: 'gray',
                            },
                            _active: {},
                        }}
                        onClick={async () => {

                            window.localStorage.removeItem("revenuebnb_token");
                           window.location.href = "/"
                        }}
                    >
                        Sign out
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


export default HistoryModal;
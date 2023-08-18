import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';

import jwt from 'jsonwebtoken';
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';

const TOKEN_KEY = 'revenuebnb_token';
const Token: FC<any> = () => {
    const [error, setError] = React.useState("");
    const router = useRouter();
    const { token }: any = router.query
    // Need to verify token and save it cookies

    // Also need to top level compoent for checking validation expire and if not expire fetch user and if expire ask for email to sent token
    useEffect(() => {
        if (!token) return

        (async () => {
            try {
                const decodedToken: any = jwt.decode(token);
                const db = getFirestore();
                const userRef = collection(db, "users");
                const q = query(userRef, where("token", "==", token));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError('Invalid token or token is expired')
                    return;
                }
                const user = querySnapshot.docs[0].data();


                // Check if the token has an expiration time
                if (decodedToken && decodedToken.exp) {
                    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                    if (decodedToken.exp < currentTime) {
                        // Token has expired
                        console.log('Token has expired.');
                        setError("Token has expired");
                        localStorage.removeItem(TOKEN_KEY);

                    } else {
                        // Token is valid, proceed with your desired logic
                        const obj = user.isNewUser && {
                            emailVerified: true,
                            isNewUser: null
                        }
                        // Store the token and its expiration time in localStorage
                        const uRef = doc(db, "users", querySnapshot.docs[0].id);
                        await updateDoc(uRef, {
                            token: null,
                            ...obj
                        });

                        localStorage.setItem(TOKEN_KEY, token);
                        console.log('Token stored in localStorage.');
                        setError("Token verified Successfully");
                        router.push(window.location.origin + "/" + "result/" + decodedToken.reportId, undefined, { shallow: true });

                    }
                } else {
                    // Token doesn't have an expiration claim
                    console.log('Token does not have an expiration claim.');
                    setError("Token does not have an expiration claim.");
                }
            } catch (error) {
                // Token verification failed or decoding error
                console.error('Token verification failed or decoding error.', error);
            }
        })();


    }, [token]);


    return (
        <Box>
            {
                !error ? (
                    /*  @ts-ignore  */
                    <Flex alignItems={'center'} justifyContent={'center'} p={'25px'}>
                        <Text>Token is getting verified..</Text>
                        <Spinner />
                    </Flex>
                ) : (
                    <Flex alignItems={'center'} justifyContent={'center'} p={'25px'}>
                        <Text>{error}</Text>

                    </Flex>
                )
            }
        </Box >
    )
}
export default Token
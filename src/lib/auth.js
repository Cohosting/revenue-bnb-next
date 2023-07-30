import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";

export const createUserToDB = async (uid, userObject) => {
    const docRef = await getDoc(doc(db, 'users', uid))
    if (!docRef.exists) {
        await setDoc(doc, {
            ...userObject
        })
    } else {
        console.log('user already Exist in the database')
    }
};

const auth = getAuth();

const provider = new GoogleAuthProvider();

export const googleSignIn = async (cb) => {
    await signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;


            cb(user)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });

}

export const currentUserUpdateProfile = async (userAuth, additionalData,) => {
    if (!userAuth) return;


    const userCopyData = { ...additionalData }
    const userRef = doc(db, 'users', userAuth.uid)
    const sanpshot = await getDoc(userRef)

    if (!sanpshot.exists()) {
        const { email } = userAuth;
        const createdAt = new Date();

        await setDoc(userRef, {
            id: userRef.id,
            email,
            createdAt,
            ...userCopyData
        })

    }


    return userRef;

}


export const createUserData = async (user, values) => {
    const userRef = doc(db, 'users', user.uid);
    const sanpshot = await getDoc(userRef);
    let random4Number = Math.floor(1000 + Math.random() * 9000);
    let firstName = values.firstName || user.displayName.split(' ')[0]
    let lastName = values.firstName || user.displayName.split(' ')[1]
    if (!sanpshot.exists()) {
        const createdAt = new Date();
        const user = { ...values };
        delete user.password;
        await setDoc(userRef, {
            id: userRef.id,
            createdAt,
            ...user,
            firstName,
            lastName,
            confirmationCode: random4Number,
        });
    }

    return userRef

}

export const sentPasswordResetEmail = async (email) => {
    const auth = getAuth();

    try {

        await sendPasswordResetEmail(auth, email);
        return true

    }
    catch (err) {
        console.log(err)
    }

}
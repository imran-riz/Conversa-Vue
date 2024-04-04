import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";


/**
 * Returns the current authenticated user
 */
const getCurrentUserAuth = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                resolve(user);
                removeListener();
            },
            reject
        );
    });
}


const signIn = async (email, password) => {
    try {
        return await signInWithEmailAndPassword(getAuth(), email.trim(), password);
    }
    catch (error) {
        console.error(`firebase_auth.js signIn() -> Error during user sign in. Error:`);
        console.error(`${error}`);

        throw error;
    }
}


/**
 * Used to sign the user out of the Firebase app
 */
const signOutUser = async () => {
    try {
        const promise = await signOut(getAuth());

        if (promise) return true;
    } catch (error) {
        console.error(`chatapp_firebase.js signOutUser() -> Failed to sign the user out. Error:`);
        console.error(error);
    }

    return false;
}


const addNewUserAuth = async (email, password) => {
    try {
        return await createUserWithEmailAndPassword(getAuth(), email.trim(), password);

    } catch (error) {
        console.error(``);
        throw error;
    }
}



export {
    getCurrentUserAuth,
    signIn,
    signOutUser,
    addNewUserAuth,
};
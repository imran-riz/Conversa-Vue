import { getApp } from "./firebase.js";
import { addDoc, collection, getDocs, getFirestore, and, or, orderBy, query, where, onSnapshot, deleteDoc } from "firebase/firestore";
import { ref } from "vue";


const db = getFirestore(getApp());
const messages = ref([]);
let unsubscribe = null;


const addNewUser = async (email, firstName, lastName, username, birthdate) => {
   console.log(`chatapp_firebase.js addNewUser() -> adding a new user to the database...`);

   const userDoc = {
      first_name: firstName,
      last_name: lastName,
      username: username,
      birthdate: birthdate,
      email: email,
   };

   try {
      const docRef = await addDoc(collection(db, "users"), userDoc);

      console.log(`chatapp_firebase.js addNewUser() -> user doc added. Doc reference returned.`);

      return docRef;
   } catch (error) {
      throw error;
   }
}


const getUserDetailsWithEmail = async (targetEmail) => {
   console.log(`chatapp_firebase.js getUserDetailsWithEmail() -> retrieving details of user with email: ${targetEmail}`);

   const searchQuery = query(collection(db, "users"), where("email", "==", targetEmail.trim()));
   const querySnap = await getDocs(searchQuery);

   if (querySnap.empty) {
      console.log(`chatapp_firebase.js getUserDetailsWithEmail() -> user does not exist`);
      return;
   }

   console.log(`chatapp_firebase.js getUserDetailsWithEmail() -> user found. Data returned.`);

   const userData = querySnap.docs[0].data();
   userData.id = querySnap.docs[0].id;
   userData.users_contacted = await getContactedUsers(userData.id);

   console.log("User data:");
   console.log(userData);

   return userData;
}


const getContactedUsers = async (userId) => {
   const contactedUsers = [];
   const messagesCollection = collection(db, "users", userId, "users_contacted");
   const querySnap = await getDocs(messagesCollection);

   querySnap.forEach((userDoc) => {
      contactedUsers.push(
         {
            ...userDoc.data()
         }
      );
   });


   return contactedUsers;
}


const addNewMessage = async (senderId, recipientId, textMessage, sentOn) => {
   console.log(`firebase_firestore.js addNewMessage() -> adding a new message to the database...`);

   const messageDoc = {
      sender_id: senderId,
      recipient_id: recipientId,
      text_message: textMessage,
      sent_on: sentOn,
   }

   try {
      const refDoc = await addDoc(collection(db, "messages"), messageDoc);
      console.log(`firebase_firestore.hs addNewMessage() -> message doc added to db!`);
      
   } catch (error) {
      throw error;
   }
}


const addUserToUsersContacted = async (senderId, recipientId, recipientUsername, recipientEmail) => {
   try {
      const refDoc = await addDoc(collection(db, `users/${senderId}/users_contacted`), {
         id: recipientId,
         username: recipientUsername,
         email: recipientEmail,
      });
      console.log("new contacted user added");
   } catch (error) {
      throw error;
   }
}


/**
 * Used to add a message listener to get real time updates of messages between 2 users
 * @param senderId
 * @param recipientId
 */
const registerMessageListener = (senderId, recipientId) => {
   if (unsubscribe) unsubscribe();

   const messagesCollection = collection(db, "messages");
   const q = query(
      messagesCollection,
      or(
         and(
            where("sender_id", "==", senderId),
            where("recipient_id", "==", recipientId)
         ),
         and(
            where("sender_id", "==", recipientId),
            where("recipient_id", "==", senderId)
         )
      ),
      orderBy("sent_on", "asc")
   );

   unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
         if (change.type === "added") {
            messages.value.push(
               {
                  id: change.doc.id,
                  ...change.doc.data()
               }
            );
         }
      });
   });
}


const deleteAllMessages = async () => {
   const messagesCollection = collection(db, "messages");
   const querySnap = await getDocs(messagesCollection);

   querySnap.forEach(async (doc) => {
      await deleteDoc(doc.ref);
   });

}


export {
   addNewUser,
   getUserDetailsWithEmail,
   addNewMessage,
   addUserToUsersContacted,
   registerMessageListener,
   deleteAllMessages,
   messages,
};
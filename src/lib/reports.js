import { collection, doc, getDoc, runTransaction, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { anualReportAndMonthlyBreakdown } from "./rapidApi";


export const setBaseResultDoc = async (propertyData) => {
    const ref = doc(collection(db, 'reports'));


    await setDoc(ref, {
        id: ref.id,
        anualAndMonthlyData: {},
        nightlyData: [],
        ...propertyData
    })

    return ref.id



}

export const createReports = async (propertyData) => {
    const { bedrooms, bathrooms, guests, coordinates } = propertyData
    const ref = doc(collection(db, 'reports'));

    // fetch monthly breakdown
    const anualAndMonthlyData = await anualReportAndMonthlyBreakdown(bedrooms, Math.floor(bathrooms), guests, coordinates)
    await setDoc(ref, {
        id: ref.id,
        anualAndMonthlyData: JSON.stringify(anualAndMonthlyData),
        nightlyData: [],
        bedrooms, bathrooms, coordinates
    })

    return {
        id: ref.id,
        anualAndMonthlyData,
        nightlyData: [],
        bedrooms, bathrooms, coordinates
    }

}


export const getReportDetails = async (id) => {


    const ref = doc(db, 'reports', id);
    const snapshot = await getDoc(ref);


    return snapshot.data()
}

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const formateNightlyData = (nightlyArray) => {

    let nightlyObject = {}

    nightlyArray.forEach((el) => {
        const month = el.date.split('-')[1];

        nightlyObject[months[month - 1]] = nightlyObject[months[month - 1]] || []
        nightlyObject[months[month - 1]].push(el)


    })

    return nightlyObject

}

export const updateInvestmentData = async (expense, id, investmentData) => {
    const ref = doc(db, 'reports', id);
    const { capRate, investmentScore } = investmentData;
    await updateDoc(ref, {
        purchasedPrice: expense.purchasedPrice,
        capRate,
        investmentScore,
        totalExpense: expense.expense
    })

};



export const fetchData = async (id) => {
  const docRef = doc(db, "reports", id);
  const docSnap = await getDoc(docRef);

  // Check if annualAndMonthlyData exists in Firestore and is not empty
  // Also check if isError is true in Firestore
  if (docSnap.exists() && (docSnap.data().isError || docSnap.data().isRequested)) {
    console.log("No need to fetch data from API")
    return docSnap.data();
  } else {
    console.log("Fetching data from API")
    try {
      const {bedrooms, bathrooms,coordinates} = docSnap.data();
      const response = await anualReportAndMonthlyBreakdown(bedrooms, bathrooms, coordinates);
      const data = response.message;

 
      await setDoc(docRef, { 
        ...docSnap.data(), 
        ...data,
   
        isRequested: true


    }, { merge: true });

      return {
        ...docSnap.data(), 
        ...data
      };
    } catch (error) {
      console.error('API request failed:', error);

      // If the document exists, we update the isError field
      await setDoc(docRef, { ...docSnap.data(), isError: true, isRequested: true }, { merge: true });

      throw error;
    }
  }
};


export const sendWebhookRequest = async (commonBody) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_MAKE_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commonBody),
    });

    if (!response.ok) {
      throw new Error('Webhook request failed');
    }

    // If the response needs to be read, use the following line
    // const responseData = await response.json();
    // return responseData;

  } catch (error) {
    console.error('Error sending webhook request:', error);
    throw error;
  }
};


export const updateViewCountAndSendWebhook = async (id, userId, commonBody) => {
  const docRef = doc(db, "reports", id);
  let updatedData = null; // Declare updatedData outside the transaction

  try {
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);

      if (!docSnap.exists()) {
        throw new Error('Document does not exist');
      }

      const data = docSnap.data();

      let viewedUsers = data.viewedUsers || [];
      const userIndex = viewedUsers.findIndex(user => user.userId === userId);

      if (userIndex === -1) {
        // If user has not viewed before, add a new entry
        viewedUsers.push({ userId, totalViewed: 1 });
      } else {
        // If user has viewed before, increment their count
        viewedUsers[userIndex].totalViewed += 1;
      }

      // Increment view count and add/update user view count
      updatedData = {
        ...data,
        viewCount: (data.viewCount || 0) + 1,
        viewedUsers,
      };

      // Now that we've done all our reads, we can update
      transaction.update(docRef, updatedData);
    });

    // Now that our transaction is complete, we can send the webhook
    // Include the updatedData (with the incremented viewCount and user view counts) in the webhook request
    try {
      await sendWebhookRequest({ ...commonBody, result: {
        ...updatedData,
        
      } });
    } catch (error) {
      console.error('Error sending webhook request:', error);
      throw error;
    }

  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};



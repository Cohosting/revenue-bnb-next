import axios from "axios";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';


  
      export const anualReportAndMonthlyBreakdown = async (bedrooms, bathrooms,  coordinates,) => {
        if(!coordinates[0] ||  !coordinates[1]){
          console.error("Coordinates were undefined! had to return");
          throw new Error('Coordinates were undefined');
        }
      
        try {
          const options = {
            method: "GET",
            url: "https://7sdr27znoa.execute-api.us-east-2.amazonaws.com/v2/getIncomeHistory",
            params: {
              coordinate: `(${coordinates[1]}, ${coordinates[0]})`,
              bedrooms: Math.floor(bedrooms),
              bathrooms: Math.floor(bathrooms),
              no_of_sample: 25,
              apiResponseType: "estimator_with_comps",
              returnQuartiles: "true",
            },
            headers: {
              "x-api-key": "jn719ivtlxoi9CnmHMX27gkCtg9qM2ejTw1MHYTQ",
              Authorization:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InN1YmhheWFuK2NvaG9zdGluQGFpcmJ0aWNzLmNvbSJ9.thRTb4PqjmHaV_0GcK8rfV-6RU7JZVbxdtfqyqDjodg",
            },
          };


      
          const response = await axios.request(options);
          console.log({response});
          console.log(response.data.message.error_reason)
          if (response.data.message.error_reason) {
            console.error('API returned an error:',  response.data.message.error_reason);
            throw new Error('API returned an error');
          }
          
      
          return response.data;
        } catch (error) {
          console.error('API request failed:', error);
          throw error;
        }
    };
export const getNightlyData = async (bedrooms, coordinates, id) => {
    const options = {
        method: 'GET',
        url: 'https://airbnb-market-maker.p.rapidapi.com/getBookingChanges',
        params: { coordinate: `(${coordinates[1]}, ${coordinates[0]})`, countryCode: 'US', bedrooms: Math.floor(bedrooms) },
        headers: {
            'X-RapidAPI-Host': 'airbnb-market-maker.p.rapidapi.com',
            'X-RapidAPI-Key': '2296d55f65mshf88a20cd74a3c69p17aa1ejsnae76cc48da6b'
        }
    };
    try {
        const response = await axios.request(options);

        const ref = doc(db, 'reports', id);

        updateDoc(ref, {
            nightlyData: response.data.message
        }) 

        return response.data.message
    } catch (err) {
        console.log(err)
    }


}

 

export const getCachedOrLiveAnualData = async (id, additionalObject) => {
    const docSnap = await getDoc(db, 'results', id);

    if (docSnap.exists()) {
        return await docSnap.data()
    } else {
        const { bedrooms, bathrooms, guests, coordinates } = additionalObject
        const data = await anualReportAndMonthlyBreakdown(bedrooms, bathrooms, guests, coordinates);
        return data
    }

}

export async function generateCode() {
    const apiKey = "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";
    const prompt = "Create a small component with HTML, CSS, and JavaScript that displays a button. When clicked, it changes the text to 'Clicked!'.";
    const maxTokens = 100;
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify({ prompt, max_tokens: maxTokens, model: 'gpt-4' })
    });
  
    const data = await response.json();
    console.log(data)
    return data.choices[0].text.trim();
  }
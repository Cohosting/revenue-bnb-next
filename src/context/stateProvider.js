import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { createContext, useEffect, useReducer, useState } from 'react';
import { getAirtableSync, syncAirtable } from '../lib/airtable';
import { db } from '../lib/firebase';
import { anualReportAndMonthlyBreakdown } from '../lib/rapidApi';
import './../lib/firebase';
import { getLatLngFromString } from './../lib/mapbox';
const stateProvider = createContext({
  isClicked: false,
  selectedName: '',
  selectedProperty: '',
  isBuyer: false,
  progress: '',
  clickHandler: () => { },
  pageChange: () => { },
  pageBack: () => { },
  progressHandler: () => { },
});

const defaultValue = {
  selectedValue: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'selection':
      return {
        selectedValue: state.selectedValue.push(action.payload),
        ...state,
      };
    case 'deletion':
      const index = state.selectedValue.indexOf(action.payload);

      return {
        selectedValue: state.selectedValue.splice(index, 1),
        ...state,
      };

    default:
      return { ...state };
  }
};

export const StateContext = ({ children }) => {
  const [onClick, setOnClick] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [location, setLocation] = useState('');
  const [propertyCoordinates, setPropertyCoordinates] = useState('');
  const [value, setValue] = useState(1);
  const [authStep, setAuthStep] = useState('register');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [progress, setProgress] = useState('property');
  const [history, setHistory] = useState([]);
  const [isItFromHeader, setIsItFromHeader] = useState(false);
  const [monthlyData, setMonthlyData] = useState({
    data: [],
    isLoaded: false,
    isTopLevelFetching: false,
  });

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });
  const [counts, setCounts] = useState({
    bedrooms: 3,
    bathrooms: 2,
    guests: 4,
  });

  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isBuyer, setIsBuyer] = useState(false);
  const [isSelectedFromDropdown, setIsSelectedFromDropdown] = useState(false);
  const [isFirebaseGoogleAuth, setIsFirebaseGoogleAuth] = useState(false)

  const [selectedName, setSelectedName] = useState('Monthly');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [step, setStep] = useState(1);
  const [currentUser, setCurrentUser] = useState();
  const [isUserAvailable, setIsUserAvailable] = useState({
    isKnown: false,
    isUserAvailable: false,
  });
  const [dropdownLocationError, setDropdownLocationError] = useState(false);
  const [state, dispatch] = useReducer(reducer, defaultValue);

  const clickHandler = (text) => {
    setSelectedName(text);
  };
  const propertyName = (text) => {
    setSelectedProperty(text);
  };
  const pageChange = () => {
    if (step) {
      setStep(step + 1);
    }
    if (step === 2) {
      setStep(step);
    }
    setOnClick(true);
  };

  const pageBack = () => {
    if (step) {
      setStep(step - 1);
    }
    if (step === 1) {
      setStep(step);
    }
    setOnClick(!onClick);
  };

  const progressHandler = (progress) => {
    setProgress(progress);
  };
  const getPropertyCoordinates = async (text) => {
    const coordinates = await getLatLngFromString(text);
    setPropertyCoordinates(coordinates);
  };

  const getMonthlyBreakdown = async (
    bedrooms,
    bathrooms,
    guests,
    coordinates,
    currentUser, params
  ) => {
    setMonthlyData({
      ...monthlyData,
      isTopLevelFetching: true,
    });

    try {
      const data = await anualReportAndMonthlyBreakdown(bedrooms, bathrooms, guests, coordinates);
      syncAirtable({
        ...currentUser,
        phone: currentUser.phone ? currentUser.phone : ''
      }, {
        ...data,
        searchUrl: window.location.origin + `/result/${params.id}`
      }, location)

      setMonthlyData({
        isTopLevelFetching: true,
        data: data,
        isLoaded: true,
      });






      return data
    } catch (err) {
      console.log({ err })
    }


  };


  const contextValue = {
    onClick,
    selectedName,
    state,
    step,
    isAuthenticated,
    isBuyer,
    value,
    selectedProperty,
    setIsBuyer,
    isConfirming,
    authStep,
    setAuthStep,
    setIsConfirming,
    isLogging,
    setIsLogging,
    propertyName,
    dispatch,
    clickHandler,
    setValue,
    progress,
    progressHandler,
    month,
    setMonth,
    pageChange,
    pageBack,
    location,
    setLocation,
    isSelected,
    setIsSelected,
    propertyCoordinates,
    getPropertyCoordinates,
    setPropertyCoordinates,
    setCounts,
    counts,
    history,
    setHistory,
    currentUser,
    isOpen,
    onOpen,
    onClose,
    values,
    setValues,
    isSelectedFromDropdown,
    setIsSelectedFromDropdown,
    monthlyData,
    setMonthlyData,
    getMonthlyBreakdown,
    isUserAvailable,
    setIsUserAvailable,
    dropdownLocationError,
    setDropdownLocationError,
    isItFromHeader,
    setIsItFromHeader,
    setSelectedName,
    isFirebaseGoogleAuth, setIsFirebaseGoogleAuth,
    isForgotPassword, setIsForgotPassword
  };

  useEffect(() => {
    const authState = getAuth();
    onAuthStateChanged(authState, async (user) => {
      console.log(user)
      if (user) {
        setIsUserAvailable({
          isKnown: true,
          isUserAvailable: true,
        });
        const userRef = doc(db, 'users', user.uid);
        try {
          onSnapshot(userRef, (doc) => {
            const user = doc.data();

            setCurrentUser(user);
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        setCurrentUser(null);
        setIsUserAvailable({
          isKnown: true,
          isUserAvailable: false,
        });
      }
    });
  }, []);


  return (
    <stateProvider.Provider value={contextValue}>
      {children}
    </stateProvider.Provider>
  );
};

export default stateProvider;

import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Lottie from 'lottie-react';
import { useContext, useState } from 'react';
/* import { useNavigate } from 'react-router-dom';
 */import hello from '../../src/lotties/hello.json';
import stateProvider from '../context/stateProvider';
import { setBaseResultDoc } from '../lib/reports';

const Login = ({ sx, handleSignModal, handleForgotPassword, onClose }) => {
  const [isWrongPassword, setIsWrongPassword] = useState(false)
  const { counts, propertyCoordinates, location, isItFromHeader, progressHandler, setIsForgotPassword } =
    useContext(stateProvider);
  const [isLargerThan1200] = useMediaQuery('(min-width: 1200px)');
  const [isLessThen767px] = useMediaQuery('(max-width: 767px)');

  const { bedrooms, bathrooms } = counts;
  const navigate = `useNavigate()`;
  const [isDisabled, setIsDisabled] = useState(true);

  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState({
    loading: false,
    error: false,
    errorMessage: '',
  });

  const { loading, error, errorMessage } = isLoading;

  const { setAuthStep, setIsLogging } = useContext(stateProvider);

  const changeHandler = e => {

    if (isWrongPassword) {
      setIsWrongPassword(false)
    }
    setValues(prevstate => ({
      ...prevstate,
      [e.target.id]: e.target.value,
    }));

    if (!e.target.value) {
      setIsDisabled(true);
      return;
    }
    if (e.target.id === 'email' && !e.target.value.includes('@')) {
      setIsDisabled(true);
      return;
    }

    if (e.target.id === 'password' && e.target.value.length <= 8) {
      setIsDisabled(true);
      return;
    }
    setIsDisabled(false);
  };

  const buttonStyles = {
    fontSize: '14px',
    fontWeight: 'bold',
    bg: '#000000',
    cursor: 'pointer',
    color: '#FFFF',
    borderRadius: '7px',
    _focus: {
      // background: '#FFFF',
    },
    _hover: {
      // background: '#FFFF',
    },
    _active: {
      // background: '#FFFF',
    },
  };
  const inputStyles = {
    color: '',
    fontSize: '16px',
    fontWeight: 'semibold',
    border: '1px solid #d6d6d6',
    borderRadius: '7px',
    _placeholder: {
      fontSize: '16px',
      color: '#6b6b6b',
      fontWeight: 'semibold',
    },
  };

  const handleLogin = async () => {
    setIsLoading({
      ...isLoading,
      loading: true,
    });

    try {


      const { email, password } = values;
      const auth = getAuth();
      const userAuth = await signInWithEmailAndPassword(auth, email, password);

      if (!isItFromHeader) {
        const reportId = await setBaseResultDoc({
          bedrooms,
          bathrooms,
          coordinates: propertyCoordinates,
          createdBy: userAuth.user.uid,
          location,
        });
        setIsLoading({
          ...isLoading,
          loading: false,
        });

        onClose();
        navigate(`/result/${reportId}`);
      } else {
        setIsLoading({
          ...isLoading,
          loading: false,
        });
        onClose();
        progressHandler('property')

      }

      // redirect the users
    } catch (err) {
      console.log(err);

      if (err.code === 'auth/wrong-password') {
        setIsWrongPassword(true);

      }
      setIsLoading({
        ...isLoading,
        loading: false,
      });

      setIsLoading({
        ...isLoading,
        errorMessage: err,
        error: true,
      });
    }
  };

  return (
    <>
      <Flex align={'center'} sx={{ ...sx }}>
        <Box textAlign={'left'}>
          <Text
            fontFamily={'GTBold'}
            fontSize={!isLargerThan1200 ? '25px' : '31px'}
            color={'#000000'}
            fontWeight="bold"
            w={isLargerThan1200 ? '15rem' : '10rem'}
          >
            Welcome Back!
          </Text>
          <Text
            fontFamily={'GTBold'}
            fontSize="16px"
            color={'#6B6B6B'}
            fontWeight="bold"
          >
            It's nice to see you.
          </Text>
        </Box>
        <Lottie
          style={{ width: '80%', paddingTop: '1rem' }}
          animationData={hello}
          loop={true}
        />
      </Flex>

      <Flex direction={'column'} gap=".7rem" pb="2rem" pr="1rem">
        <Input
          placeholder="Email"
          id={'email'}
          value={values.email}
          onChange={changeHandler}
          sx={{ ...inputStyles }}
        />
        <Input
          placeholder="Password"
          id="password"
          type={'password'}
          value={values.password}
          onChange={changeHandler}
          sx={{ ...inputStyles }}
        />
        <Text color={'#0088FF'} textAlign={'right'} fontFamily="GTBold" fontSize={14} cursor={'pointer'} onClick={() => {
          handleForgotPassword()
          /*  if (!isLessThen767px) {
             setAuthStep('forgotPassword')
 
           } else {
             setIsForgotPassword(true)
           } */
        }} >Forgot Password</Text>
        {
          isWrongPassword && (

            <Text textAlign={'left'} color={'#c91f1f'} fontWeight={500} fontFamily={'GTMedium'} fontSize={'17px'} marginBottom={'16px'}>Wrong email or password!</Text>
          )
        }

        <Button
          onClick={handleLogin}
          alignSelf={'center'}
          sx={{
            ...buttonStyles,
            mt: '1rem',
          }}
          isLoading={loading}
        >
          Login
        </Button>

        <Text
          fontFamily={'GTBold'}
          textAlign={'center'}
          fontSize="13px"
          fontWeight={'bold'}
          color="#6b6b6b"
        >
          Don't have an account?{' '}
          <Text
            as="span"
            color={'#0088FF'}
            cursor="pointer"
            onClick={() => {
              handleSignModal()
            }}
          >
            sign up
          </Text>{' '}
        </Text>
      </Flex>
    </>
  );
};

export default Login;

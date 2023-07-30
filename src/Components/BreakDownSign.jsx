import { Button, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import stateProvider from './../context/stateProvider';

const buttonStyles = {
  fontSize: '14px',
  fontWeight: 'semibold',
  background: '#4F59B9',
  cursor: 'pointer',
  color: '#FFFFFF',
  borderRadius: '8px',
  _focus: {
    background: '#4F59B9',
  },
  _hover: {
    background: '#4F59B9',
  },
  _active: {
    background: '#4F59B9',
  },
};

const BreakDownSign = () => {
  const { state } = useContext(stateProvider);

  let isDisable = true;

  if (state.selectedValue.length !== 0) {
    isDisable = false;
  }

  return (
    <Flex mt='2rem' direction={'column'} gap='1.5rem' color={'#212529'}>
      <Text
        fontSize={'22px'}
        fontWeight={'semibold'}
        textAlign='center'
        lineHeight={'33px'}
      >
        Create free acount to view breakdowns to save/share your bnb price!
      </Text>
      <Inputs />

      <Text
        fontSize='14px'
        textAlign={'center'}
        fontWeight='medium'
        color={isDisable ? '#B6B6B6' : '#212529'}
      >
        Already have an account?
        <Text as={'u'} color={isDisable ? '#B6B6B6' : '#664AE9'} ml='.3rem'>
          Sign in
        </Text>{' '}
      </Text>
    </Flex>
  );
};

export default BreakDownSign;

export const Inputs = () => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [values, setValues] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const { state } = useContext(stateProvider);

  let isDisable = true;

  const inputStyles = {
    fontWeight: 'medium',
    fontSize: '16px',
    borderBottom: '1px solid #EEEEEE',
    color: '#0A0E52',
    borderRadius: '0',

    _placeholder: {
      color: isDisable ? '#B6B6B6' : '#6B6B6B',
    },
    _focus: {
      borderBottom: '1px solid #EEEEEE',
    },
  };

  if (state.selectedValue.length !== 0) {
    isDisable = false;
  }

  const changeHandler = (e) => {
    setValues((prevstate) => ({
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

  return (
    <>
      <Stack spacing={3}>
        <Input
          isDisabled={isDisable}
          // ref={fullRef}

          id={'name'}
          value={values.name}
          onChange={changeHandler}
          type={'text'}
          placeholder={'Full name'}
          variant={'flushed'}
          sx={{ ...inputStyles }}
        />
        <Input
          // ref={phoneRef}
          id={'phone'}
          value={values.phone}
          onChange={changeHandler}
          isDisabled={isDisable}
          type={'tel'}
          placeholder={'Phone number'}
          variant={'flushed'}
          sx={{ ...inputStyles }}
        />

        <Input
          // ref={emailRef}
          id={'email'}
          value={values.email}
          onChange={changeHandler}
          isDisabled={isDisable}
          type={'email'}
          placeholder={'Email'}
          variant={'flushed'}
          sx={{ ...inputStyles }}
        />
        <Input
          // ref={passwordRef}
          id={'password'}
          value={values.password}
          onChange={changeHandler}
          isDisabled={isDisable}
          type={'password'}
          placeholder={'Password'}
          variant={'flushed'}
          sx={{ ...inputStyles }}
        />
      </Stack>

      <Button
        isDisabled={isDisabled}
        sx={{ ...buttonStyles }}
        alignSelf={'center'}
      >
        View
      </Button>
    </>
  );
};

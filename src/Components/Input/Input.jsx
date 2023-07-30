import { Input, Stack } from '@chakra-ui/react';
import React from 'react';

const Inputs = () => {
  const inputStyles = {
    fontWeight: 'medium',
    fontSize: '16px',
    borderBottom: '1px solid #EEEEEE',
    color: '#0A0E52',
    borderRadius: '0',

    _placeholder: {
      color: '#6B6B6B',
    },
    _focus: {
      borderBottom: '1px solid #EEEEEE',
    },
  };

  const inputItem = [
    { placeholder: 'Full name', type: 'text' },
    { placeholder: 'Phone number', type: 'tel' },
    { placeholder: 'Email', type: 'email' },
    { placeholder: 'Password', type: 'password' },
  ];

  return (
    <Stack spacing={3}>
      {inputItem.map((el) => (
        <Input
          type={el.type}
          key={Math.random()}
          placeholder={el.placeholder}
          variant={'flushed'}
          sx={{ ...inputStyles }}
        />
      ))}
    </Stack>
  );
};

export default Inputs;

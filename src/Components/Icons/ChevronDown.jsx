import { Icon } from '@chakra-ui/react';
import React from 'react';

const ChevronDown = ({ cls }) => {
  return (
    <Icon viewBox='0 0 8 7' className={cls} ml='-0.5rem'>
      <path
        d='M3.646 5.354l-3-3 .708-.708L4 4.293l2.646-2.647.708.708-3 3L4 5.707l-.354-.353z'
        fill='currentColor'
        stroke='none'
      ></path>
    </Icon>
  );
};

export default ChevronDown;

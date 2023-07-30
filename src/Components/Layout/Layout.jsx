import { Flex, useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Confirm from '../../Pages/confirm';
import { Home } from '../../Pages/Home';
import Result from '../../Pages/result';
import PropertyDetails from '../PropertyDetails/PropertyDetails';
import LogoItem from '../UI/LogoItem';

const Layout = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isLargerThan1400] = useMediaQuery('(min-width: 1400px)');
  const route = useLocation();

  return (
    <Flex
      direction={'column'}
      bg={'#F6F6F6'}
      height={route.pathname.includes('/result') ? '100vh' : 'max-content'}
      overflowY={'auto'}
    >
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
      </Routes>

      <Routes>
        <Route path='/result/:id' element={<Result />} />
        <Route path='/confirm/:token' element={<Confirm />} />
      </Routes>


    </Flex>
  );
};

export default Layout;

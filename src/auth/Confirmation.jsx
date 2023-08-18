import { Box,  Flex, Text } from '@chakra-ui/react';
import { useEffect } from 'react';


const Confirmation = ({ values }) => {



  useEffect(() => {
    window.SavvyCal('inline', { link: 'RevenueBnb/chat', selector: '#savvycal' });

  }, [])


  return (
    <Flex direction={'column'} gap='0.5rem' pb='1rem'>

      <Box textAlign={'center'}>
        <Text fontWeight={'600'} fontFamily={'GTBold'} fontSize={'30px'}>Congratulation!</Text>
        <Text fontWeight={600} fontFamily={'GTBold'} color={'#6B6B6B'} fontSize={'18px'}>We've emailed your results to you.  </Text>
        <Text fontWeight={600} fontFamily={'GTBold'}   fontSize={'20px'}>Review results with a professional</Text>

      </Box>

      <Box
          id='savvycal'
      />
    </Flex>
  );
};

export default Confirmation;

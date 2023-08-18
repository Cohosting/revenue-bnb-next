import { Box, Grid, GridItem, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, {  useState } from 'react';
import { LayoutBox } from './Layout/LayoutBox';
import TipBox from './UI/TipBox';

const months = [
  {
    month: 'Jan',
    amount: '1211',
  },
  {
    month: 'Feb',
    amount: '2441',
  },
  {
    month: 'Mar',
    amount: '4573',
  },
  {
    month: 'Apr',
    amount: '5231',
  },
  {
    month: 'May',
    amount: '4271',
  },
  {
    month: 'Jun',
    amount: '5637',
  },
  {
    month: 'Jul',
    amount: '5137',
  },
  {
    month: 'Aug',
    amount: '2763',
  },
  {
    month: 'Sep',
    amount: '4117',
  },
  {
    month: 'Oct',
    amount: '4943',
  },
  {
    month: 'Nov',
    amount: '3171',
  },
  {
    month: 'Dec',
    amount: '1253',
  },
];

const listVariants = {
  hidden: {
    opacity: 0,
    x: -25,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.25,
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -15,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

export const Months = ({ month, amount, occupancyRate }) => {
  return (
    <GridItem my={'10px'} w='100%' fontSize={'16px'} fontWeight={'medium'}>
      <Grid templateColumns={'2.7rem 1fr max-content'} alignItems='center' fontFamily="GTMedium"
      >
        <Text mr={'.7rem'}>{month}</Text>
        <Box
          bg='rgb(229, 229, 229)'
          height='19px'
          borderRadius={'50px'}
          overflow='hidden'
        >
          <Box w={occupancyRate + '%'} height='100%' bg='#009DAE' />
        </Box>
        <Text ml={'auto'} pl='1rem'>{`$${new Intl.NumberFormat('en-US').format(amount)}`}</Text>
      </Grid>
    </GridItem>
  );
};

const MonthlyData = ({ monthlyData }) => {

  const [visibilty, setVisibilty] = useState('visible');

  const getKeys = () => {
    const yearKeys = Object.keys(monthlyData);
    const currentYear = new Date().getFullYear()

    const data = yearKeys.filter((el) => el.includes(currentYear.toString()));
    const firstYearIndex = yearKeys.indexOf(data[0]);

    // removing element
    yearKeys.splice(firstYearIndex, 2);

    // adding element
    yearKeys.splice(0, 0, ...data)

    if (yearKeys.length > 12) {
      return yearKeys.slice(0, 12)
    }
    return yearKeys;
  }
/* 
  useEffect(() => {
    setTimeout(() => {
      setVisibilty('sds')

    }, 3000)
  }, [])

 */

  return (

    <LayoutBox shouldHeight100={false}>
      <Box
        height='19px'
        w='19px'
        mt='-1.6rem'
        ml='2rem'
        bg='#fff'
        borderInlineStart='1px solid #e5e5e5'
        borderBlockStart='1px solid #e5e5e5'
        transform={'rotate(45deg)'}
      />

      <Grid gap='1rem'
      >
        <Text color={'#000'} fontFamily="GTBold" fontSize='20px' fontWeight={'bold'} mt='.5rem'>
          Monthly Breakdown
        </Text>
        <motion.div
          variants={listVariants}
          initial='hidden'
          animate={visibilty}
        >
          {
            getKeys().map((key, idx) => (
              <motion.div
                variants={itemVariants}
                className='item'
                key={key}
              >

                <Months
                  occupancyRate={monthlyData[key].average_occupancy_rate}
                  month={months[idx].month} amount={monthlyData[key].average_revenue}
                />
              </motion.div>
            ))
          }
          {/*           {months.map((el, idx) => (
            <motion.div
              variants={itemVariants}
              className='item'
              key={Math.random()}
            >
              <Months key={Math.random()} month={''} amount={getData(idx + 1)} />
            </motion.div>
          ))} */}
        </motion.div>
        <TipBox
          title='Success Metric'
          tip='Annual occupancy over 40% with average nightly rate exceeding 0.03%
            of property value.'
          link='Learn more about your Vacation Rental investment'
        />
      </Grid>
    </LayoutBox>
  );
};

export default React.memo(MonthlyData);

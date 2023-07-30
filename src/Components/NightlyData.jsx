import { Box, Flex, Grid, GridItem, Spinner, Text } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import stateProvider from '../context/stateProvider';
import { getNightlyData } from '../lib/rapidApi';
import { formateNightlyData } from '../lib/reports';
import { ResultContext } from './../pages/result/[id]';
import { LayoutBox } from './Layout/LayoutBox';
import TipBox from './UI/TipBox';

const months = [
  { name: 'January', idx: 1 },
  { name: 'February', idx: 2 },
  { name: 'March', idx: 3 },
  { name: 'April', idx: 4 },
  { name: 'May', idx: 5 },
  { name: 'June', idx: 6 },
  { name: 'July', idx: 7 },
  { name: 'August', idx: 8 },
  { name: 'September', idx: 9 },
  { name: 'October', idx: 10 },
  { name: 'November', idx: 11 },
  { name: 'December', idx: 12 },
];

const NightlyDataComponent = () => {
  const { id } = useParams();
  const [isClicked, setIsClicked] = useState(false);
  const { isNightlyGenarating, setIsNightlyGenarating, nightlyData, bedrooms, coordinates, updateNightly, updateNightlyState } =
    useContext(ResultContext);
  const { month } = useContext(stateProvider);

  const selectedMonth = months.filter((mnth) => month === mnth.idx);

  useEffect(() => {

    if (nightlyData && nightlyData.length) {
      setIsNightlyGenarating(false);
      return;
    }

    (async () => {
      console.log('i am get called')
      setIsNightlyGenarating(true);
      const nightly = await getNightlyData(bedrooms, coordinates, id);
      const data = formateNightlyData(nightly)
      updateNightlyState(nightly, data)
      setIsNightlyGenarating(false);
    })();
  }, []);

  return (
    <LayoutBox shouldHeight100={false}>
      <Box
        height='19px'
        w='19px'
        mt='-1.6rem'
        ml='6.4rem'
        bg='#fff'
        borderStart='1px solid #e5e5e5'
        borderTop='1px solid #e5e5e5'
        transform={'rotate(45deg)'}
      />
      <Grid>
        <Flex color={'#212529'} mt='1rem' justify={'space-between'}>
          <Text fontSize={'20px'} fontWeight='bold'>
            Nightly Rate
          </Text>
          <Flex
            p='4px 10px'
            gap='.4rem'
            bg='#009DAE'
            borderRadius='14px'
            fontWeight='medium'
            color='#fff'
            justify={'center'}
            minW='7rem'
            position={'relative'}
            align={'center'}
            onClick={() => setIsClicked(!isClicked)}
          >
            <Text>{selectedMonth[0].name}</Text>
            <FeatherIcon
              size={17}
              icon={isClicked ? 'chevron-up' : 'chevron-down'}
            />
            {isClicked && <Months />}
          </Flex>
        </Flex>
        {isNightlyGenarating ? (
          <Flex flexDir={'column'} align={'center'} py={6}>
            <Spinner />
            <Text fontWeight={'bold'} mt={3}>
              Getting Nightly data...
            </Text>
          </Flex>
        ) : (
          <>
            <Days />
            <Dates />
          </>
        )}
        <Box mt='1rem'>
          <TipBox
            title='Pro Tip'
            tip='Dynamic Pricing can increase your revenue by up to 40%.'
            link='Learn more about Advanced Dynamic Pricing'
          />
        </Box>
      </Grid>
    </LayoutBox>
  );
};
export default NightlyDataComponent;

export const Days = () => {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <Grid templateColumns={'repeat(7,1fr)'} mt='1rem'>
      {days.map((el) => (
        <GridItem key={Math.random()} textAlign={'center'}>
          <Text fontSize='14px' fontWeight='bold'>
            {el}
          </Text>
        </GridItem>
      ))}
    </Grid>
  );
};

export const Dates = () => {
  let dt = new Date();
  const { month } = useContext(stateProvider);
  const { formattedNightlyData } = useContext(ResultContext);

  // console.log(formattedNightlyData);
  let year = dt.getFullYear();
  let mnth = month;
  const daysInMonth = new Date(year, mnth, 0).getDate();

  const datas = {};
  const currentMonth = formattedNightlyData[months[month - 1].name];

  for (let i = 1; i <= currentMonth.length; i++) {
    datas[`${year}-${mnth}-${i < 10 ? '0' + i : i}`] = {
      availablemedianrate: currentMonth[i - 1].occupancy_rate_median,
    };
  }

  // Collecting the date from the data object
  let date = [];

  const formattedDate = (dt) => {
    dt.map((key) => {
      const keys = key.slice(-2);
      date.push(keys);
      return keys;
    });
  };
  formattedDate(Object.keys(datas));

  // Creating an array to loop to a certain point
  let item = [];
  for (let i = 1; i <= 42; i++) {
    item.push(i);
  }

  // Getting the start day of month
  const startOfMonth = () => {
    const weekdayNumber = new Date(year, mnth - 1, 1);
    return weekdayNumber.getDay();
  };
  const weekDayNum = startOfMonth();

  const colorCode = {
    dark: 'rgb(0, 192, 213)',
    darker: 'rgb(0, 175, 194)',
    darkest: 'rgb(0, 157, 174)',
  };

  // Getting the previous month and next month total day
  let prevMonth = [];
  const prevMonthDay = new Date(year, mnth - 1, 0).getDate();
  for (let i = 1; i <= prevMonthDay; i++) {
    prevMonth.push(i);
  }

  const nextMonthDay = new Date(year, mnth + 1, 0).getDate();
  let nextMonth = [];
  for (let i = 1; i <= nextMonthDay; i++) {
    nextMonth.push(i);
  }



  return (
    <Grid
      templateColumns={'repeat(7,1fr)'}
      sx={{ '& > div': {} }}
      gap={'.2rem'}
    >
      {item.map((_, i) => {
        const index = i - weekDayNum;
        const condition = i < daysInMonth + weekDayNum;
        let dynamicNumber = ''
        console.log(Object.values(datas)[i])
        if (i >= weekDayNum && condition) {
          const colorCode = {
            dark: 'rgb(0, 192, 213)',
            darker: 'rgb(0, 175, 194)',
            darkest: 'rgb(0, 157, 174)',
          };

          if (Object.values(datas)[index].availablemedianrate >= 0 && Object.values(datas)[index].availablemedianrate <= 40) {
            dynamicNumber = '#00C0D5'
          } else if (Object.values(datas)[index].availablemedianrate >= 41 && Object.values(datas)[index].availablemedianrate <= 75) {
            dynamicNumber = '#00AFC2'

          } else {
            dynamicNumber = '#009DAE'

          }
        }

        return (
          <GridItem
            w='100%'
            key={Math.random()}
            minH='47px'
            fontSize={'12px'}
            color={dynamicNumber <= 0.6 ? '#000' : '#FFFF'}
            fontWeight='semibold'
            bg={i >= weekDayNum && dynamicNumber}
            borderRadius='6px'
          >
            {i <= weekDayNum - 1 && (
              <Flex
                h='100%'
                bg='#e6e6e6'
                color={'#6b6b6b'}
                p='.2rem'
                py='.5rem 0.8rem'
                borderRadius={'6px'}
              >
                <Text fontSize={'14px'} opacity='.37' ml='.2rem'>
                  {prevMonth.slice(-weekDayNum)[i]}
                </Text>
              </Flex>
            )}
            {i >= weekDayNum && (
              <Flex
                direction={'column'}
                ml='.2rem'
                justify={'center'}
                p='.2rem'
                py='.5rem 0.8rem'
              >
                {condition && (
                  <>
                    <Text fontSize={'14px'}>
                      {date[index].charAt(0) === '0'
                        ? date[index].substring(1)
                        : date[index]}
                    </Text>
                    <Text fontSize={'14px'}>
                      {Object.values(datas)[index].availablemedianrate === 'N/A'
                        ? ''
                        : ''}
                      {Math.round(
                        Object.values(datas)[index].availablemedianrate
                      )}%
                    </Text>
                  </>
                )}
              </Flex>
            )}
            {i >= daysInMonth + weekDayNum && (
              <Flex
                h='100%'
                mt='-.4rem'
                borderRadius={'6px'}
                bg='#e6e6e6'
                p='.2rem'
                py='.5rem 0.8rem'
                color={'#6b6b6b'}
              >
                <Text fontSize={'14px'} opacity='.37' ml='.2rem'>
                  {nextMonth[i - daysInMonth - weekDayNum]}
                </Text>
              </Flex>
            )}
          </GridItem>
        );
      })}
    </Grid>
  );
};

export const Months = () => {
  const { month, setMonth } = useContext(stateProvider);

  return (
    <Flex
      direction={'column'}
      position='absolute'
      w='100%'
      top={'105%'}
      left='0'
      bg='#009DAE'
      borderRadius='7px'
      fontWeight='medium'
      color='#fff'
      align={'center'}
    >
      <Box w='100%' textAlign={'center'} px='.3rem' borderRadius={'6px'}>
        {months.map((mnth) => (
          <Text
            borderRadius={'6px'}
            _hover={{ color: '#fff', bg: '#009DAE' }}
            my='.4rem'
            cursor={'pointer'}
            bg={month === mnth.idx && 'black'}
            onClick={() => setMonth(mnth.idx)}
          >
            {mnth.name}
          </Text>
        ))}
      </Box>
    </Flex>
  );
};

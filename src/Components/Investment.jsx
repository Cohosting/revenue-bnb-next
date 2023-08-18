import {
  Box,
  Button,

  Flex,
  Grid,
  
  Input,
  InputGroup,
  InputLeftElement,
  Radio,
  RadioGroup,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { useContext, useState } from 'react';
import stateProvider from '../context/stateProvider';
import { ResultContext } from './../pages/result/[id]';
import { LayoutBox } from './Layout/LayoutBox';

const textStyles = {
  fontSize: '33px',
  fontWeight: 'bold',
  lineHeight: '1.2',
};

function generateRandom5or7(min = 5, max = 7) {
  // find diff
  let difference = max - min;
  // generate random number 
  let rand = Math.random();
  // multiply with difference 
  rand = Math.floor(rand * difference);
  // add with min value 

  rand = (rand + min) + Number(Math.random().toFixed(2));

  return rand;
}


const calculateInvestmentScore = (capRate) => {
  let investmentScore = 0;
  if (capRate > 10) {
    investmentScore = 95
  }
  if (capRate <= 0) {
    investmentScore = 50
  }
  if (capRate >= 1 && capRate <= 10) {
    const random5or7 = generateRandom5or7();
    const probableScore = (capRate * random5or7) + 50
    if (probableScore > 95) {
      investmentScore = 95
    } else {
      investmentScore = Math.round(probableScore)
    }
  }
  return investmentScore


}

const Investment = () => {

  const [capRate, setCapRate] = useState(0)
  const [step, setStep] = useState('first')
  const [investmentData, setInvestmentData] = useState({
    homePrice: null,
    downPayment: null,
    downPaymentPercentage: null,
    propertyTax: null,
    homeInsurance: null,
    interestRate: 5.49,
    longTerm: 30,
    loan: null,
    monthlyPayment: null,
    taxesFees: null

  });
  const [otherExpenses, setOtherExpenses] = useState(null)
  const [isSelfManaged, setIsSelfManaged] = useState('1')
  const [isClicked, setIsClicked] = useState(false);

  const { anualAndMonthlyData, expense } = useContext(ResultContext);
  const totalIncome = anualAndMonthlyData.percentile75.revenue * 12;


  const { homePrice, downPayment, downPaymentPercentage, propertyTax, homeInsurance, longTerm,
    interestRate, taxesFees, loan } = investmentData;


  const inputStyles = {
    fontWeight: 'medium',
    fontSize: '16px',
    border: '1px solid rgb(0, 0, 0)',
    color: 'rgb(51, 51, 51)',
    borderRadius: '8px',

    _placeholder: {
      color: 'rgb(51, 51, 51)',
    },
    _focus: {
      border: '1px solid rgb(51, 51, 51)',
      bg: 'rgb(246, 246, 246)',
    },

    _active: {
      bg: 'rgb(246, 246, 246)',
    },
  };
  const handleChange = (e) => {
    let target = e.target
    let newState = { ...investmentData };

    if (target.name === 'downPayment' && homePrice) {
      newState['downPaymentPercentage'] = (target.value / homePrice) * 100;

      let monthlyLoan = (((homePrice - target.value) / longTerm) / 12).toFixed(2);

      newState['loan'] = monthlyLoan;

    } else if (target.name === 'homePrice' /* && homePrice */) {
      newState['downPaymentPercentage'] = (downPayment / target.value) * 100;
      let monthlyLoan = (((target.value - downPayment) / longTerm) / 12).toFixed(2);
      newState['loan'] = monthlyLoan;
    }

    if (target.name === 'downPaymentPercentage' && homePrice) {
      let newDownPayment = (target.value / 100) * homePrice
      newState['downPayment'] = newDownPayment;

      let monthlyLoan = (((homePrice - newDownPayment) / longTerm) / 12).toFixed(2);

      newState['loan'] = monthlyLoan;



    }

    if (target.name === 'propertyTax') {
      newState['taxesFees'] = ((target.value / 12) + (homeInsurance / 12)).toFixed(2)
    } else if (target.name === 'homeInsurance') {
      newState['taxesFees'] = ((propertyTax / 12) + (target.value / 12)).toFixed(2)

    }

    if (target.name === 'longTerm') {
      let monthlyLoan = (((homePrice - downPayment) / target.value) / 12).toFixed(2);

      newState['loan'] = monthlyLoan;

    }

    newState[target.name] = target.value
    setInvestmentData(newState)
  }


  const calculateCapRate = (isSelfManaged) => {
    let anualIncome, anualExpense, anualManagementFee = 0;

    if (isSelfManaged === '1') {
      // this is for self managed
      anualIncome = anualAndMonthlyData.average.revenue * 12
    } else if (isSelfManaged === '2') {
      // this is for Cohosting Professional

      anualIncome = anualAndMonthlyData.percentile75.revenue * 12;
      anualManagementFee = (0.15 * anualAndMonthlyData.percentile75.revenue) * 12
    }

    anualExpense = anualManagementFee + ((Number(loan) + Number(taxesFees)) * 12);

    setCapRate((((anualIncome - anualExpense) / homePrice) * 100).toFixed(2))
  }


  return (
    <LayoutBox>
      <Flex px={'0.5rem'} pb={'1rem'}>
        {
          step === 'first' ? (

            <Box flex={1}>
              <Box>
                <Text mb={1}>Home Price</Text>
                <InputGroup align='center'>
                  <InputLeftElement
                    h='100%'
                    pointerEvents='none'
                    color='rgb(51, 51, 51)'
                    fontSize='1rem'
                    children='$'
                  />
                  <Input
                    sx={{ ...inputStyles }}
                    type='number'
                    value={homePrice}
                    id='cleaning'
                    onChange={handleChange}
                    name="homePrice"
                  />
                </InputGroup>
              </Box>
              <Flex my={2}>
                <Box flex={1}>
                  <Text mb={1}>Down payment</Text>
                  <InputGroup align='center'>
                    <InputLeftElement
                      h='100%'
                      pointerEvents='none'
                      color='rgb(51, 51, 51)'
                      fontSize='1rem'
                      children='$'
                    />
                    <Input
                      sx={{ ...inputStyles }}
                      type='number'
                      value={downPayment}
                      id='cleaning'
                      onChange={handleChange}
                      name="downPayment"


                    />
                  </InputGroup>
                </Box>
                <Box w={'20%'} ml={'2'}>
                  <Text mb={1}>&nbsp;</Text>
                  <InputGroup align='center'>
                    <InputLeftElement
                      h='100%'
                      pointerEvents='none'
                      color='rgb(51, 51, 51)'
                      fontSize='1rem'
                      children='%'
                    />
                    <Input
                      sx={{ ...inputStyles }}
                      value={downPaymentPercentage}
                      id='cleaning'
                      onChange={handleChange}
                      name="downPaymentPercentage"


                    />
                  </InputGroup>
                </Box>
              </Flex>

              <Flex>
                <Box flex={1}>
                  <Text mb={1}>Long-term Year</Text>
                  <Select size={'md'} placeholder='Select option' name='longTerm' value={longTerm} onChange={handleChange}>
                    <option value='15'>15</option>
                    <option value='20'>20</option>
                    <option value='30'>30</option>
                  </Select>
                </Box>
                <Box w={'20%'} ml={'2'}>
                  <Text mb={1}>Intrest Rate</Text>
                  <InputGroup align='center'>
                    <InputLeftElement
                      h='100%'
                      pointerEvents='none'
                      color='rgb(51, 51, 51)'
                      fontSize='1rem'
                      children='%'
                    />
                    <Input
                      sx={{ ...inputStyles }}
                      value={interestRate}
                      id='cleaning'
                      onChange={handleChange}
                      name='interestRate'

                    />
                  </InputGroup>
                </Box>
              </Flex>
              <Box my={2}>
                <Text mb={1}>Property Tax(yearly)</Text>
                <InputGroup align='center'>
                  <InputLeftElement
                    h='100%'
                    pointerEvents='none'
                    color='rgb(51, 51, 51)'
                    fontSize='1rem'
                    children='$'
                  />
                  <Input
                    sx={{ ...inputStyles }}
                    type='number'
                    value={propertyTax}
                    id='cleaning'
                    onChange={handleChange}
                    name='propertyTax'


                  />
                </InputGroup>
              </Box>

              <Box>
                <Text mb={1}>Home Insurance(yearly)</Text>
                <InputGroup align='center'>
                  <InputLeftElement
                    h='100%'
                    pointerEvents='none'
                    color='rgb(51, 51, 51)'
                    fontSize='1rem'
                    children='$'
                  />
                  <Input
                    sx={{ ...inputStyles }}
                    type='number'
                    value={homeInsurance}
                    id='cleaning'
                    onChange={handleChange}
                    name="homeInsurance"

                  />
                </InputGroup>
              </Box>

              <Flex flex={1} justifyContent={'flex-end'} mt={4} >
                <Button onClick={() => {
                  setStep('second');
                  calculateCapRate('1');
                  setIsSelfManaged('1')
                }}>Continue</Button>
              </Flex>

            </Box>
          ) : (
            <Box flex={1}>
              <Box>
                <Text>Other Monthly expenses</Text>

                <Input
                  sx={{ ...inputStyles }}
                  value={otherExpenses}
                  id='cleaning'
                  onChange={(e) => setOtherExpenses(e.target.value)}
                  name='otherExpenses'

                />
              </Box>
              <Box my={2}>
                <Text>Pick your option</Text>
                <RadioGroup defaultValue={isSelfManaged} onChange={(e) => {

                  setIsSelfManaged(e)
                  calculateCapRate(e)

                }}>
                  <VStack my={2} align={'flex-left'}>
                    <Radio colorScheme='red' value='1'>
                      Self Managed (0% fee)
                    </Radio>
                    <Radio colorScheme='green' value='2'>
                      Cohosting Professional Management (15%)
                    </Radio>
                  </VStack>
                </RadioGroup>

              </Box>
              <Box mt={2}>
                <Text fontSize={'20px'}>Cap Rate:</Text>
                <Text fontWeight={'500'} fontSize={'18px'} color={'#009dae'}>{capRate}%</Text>
              </Box>

              <Flex mt={2}>
                <Button onClick={() => setStep('first')}>Go back</Button>
              </Flex>
            </Box>
          )
        }
        <Box w={'25%'} px={'20px'}>
          <Text>Total Monthly Payment: </Text>
          <Text>{Number(loan) + Number(taxesFees)} $</Text>
          <Box py={2} >
            <Text>Loan: </Text>
            <Text>${loan} $</Text>
          </Box>
          <Text>Taxes and fees: </Text>
          <Text>{taxesFees} $</Text>
        </Box>


      </Flex>
    </LayoutBox>
  );
};

export const ScoreDetails = ({ isBtnPressed }) => {
  const [isClicked, setIsClicked] = useState(false);

  const { setExpense } = useContext(ResultContext);

  const [purchaseAmount, setPurchaseAmount] = useState();

  const [expenses, setExpenses] = useState({
    cleaning: undefined,
    misc: undefined,
    hoa: undefined,
    utillity: undefined,
  });

  const btnStyles = {
    fontSize: '16px',
    fontWeight: 'medium',
    background: '#000',
    cursor: 'pointer',
    w: '100%',

    color: '#FFFFFF',
    borderRadius: '8px',
    px: '2rem',

    _focus: {
      background: '',
      transform: 'scale(0.95)',
    },
    _hover: {
      background: 'rgb(0, 119, 255)',
      color: 'rgb(255, 255, 255)',
      transform: 'scale(1.1)',
    },
    _active: {
      background: 'rgb(0, 136, 255)',
      color: 'rgb(255, 255, 255)',
      transform: 'scale(0.95)',
    },
  };

  const inputStyles = {
    fontWeight: 'medium',
    fontSize: '16px',
    border: '1px solid rgb(0, 0, 0)',
    color: 'rgb(51, 51, 51)',
    borderRadius: '8px',

    _placeholder: {
      color: 'rgb(51, 51, 51)',
    },
    _focus: {
      border: '1px solid rgb(51, 51, 51)',
      bg: 'rgb(246, 246, 246)',
    },

    _active: {
      bg: 'rgb(246, 246, 246)',
    },
  };

  const options = [
    'Cohostin Dynamic management 15%',
    'Traditional management 25%-40%',
    'Self mangaged 0%',
  ];

  const handleChange = ({ target }) => {
    if (!target.value) {
      setExpenses((prevstate) => ({
        ...prevstate,
        [target.id]: '',
      }));
      return;
    }
    let expensesCopy = { ...expenses };

    expensesCopy = {
      ...expensesCopy,
      [target.id]: +target.value,
    };


    const expense = Object.values(expensesCopy)
      .map((a) => (a === undefined ? 0 : a))
      .reduce((a, b) => {
        return parseInt(a) + parseInt(b);
      }, 0);

    setExpenses((prevstate) => ({
      ...prevstate,
      [target.id]: +target.value,
    }));

    setExpense({ expense, purchaseAmount });
  };

  return (
    <Flex
      direction={'column'}
      gap={'1rem'}
      pl='1rem'
      color='#6b6b6b'
      fontWeight={'medium'}
    >
      <Text
        fontSize={'20px'}
        fontWeight='bold'
        textAlign={'center'}
        color='#000'
        mt='1rem'
      >
        Answer a few questions to calculate investment score
      </Text>
      <Box alignSelf={'center'}>
        <Text>Do you currently own this property?</Text>
        <Flex gap='2rem' justify={'center'} mt='1rem'>
          <Button sx={{ ...btnStyles }}>Yes</Button>
          <Button sx={{ ...btnStyles }}>No</Button>
        </Flex>
      </Box>

      <Text as='label' color='#6b6b6b'>
        Purchase price
      </Text>

      <InputGroup align='center'>
        <InputLeftElement
          h='100%'
          pointerEvents='none'
          color='rgb(51, 51, 51)'
          fontSize='1.2rem'
          children='$'
        />
        <Input
          sx={{ ...inputStyles, height: '3rem' }}
          type='number'
          value={purchaseAmount}
          onChange={(e) => setPurchaseAmount(e.target.value)}
        />
      </InputGroup>

      <Box>
        <Text as='label' mb='.5rem' display={'inline-block'}>
          Management
        </Text>
        {options.map((opt, i) => (
          <RadioSelection option={opt} checked={i + 1} />
        ))}
      </Box>
      <Box as='section'>
        <Flex
          align={'center'}
          mb='1rem'
          onClick={() => setIsClicked(!isClicked)}
        >
          <Text as={'h1'}>Advanced options</Text>
          <FeatherIcon
            size={17}
            icon={isClicked ? 'chevron-up' : 'chevron-down'}
          />
        </Flex>
        {true && (
          <Grid
            gap='1.5rem'
            templateColumns={'1fr 1fr'}
            color='#000'
            fontSize={'11px'}
            fontWeight={'medium'}
          >
            <Box>
              <InputGroup align='center'>
                <InputLeftElement
                  h='100%'
                  pointerEvents='none'
                  color='rgb(51, 51, 51)'
                  fontSize='1rem'
                  children='$'
                />
                <Input
                  sx={{ ...inputStyles }}
                  type='number'
                  value={expenses.cleaning}
                  id='cleaning'
                  onChange={handleChange}
                />
              </InputGroup>

              <Text as={'label'} display='inline-block' mt='.5rem'>
                Estimated annual cleaning expenses
              </Text>
            </Box>
            <Box>
              <InputGroup align='center'>
                <InputLeftElement
                  h='100%'
                  pointerEvents='none'
                  color='rgb(51, 51, 51)'
                  fontSize='1rem'
                  children='$'
                />
                <Input
                  sx={{ ...inputStyles }}
                  type='number'
                  value={expenses.misc}
                  onChange={handleChange}
                  id='misc'
                />
              </InputGroup>

              <Text as={'label'} display='inline-block' mt='.5rem'>
                Estimated annual misc expenses
              </Text>
            </Box>
            <Box>
              <InputGroup align='center'>
                <InputLeftElement
                  h='100%'
                  pointerEvents='none'
                  color='rgb(51, 51, 51)'
                  fontSize='1rem'
                  children='$'
                />
                <Input
                  sx={{ ...inputStyles }}
                  type='number'
                  value={expenses.hoa}
                  onChange={handleChange}
                  id='hoa'
                />
              </InputGroup>

              <Text as={'label'} display='inline-block' mt='.5rem'>
                Estimated monthly HOA expenses
              </Text>
            </Box>
            <Box>
              <InputGroup align='center'>
                <InputLeftElement
                  h='100%'
                  pointerEvents='none'
                  color='rgb(51, 51, 51)'
                  fontSize='1rem'
                  children='$'
                />
                <Input
                  sx={{ ...inputStyles }}
                  type='number'
                  value={expenses.utillity}
                  onChange={handleChange}
                  id='utillity'
                />
              </InputGroup>

              <Text as={'label'} display='inline-block' mt='.5rem'>
                Estimated monthly utillity expenses
              </Text>
            </Box>
          </Grid>
        )}
      </Box>
      <Flex
        align={'center'}
        alignSelf='end'
        onClick={() => isBtnPressed(true)}
        mt='1rem'
      >
        <Button
          sx={{
            alignSelf: 'end',
            fontSize: '17px',
            fontWeight: 'medium',
            background: 'none',
            color: '#000000',
            pr: '0.3rem',

            _focus: {},
            _hover: {},
            _active: {},
          }}
        >
          Calculate Now
        </Button>
        <FeatherIcon color='#000' icon='arrow-right' size='30' />
      </Flex>
    </Flex>
  );
};

export const RadioSelection = ({ option, checked }) => {
  const { value, setValue } = useContext(stateProvider);

  const onClick = () => {
    setValue(checked);
  };

  return (
    <Flex mt='.5rem' align={'center'} gap='.5rem' onClick={onClick}>
      <Box
        borderRadius='50%'
        border={value === checked && '5px solid #313131'}
        width='17px'
        height='17px'
        p='3.5px'
        background={value === checked ? '#fff' : 'rgb(204, 204, 204)'}
      />
      <Text
        color={value === checked ? 'rgb(153, 153, 153)' : 'rgb(204, 204, 204)'}
      >
        {option}
      </Text>
    </Flex>
  );
};

export default Investment;

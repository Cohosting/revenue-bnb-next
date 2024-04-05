import React, { useEffect, useState } from 'react'
import { Box, Flex, Text, Input, Switch, Select, Divider, Grid, Collapse } from '@chakra-ui/react'
import { expenseItems } from '../utils/constant'
function calculateDownPaymentPercentage(propertyPrice, downPayment) {
    // Check for invalid inputs (negative values)
    if (propertyPrice <= 0 || downPayment <= 0) {
        return "Error: Property price and down payment must be positive values.";
    }

    // Calculate the percentage
    const percentage = (downPayment / propertyPrice) * 100;

    // Format the output with two decimal places
    return `Your downpayment of ${downPayment}$ is ${percentage.toFixed(2) + "%"} of ${propertyPrice}$`;
}
function calculateMortgagePayment(principal, interestRate, loanTermInYears, downPayment = 0) {
    // Handle potential down payment being greater than principal
    /*     if ( downPayment && downPayment > principal) {
            throw new Error("Down payment cannot be greater than the loan amount.");
        } */

    // Subtract down payment from principal
    const loanAmount = principal - downPayment;

    // Convert interest rate to monthly decimal
    const monthlyInterestRate = interestRate / 1200;

    // Calculate total number of monthly payments
    const loanTermInMonths = loanTermInYears * 12;

    // Calculate the exponent term
    const exponentTerm = Math.pow(1 + monthlyInterestRate, loanTermInMonths);

    // Calculate the denominator of the formula
    const denominator = exponentTerm - 1;

    // Calculate the monthly mortgage payment
    const monthlyPayment = loanAmount * (monthlyInterestRate * exponentTerm) / denominator;

    return monthlyPayment.toFixed(2); // Round to 2 decimal places
}

const InvestmentAnalysis = ({ results }) => {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [isProfessionallyManaged, setIsProfessionallyManaged] = useState(true)
    const [propertyAnalysisData, setPropertyAnalysisData] = useState({
        propertyPrice: null,
        loan: false,
        loanDuration: '10',
        downPayment: null,
        interestRate: null,
    });


    const [advancedData, setAdvancedData] = useState({
        managementFee: null,
        propertyTax: null,
        lodgingTax: null,
        mortgage: null,
        HOA: null,
        insurance: null,
        maintenance: null,
        electricity: null,
        wifi: null,
        gas: null,
        homeFurnishing: null,
        closingCosts: null,
        others: null,

    })
    // Yearly expenses
    const [totalExpenses, setTotalExpenses] = useState()
    const toggleAdvanced = () => setIsAdvancedOpen(!isAdvancedOpen);

    const handleAdvancedDataChange = (e) => {
        const { name, value } = e.target;

        console.log(name, value)
        setAdvancedData({ ...advancedData, [name]: Number(value) })

    }

    let data = isProfessionallyManaged ? results.last_12_months_summary.quartiles['90th_percentile'] : results.last_12_months_summary.average



    useEffect(() => {
        const { propertyPrice, interestRate, loanDuration, downPayment } = propertyAnalysisData

        if (!propertyPrice || !interestRate || !loanDuration) return;
        const mortgage = calculateMortgagePayment(propertyPrice, interestRate, Number(loanDuration), downPayment);
        setAdvancedData({
            ...advancedData,
            mortgage
        });
    }, [propertyAnalysisData]);

    useEffect(() => {
        // Ensure data exists before proceeding
        if (!advancedData) {
            return; // Early exit if data is not yet available
        }


        console.log(advancedData.propertyTax)

        // Handle edge cases for numerical properties using a combination of:
        // - Type checking with `typeof`
        // - Default values for non-numbers or undefined values
        let propertyPrice = propertyAnalysisData.propertyPrice
            ? propertyAnalysisData.propertyPrice
            : 0;
        let annualMortgage = advancedData.mortgage * 12
            ? advancedData.mortgage * 12
            : 0;
        let propertyTax = advancedData.propertyTax ? propertyPrice * (advancedData.propertyTax / 100)
            : 0;
        console.log({ propertyTax })
        let lodgingTax = advancedData.lodgingTax
            ? propertyPrice * (advancedData.lodgingTax / 100)
            : 0;
        let electricity = advancedData.electricity ? advancedData.electricity * 12
            : 0;
        let wifi = advancedData.wifi ? advancedData.wifi * 12
            : 0;
        let gas = advancedData.gas ? advancedData.gas * 12
            : 0;

        let managementFee = data.revenue * (advancedData.managementFee / 100)
        // Handle potential non-numerical values for HOA, maintenance, insurance, others
        let hoa = advancedData.HOA ? advancedData.HOA : 0; // Use 0 or a more appropriate default
        let maintenance = advancedData.maintenance ? advancedData.maintenance : 0;
        let insurance = advancedData.insurance ? advancedData.insurance : 0;
        let others = advancedData.others ? advancedData.others : 0;

        let totalExpenses = managementFee + propertyTax + lodgingTax + electricity + wifi + gas + annualMortgage + hoa + maintenance + insurance + others;
        console.log({ managementFee, annualMortgage, propertyTax, lodgingTax, electricity, wifi, gas, hoa, maintenance, insurance, others })

        setTotalExpenses(totalExpenses.toFixed(2));
    }, [advancedData]);
    const totalCost = advancedData.closingCosts + advancedData.homeFurnishing;



    return (
        <Box p={4} bg={'white'} m={2}>
            <Flex>
                <Box>
                    <Text>Revenue Projection</Text>
                    <Flex alignItems={'center'} >
                        <Text>Professionally managed: </Text>
                        <Switch defaultChecked checked={isProfessionallyManaged} onChange={(e) => setIsProfessionallyManaged(e.target.checked)} ml={2} />
                    </Flex>
                    <Text my={1}>{data.revenue}$</Text>
                </Box>
                <Box ml='auto'>
                    <Text>Annual Expenses</Text>
                    {totalExpenses && <Text>{totalExpenses}</Text>}
                </Box>
            </Flex>
            <Flex mt='4'>
                <Box>
                    <Text>Property Price</Text>
                    <Input value={propertyAnalysisData.propertyPrice} onChange={(e) => setPropertyAnalysisData({
                        ...propertyAnalysisData,
                        propertyPrice: e.target.value
                    })} placeholder='Enter property price' />
                </Box>
                <Box ml='auto'>
                    <Text>Startup Costs</Text>
                    <Text>{totalCost.toFixed(2)} $</Text>
                </Box>
            </Flex>


            <Divider my={5} />

            <Flex flex={1} alignItems={'center'}>
                <Text>Are you taking loan?</Text>
                <Switch defaultChecked={false} checked={propertyAnalysisData.loan} onChange={(e) => setPropertyAnalysisData({
                    ...propertyAnalysisData,
                    loan: e.target.checked
                })} ml={2} colorScheme='red' />
            </Flex>

            <Collapse in={propertyAnalysisData.loan}>

                <Box  >
                    <Text>Years</Text>
                    <Select value={propertyAnalysisData.loanDuration} onChange={(e) => setPropertyAnalysisData({
                        ...propertyAnalysisData,
                        loanDuration: e.target.value
                    })} >
                        <option value='10'>10 years</option>
                        <option value='20'>20 years</option>
                        <option value='30'>30 years</option>
                    </Select>
                </Box>
                <Flex mt={2} alignItems={'center'} justifyContent={'space-between'}>
                    <Box>
                        <Input
                            onChange={(e) => setPropertyAnalysisData({
                                ...propertyAnalysisData,
                                downPayment: e.target.value
                            })}
                            value={propertyAnalysisData.downPayment}
                            placeholder='Down payment'
                        />
                        {
                            propertyAnalysisData.downPayment &&
                            <Text>{calculateDownPaymentPercentage(propertyAnalysisData.propertyPrice, propertyAnalysisData.downPayment)}</Text>
                        }
                    </Box>
                    <Box>
                        <Text>Interest rate</Text>
                        <Input type='number' value={propertyAnalysisData.interestRate} onChange={(e) => {
                            const value = e.target.value
                            // Update state with formatted value (percentage)
                            setPropertyAnalysisData({
                                ...propertyAnalysisData,
                                interestRate: value,
                            });
                        }} placeholder='%' />
                    </Box>
                </Flex>
            </Collapse>




            <Divider my={5} />
            <Text cursor={'pointer'} color={'HighlightText'} onClick={toggleAdvanced} fontSize={'25px'}  >Advance settings</Text>
            <Collapse in={isAdvancedOpen}>
                <Grid templateColumns='repeat(2, 1fr)' gap='4'>
                    {expenseItems.map((item) => (
                        <Box key={item.key}>
                            <Text>{item.name}</Text>
                            <Input type='number' name={item.key} value={advancedData[item.key]} onChange={handleAdvancedDataChange} onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                                placeholder={item.placeholder} />
                        </Box>
                    ))}
                </Grid>

                <Box my={3}>
                    <Text my={2} fontSize={'20px'}>Startup costs</Text>
                    <Flex alignItems={'center'} justifyContent={'space-between'} >
                        <Box>
                            <Text>Home furnishing</Text>
                            <Input type='number' value={advancedData.homeFurnishing} onChange={(e) => {
                                setAdvancedData({
                                    ...advancedData,
                                    homeFurnishing: parseFloat(e.target.value)
                                })
                            }} />
                        </Box>
                        <Box>
                            <Text>Closing costs</Text>
                            <Input type='number' value={advancedData.closingCosts} onChange={(e) => {
                                setAdvancedData({
                                    ...advancedData,
                                    closingCosts: parseFloat(e.target.value)
                                })
                            }} />
                        </Box>
                    </Flex>
                </Box>

            </Collapse>


        </Box>
    )
}

export default InvestmentAnalysis
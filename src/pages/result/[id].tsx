/* @ts-nocheck 
 */
import dynamic from 'next/dynamic';
import { Box, Button, Flex, Progress, Text, useDisclosure } from '@chakra-ui/react';
import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import graph from '../../lotties/graph.json';
import LogoItem from '../../Components/UI/LogoItem';
import stateProvider from '../../context/stateProvider';
import { fetchData, getReportDetails, updateViewCountAndSendWebhook } from '../../lib/reports';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import Head from 'next/head';
import { AuthContext } from '../../context/authContext';
import { useLegacyEffect } from './../../hooks/useEffectLegacy';
import { getKeys } from "../../Components/MonthlyData";
import { Map } from "../../Components/Map";
import InvestmentAnalysis from "./../../Components/InvestmentAnalysis";
// Dynamically importing the components
const Lottie = dynamic(() => import("lottie-react"));
const Schedule = dynamic(() => import("../../Components/modals/schedule"));
const Breakdown = dynamic(() => import("../../Components/Breakdown"));
const Price = dynamic(() => import("../../Components/PropertyDetails/Price"));
const SavvyCal = dynamic(() => import("../../Components/savvyCall"));
const UserForm = dynamic(() => import("../../auth/ViewedByAuth"));
export const ResultContext = createContext(null);

const Result: FC<any> = ({ data }) => {
  let defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    "User ID": uuidv4(),
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm({ defaultValues });

  const router = useRouter();
  const { id } = router.query;
  const { onClose } = useContext<any>(stateProvider);
  const { currentUser } = useContext(AuthContext);
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isNightlyGenarating, setIsNightlyGenarating] = useState(true);
  const [expense, setExpense] = useState({});
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState({
    isError: false,
    errorMessage: "",
  });
  const [cookies] = useCookies(["hasSubmitForm"]);
  const { isOpen, onOpen, onClose: onScheduleClose } = useDisclosure();

  const onError = (msg) => {
    setError({
      ...error,
      isError: true,
      errorMessage: msg,
    });
  };
  const { isError } = error;
  useLegacyEffect(() => {
    const token = localStorage.getItem("revenuebnb_token");
    if (!token) {
      /* @ts-ignore */
      setResults(data);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
    console.log("legacy effect run with id", id, currentUser);
    if (!id || !currentUser) {
      console.log("no id or user");
      return;
    }

    console.log("Data is about to get fetched");
    fetchData(id)
      .then((fetchedData) => {
        console.log(`Data fetched`, fetchedData);
        setResults(fetchedData);
        /* @ts-ignore */
        if (fetchedData.isError) {
          console.log("Error happend");
          setError({
            isError: true,
            errorMessage: "Unknown error occured",
          });
          onOpen();
        }
      })
      .catch((err) => {
        console.log({ err });

        setError({
          isError: true,
          errorMessage: "Unknown error occured",
        });
        onOpen();
      })
      .finally(() => {
        setLoading(false);
      });

    updateViewCountAndSendWebhook(id, currentUser.id, {
      requestSentBy: currentUser,
    }).catch((err) =>
      console.error("Failed to update view count and send webhook:", err)
    );
  }, [id, currentUser]);

  const updateNightly = (data) => {
    setResults({
      ...results,
      nightlyData: data,
    });
  };

  const updateFormattedNightlyData = (data) => {
    setResults({
      ...results,
      formattedNightlyData: data,
    });
  };

  const updateNightlyState = (nightlyData, formattedNightlyData) => {
    setResults({
      ...results,
      nightlyData,
      formattedNightlyData,
    });
  };

  // removing last active result

  useEffect(() => {
    onClose();

    const id = localStorage.getItem("lastId");

    if (id) {
      localStorage.removeItem("lastId");
    }
  }, []);

  useEffect(() => {
    if (progress < 90) {
      const value = Math.floor(1 + Math.random() * 30);
      setTimeout(() => {
        if (loading) {
          setProgress(value + progress);
        }
      }, 800);
    }
  }, [progress]);

  const handlePDFGenerate = async () => {
    console.log(results.monthly_summary);
    const summary = results.last_12_months_summary.quartiles;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}puppeteer/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportURL: `${window.location.origin}/result/${results.id}`,
        resultId: results.id,
        resultLocation: results.location,
        revenue: {
          min: summary["75th_percentile"].revenue,
          max: summary["90th_percentile"].revenue,
        },
        nightly: {
          min: summary["75th_percentile"].average_daily_rate,
          max: summary["90th_percentile"].average_daily_rate,
        },
        occupancy: {
          min: summary["75th_percentile"].occupancy_rate,
          max: summary["90th_percentile"].occupancy_rate,
        },

        monthsRevenue: getKeys(Object.keys(results.monthly_summary)).map(
          (currentMonth) =>
            results.monthly_summary[currentMonth].average_revenue === "N/A"
              ? 0
              : results.monthly_summary[currentMonth].average_revenue
        ),
      }),
    })
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        // Create a Blob object for the PDF data
        const pdfBlob = new Blob([buffer], { type: "application/pdf" });

        // Display the PDF (using a framework or library)
        // OR
        // Download the PDF (using a FileSaver library)

        // Example with a basic download link (using a temporary anchor tag):
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = `${results.location}.pdf`;
        downloadLink.click();
      });
  };
  return (
    <ResultContext.Provider
      value={{
        ...results,
        updateNightly,
        updateFormattedNightlyData,
        expense,
        setExpense,
        updateNightlyState,
        isNightlyGenarating,
        setIsNightlyGenarating,
      }}
    >
      <Box>
        <Head>
          <title> Revenuebnb - {data.location}</title>
          <meta
            name="description"
            content={`Revenuebnb Vacation Rental revenue prediction for ${data.location}`}
          />
          <meta property="og:title" content={`Revenuebnb - ${data.location}`} />
          <meta
            property="og:description"
            content={`Revenuebnb Vacation Rental revenue prediction for ${data.location}`}
          />
          <meta property="og:type" content="website" />
        </Head>
      </Box>

      <SavvyCal />

      {loading ? (
        <Flex
          height={"100vh"}
          align={"center"}
          flexDir={"column"}
          justifyContent={"center"}
        >
          <Lottie
            style={{ height: "200px", width: "200px", marginInline: "auto" }}
            animationData={graph}
            loop={true}
          />
          <Text mt={"-26px"} fontSize={"24px"} fontWeight={"bold"}>
            Results are loading
          </Text>
          <Progress
            sx={{
              borderRadius: "5px",
              bg: "#E5E5E5",
              "& > div": {
                bg: "#00EAA0",
              },
            }}
            mt={"10px"}
            w={"55%"}
            value={progress}
            height={"17px"}
          />
        </Flex>
      ) : Object.keys(currentUser || {}).length === 0 &&
        !cookies.hasSubmitForm ? (
        <>
          <UserForm results={data} />
        </>
      ) : !isError ? (
        <Box bg={"#F6F6F6"} maxW={"1000px"} margin={"0 auto"}>
          <LogoItem />

          <Box maxW={"1000px"} w={"98%"} margin={"0 auto"}>
            <Button onClick={() => router.push("/")} ml={4} variant={"ghost"}>
              <AiOutlineArrowLeft /> <Text ml={2}>Back to Search</Text>
            </Button>
          </Box>

          <Price
            average={
              results.last_12_months_summary.quartiles["50th_percentile"]
            }
            professional={
              results.last_12_months_summary.quartiles["90th_percentile"]
            }
          />
          <Breakdown monthlyData={results.monthly_summary} results={results} />
          <Button onClick={handlePDFGenerate} colorScheme="red" my={3}>
            Download PDF
          </Button>
          <Map compareableProperty={results.comps} results={results} />
          <InvestmentAnalysis results={results} />
          <Box
            marginTop={"40px"}
            paddingBottom={"20px"}
            fontSize={"15px"}
            color={"#6B6B6B"}
            fontWeight={500}
            fontFamily={"GT Eesti Text Light"}
          >
            <Text textAlign={"center"} lineHeight={1.2}>
              Copywrite &copy;{new Date().getFullYear()}
            </Text>
            <Flex align={"center"} justifyContent={"center"}>
              <Text>Terms of use</Text>
              &nbsp; & &nbsp;
              <Text>Privacy Policy</Text>
            </Flex>
          </Box>
        </Box>
      ) : (
        <Schedule isOpen={isOpen} onOpen={onOpen} onClose={onScheduleClose} />
      )}
    </ResultContext.Provider>
  );
};

export async function getServerSideProps(context: any) {
    context.res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )
    try {
        const data: any = await getReportDetails(context.query.id);

        if (!data) {
            console.log('undefined  data')
            return {
                props: {}, // will be passed to the page component as props
            }
        } else {
            return {
                props: { data }, // will be passed to the page component as props
            }
        }

    } catch (err) {
        console.log(err)
        return {
            props: {}, // will be passed to the page component as props
        }
    }


}

export default Result;

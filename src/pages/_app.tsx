import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react';
import { StateContext } from './../context/stateProvider';
import { AuthContextComponent } from './../context/authContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import './../index.css'
export default function App({ Component, pageProps }: AppProps) {



  return (

    <ChakraProvider>
      <AuthContextComponent>
      <StateContext>
        <Component {...pageProps} />
      </StateContext>
      </AuthContextComponent>

    </ChakraProvider>
  )

}

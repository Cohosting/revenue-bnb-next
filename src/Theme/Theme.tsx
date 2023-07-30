import { extendTheme } from '@chakra-ui/react';
import { Box } from './Components/Layouts';
import { Text } from './Components/Typography';
import { layerStyles } from './Layer';

const theme = extendTheme({
  fonts: {
    body: 'GTMedium',
  },
  layerStyles,
  styles: {
    global: {
      body: {
        fontFamily: 'body',
      },
      a: {},
      ul: {},
      h1: {},
      p: {},
    },
  },
  colors: {
    primary: {
      dark: '#089BAB',
      dark2: '#009DAE',
      light: '#EFF7F8',
      grey: { '100': '#6b6b6b' },
    },
    secondary: {
      dark: '#FEAD54',
      light: '#FEF6ED',
    },
  },
  components: {
    Button: {
      baseStyle: {},
      sizes: {},
      variants: {},
    },
    Text,
    Box,
  },
});

export default theme;

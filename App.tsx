import { NativeBaseProvider, Box, Image } from 'native-base'
import { Home } from './src/screens/Home'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { StatusBar, View } from 'react-native'
import { THEME } from './src/theme'
import { Layout } from './src/components/Layout'
import { LinearGradient } from 'expo-linear-gradient'
import { Routes } from './src/routes'
import { HeroesContextProvider } from './src/context/HeroesContext'
import { ItemsContextProvider } from './src/context/ItemsContext'

const config = {
  dependencies: {
    'linear-gradient': LinearGradient,
  },
}

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={THEME} config={config}>
      <HeroesContextProvider>
        <ItemsContextProvider>
          <StatusBar
            barStyle={'light-content'}
            backgroundColor={'transparent'}
            translucent
          />
          {fontsLoaded ? <Routes /> : <View />}
        </ItemsContextProvider>
      </HeroesContextProvider>
    </NativeBaseProvider>
  )
}

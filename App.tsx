import { NativeBaseProvider } from 'native-base'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { StatusBar, View } from 'react-native'
import { THEME } from './src/theme'
import { LinearGradient } from 'expo-linear-gradient'
import { Routes } from './src/routes'
import { HeroesItemsContextProvider } from './src/context/HeroesItemsContext'

import i18next from 'i18next'

import 'dayjs/locale/pt-br'
import './src/i18n/config'
import { getLocales } from 'expo-localization'

const config = {
  dependencies: {
    'linear-gradient': LinearGradient,
  },
}

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  i18next.changeLanguage(getLocales()[0].languageTag)

  return (
    <NativeBaseProvider theme={THEME} config={config}>
      <HeroesItemsContextProvider>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={'transparent'}
          translucent
        />
        {fontsLoaded ? <Routes /> : <View />}
      </HeroesItemsContextProvider>
    </NativeBaseProvider>
  )
}

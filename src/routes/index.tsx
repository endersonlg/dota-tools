import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { Layout } from '../components/Layout'
import { AppRoutes } from './app.routes'

export function Routes() {
  const theme = DefaultTheme
  theme.colors.background = 'transparent'

  return (
    <Layout>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </Layout>
  )
}

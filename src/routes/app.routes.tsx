import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'

import { Home } from '../screens/Home'
import { ListUsers } from '../screens/List'
import { User } from '../screens/User'

import { Header } from '../components/Header'

type AppRoutes = {
  home: undefined
  listUsers: {
    search: string
  }
  user: {
    userId: number
  }
}

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutes>

export function AppRoutes() {
  const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>()
  return (
    <Navigator initialRouteName="home">
      <Screen
        name="home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />

      <Screen
        name="listUsers"
        component={ListUsers}
        options={{
          header: () => <Header />,
        }}
      />
      <Screen
        name="user"
        component={User}
        options={{
          header: () => <Header />,
        }}
      />
    </Navigator>
  )
}

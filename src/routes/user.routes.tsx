import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'

import { Home } from '../screens/Home'
import { ListUsers } from '../screens/List'
import { User } from '../screens/User'

type UserRoutes = {
  home: undefined
  listUsers: {
    search: string
  }
  user: {
    userId: number
  }
  twitch: undefined
  suggest: undefined
}

export type AppStackNavigatorRoutesProps = NativeStackNavigationProp<UserRoutes>

export function UserRoutes() {
  const { Navigator: StackNavigator, Screen: StackScreen } =
    createNativeStackNavigator<UserRoutes>()

  return (
    <StackNavigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackScreen name="home" component={Home} />

      <StackScreen name="listUsers" component={ListUsers} />
      <StackScreen name="user" component={User} />
    </StackNavigator>
  )
}

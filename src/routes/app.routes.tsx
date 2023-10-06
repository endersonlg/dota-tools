import { Header } from '../components/Header'
import { Twitch } from '../screens/Twitch'
import { Suggest } from '../screens/Suggest'

import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { UserRoutes } from './user.routes'
import { useTheme } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

type AppRoutes = {
  userRoutes: undefined
  twitch: undefined
  draft: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

export function AppRoutes() {
  const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

  const { t } = useTranslation()
  const { colors } = useTheme()

  return (
    <Navigator
      screenOptions={{
        header: () => <Header />,
        tabBarActiveTintColor: colors.gray[200],
        tabBarInactiveTintColor: colors.gray[500],
        tabBarLabelStyle: {
          fontSize: 12,
          textAlign: 'center',
        },

        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: colors.gray[800],
        },
      }}
    >
      <Screen
        name="userRoutes"
        component={UserRoutes}
        options={{
          title: t('user_information'),
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={20} color={color} />
          ),
        }}
      />
      <Screen
        name="draft"
        component={Suggest}
        options={{
          title: t('pick_helper'),
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list" size={20} color={color} />
          ),
        }}
      />
      <Screen
        name="twitch"
        component={Twitch}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  )
}

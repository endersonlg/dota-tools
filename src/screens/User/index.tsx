import { useRoute } from '@react-navigation/native'
import { Divider, VStack } from 'native-base'

import { Information } from './components/Information'

import { Counts } from './components/Count'

import { Heroes } from './components/Heroes'
import { RecentMatches } from './components/RecentMatches'

type RouteParamsProps = {
  userId: number
}

export function User() {
  const route = useRoute()

  const { userId } = route.params as RouteParamsProps

  return (
    <VStack flex={1}>
      <Information userId={userId} />
      <Divider orientation="horizontal" my={'4'} />
      <Counts userId={userId} />
      <Heroes userId={userId} />
      <Divider orientation="horizontal" my={'4'} />
      <RecentMatches userId={userId} />
    </VStack>
  )
}

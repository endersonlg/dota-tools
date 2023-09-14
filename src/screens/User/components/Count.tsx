import {
  Divider,
  FlatList,
  HStack,
  ScrollView,
  Skeleton,
  Text,
  VStack,
} from 'native-base'
import { useEffect, useState } from 'react'

import { api } from '../../../service/api'

import Animated, { FadeInRight } from 'react-native-reanimated'

const VStackAnimated = Animated.createAnimatedComponent(VStack)

interface Count {
  id: string
  title: string
  win: number
  lose: number
  winRate: number
}

interface CountsProps {
  userId: number
}

export function Counts({ userId }: CountsProps) {
  const [counts, setCounts] = useState<Count[]>([])

  useEffect(() => {
    async function loadCounts() {
      try {
        const { data } = await api.get(`/players/${userId}/counts`)

        const countsAux: Count[] = [
          {
            id: '1',
            title: 'RADIANT',
            win: data.is_radiant[1].win,
            lose: data.is_radiant[1].games - data.is_radiant[1].win,
            winRate: (data.is_radiant[1].win / data.is_radiant[1].games) * 100,
          },
          {
            id: '2',
            title: 'DIRE',
            win: data.is_radiant[0].win,
            lose: data.is_radiant[0].games - data.is_radiant[0].win,
            winRate: (data.is_radiant[0].win / data.is_radiant[0].games) * 100,
          },
          {
            id: '3',
            title: 'ALL DRAFT',
            win: data.game_mode[22].win,
            lose: data.game_mode[22].games - data.game_mode[22].win,
            winRate: (data.game_mode[22].win / data.game_mode[22].games) * 100,
          },
          {
            id: '4',
            title: 'ALL PICK',
            win: data.game_mode[1].win,
            lose: data.game_mode[1].games - data.game_mode[1].win,
            winRate: (data.game_mode[1].win / data.game_mode[1].games) * 100,
          },

          {
            id: '5',
            title: 'SAFE LANE',
            win: data.lane_role[1].win,
            lose: data.lane_role[1].games - data.lane_role[1].win,
            winRate: (data.lane_role[1].win / data.lane_role[1].games) * 100,
          },
          {
            id: '6',
            title: 'MID LANE',
            win: data.lane_role[2].win,
            lose: data.lane_role[2].games - data.lane_role[2].win,
            winRate: (data.lane_role[2].win / data.lane_role[2].games) * 100,
          },
          {
            id: '7',
            title: 'OFF LANE',
            win: data.lane_role[3].win,
            lose: data.lane_role[3].games - data.lane_role[3].win,
            winRate: (data.lane_role[3].win / data.lane_role[3].games) * 100,
          },
          {
            id: '8',
            title: 'UNKNOWN LANE',
            win: data.lane_role[0].win,
            lose: data.lane_role[0].games - data.lane_role[0].win,
            winRate: (data.lane_role[0].win / data.lane_role[0].games) * 100,
          },
        ]

        setCounts(countsAux)
      } catch (e) {
        console.log(e)
      }
    }

    loadCounts()
  }, [userId])

  return (
    <VStack mb={1}>
      <Text color={'gray.300'} mb={2}>
        COUNTS (win / lose / winrate)
      </Text>
      {counts.length ? (
        <FlatList
          data={counts}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <Divider orientation="vertical" mx={'2'} bg={'transparent'} />
          )}
          renderItem={({ item, index }) => (
            <VStackAnimated
              borderWidth={1}
              borderColor={'gray.500'}
              rounded={'md'}
              alignItems={'center'}
              p={2}
              entering={FadeInRight.delay(index * 100)}
            >
              <Text color={'gray.100'} fontSize={'md'}>
                {item.title}
              </Text>
              <HStack>
                <Text color={'green.600'}>{item.win}</Text>
                <Text color={'gray.400'}> / </Text>
                <Text color={'red.500'}>{item.lose}</Text>
                <Text color={'gray.400'}> / </Text>
                <Text
                  color={item.winRate >= 50 ? 'green.600' : 'red.500'}
                >{`${item.winRate.toFixed(2)}%`}</Text>
              </HStack>
            </VStackAnimated>
          )}
        />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Array.from({ length: 8 }).map((_, index) => (
            <VStack
              borderWidth={1}
              borderColor={'gray.500'}
              rounded={'md'}
              alignItems={'center'}
              p={2}
              key={`counts-loading-${index}`}
              w={32}
              mr={index !== 7 ? '4' : 0}
            >
              <Skeleton height={6} rounded={'md'} mb={1} />

              <Skeleton height={4} rounded={'md'} />
            </VStack>
          ))}
        </ScrollView>
      )}

      <HStack space={2}></HStack>
    </VStack>
  )
}

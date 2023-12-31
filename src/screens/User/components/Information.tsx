import {
  Divider,
  HStack,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from 'native-base'
import { Medal } from './Medal'
import { api } from '../../../service/api'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface InformationProps {
  userId: number
}

interface User {
  name: string
  mmr: string
  medal: string | null
  stars: string | null
}

interface WinLoss {
  win: number | null
  lose: number | null
}

export function Information({ userId }: InformationProps) {
  const [user, setUser] = useState<User | null>(null)
  const [winLose, setWinLose] = useState<WinLoss>({ win: null, lose: null })

  const toast = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    async function loadUsers() {
      try {
        const { data } = await api.get(`/players/${userId}`)
        setUser({
          name: data.profile.personaname,
          mmr: data.competitive_rank || '????',
          medal: data.rank_tier ? String(data.rank_tier).at(0)! : null,
          stars: data.rank_tier ? String(data.rank_tier).at(1)! : null,
        })
      } catch (e) {
        toast.closeAll()

        toast.show({
          title: t('sorry_there_was_a_server_error'),
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    }

    async function loadWinLoss() {
      try {
        const { data } = await api.get(`/players/${userId}/wl`)
        setWinLose({
          win: data.win,
          lose: data.lose,
        })
      } catch (e) {
        toast.closeAll()

        toast.show({
          title: t('sorry_there_was_a_server_error'),
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    }

    loadUsers()
    loadWinLoss()
  }, [t, userId])

  const { win, lose } = winLose

  const winRate =
    typeof win === 'number' && typeof lose === 'number'
      ? (win / (win + lose)) * 100
      : null

  if (!user || !win || !lose || !winRate) {
    return (
      <HStack space={4}>
        <VStack space={1} alignItems={'center'}>
          <Skeleton w={20} h={20} rounded={'md'} />
        </VStack>

        <VStack flex={1} space={1}>
          <Skeleton rounded={'2xl'} />
          <ScrollView horizontal>
            <HStack space={4} justifyContent={'space-between'}>
              <HStack space={4}>
                <VStack>
                  <Text color={'gray.300'}>{t('win').toUpperCase()}</Text>
                  <Skeleton.Text lines={1} />
                </VStack>

                <VStack>
                  <Text color={'gray.300'}>{t('loss').toUpperCase()}</Text>
                  <Skeleton.Text lines={1} />
                </VStack>

                <VStack>
                  <Text color={'gray.300'}>{t('winrate').toUpperCase()}</Text>
                  <Skeleton.Text lines={1} />
                </VStack>
              </HStack>

              <Divider orientation="vertical" />

              <VStack>
                <Text color={'gray.300'}>MMR</Text>
                <Skeleton.Text lines={1} />
              </VStack>
            </HStack>
          </ScrollView>
        </VStack>
      </HStack>
    )
  }

  return (
    <HStack space={4}>
      <VStack space={1} alignItems={'center'}>
        <Medal medal={user.medal} stars={user.stars} />
      </VStack>

      <VStack flex={1} space={1}>
        <Text
          color={'gray.100'}
          fontSize={'2xl'}
          numberOfLines={1}
          isTruncated={true}
        >
          {user.name}
        </Text>
        <ScrollView horizontal>
          <HStack space={4} justifyContent={'space-between'}>
            <HStack space={4}>
              <VStack>
                <Text color={'gray.300'}>{t('win').toUpperCase()}</Text>
                <Text color={'green.600'} textAlign={'center'}>
                  {win}
                </Text>
              </VStack>

              <VStack>
                <Text color={'gray.300'}>{t('loss').toUpperCase()}</Text>
                <Text color={'red.500'} textAlign={'center'}>
                  {lose}
                </Text>
              </VStack>

              <VStack>
                <Text color={'gray.300'}>{t('winrate').toUpperCase()}</Text>
                <Text
                  color={winRate >= 50 ? 'green.600' : 'red.500'}
                  textAlign={'center'}
                >{`${winRate.toFixed(2)}%`}</Text>
              </VStack>
            </HStack>

            <Divider orientation="vertical" />

            <VStack>
              <Text color={'gray.300'}>MMR</Text>
              <Text color={'gray.300'} textAlign={'center'}>
                {user.mmr}
              </Text>
            </VStack>
          </HStack>
        </ScrollView>
      </VStack>
    </HStack>
  )
}

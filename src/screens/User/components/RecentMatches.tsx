import {
  Box,
  Divider,
  FlatList,
  HStack,
  Image,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from 'native-base'
import { ListRenderItemInfo } from 'react-native'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { api } from '../../../service/api'
import { useHeroesItems } from '../../../hook/useHeroesItems'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { useTranslation } from 'react-i18next'
import { firstLetterUppercase } from '../../../utils/firstLetterUppercase'
import { Item } from '../../../context/HeroesItemsContext'

dayjs.extend(duration)

const HStackAnimated = Animated.createAnimatedComponent(HStack)

interface Match {
  matchId: number
  kills: number
  duration: string
  deaths: number
  assists: number
  heroAvatar: string
  heroName: string
  win: boolean
  items: (Item | null)[]
  level: number
}

interface MatchesProps {
  userId: number
}

interface ResponseRecentMatch {
  assists: number
  deaths: number
  duration: number
  hero_id: number
  kills: number
  match_id: number
  player_slot: number
  radiant_win: number
  item_0: number
  item_1: number
  item_2: number
  item_3: number
  item_4: number
  item_5: number
  level: number
}

export function RecentMatches({ userId }: MatchesProps) {
  const [matches, setMatches] = useState<Match[]>([])

  const { heroes: totalHeroes, items: totalItems, isLoading } = useHeroesItems()

  const toast = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    async function loadMatches() {
      try {
        const { data } = await api.get<ResponseRecentMatch[]>(
          `/players/${userId}/matches?project=item_0&project=item_1&project=item_2&project=item_3&project=item_4&project=item_5&project=hero_id&project=kills&project=deaths&project=assists&project=level&limit=50`,
        )

        setMatches(
          data.map((match) => {
            const heroInformation = totalHeroes.find(
              (totalHero) => totalHero.id === match.hero_id,
            )
            const isRadiant = match.player_slot <= 4

            const itemsId = [
              match.item_0,
              match.item_1,
              match.item_2,
              match.item_3,
              match.item_4,
              match.item_5,
            ]

            const items = itemsId.map((item) => {
              if (item === 0) {
                return null
              }

              return totalItems.find((itemAux) => itemAux.id === item) || null
            })

            return {
              matchId: match.match_id,
              kills: match.kills,
              deaths: match.deaths,
              assists: match.assists,
              duration: dayjs
                .duration({
                  minutes: Math.floor(match.duration / 60),
                  seconds: match.duration % 60,
                })
                .format('mm:ss'),
              win:
                isRadiant && match.radiant_win
                  ? true
                  : !!(!isRadiant && !match.radiant_win),
              heroAvatar: heroInformation?.avatar || '',
              heroName: heroInformation?.name || '',
              items,
              level: match.level,
            }
          }),
        )
      } catch (err) {
        toast.closeAll()

        toast.show({
          title: t('sorry_there_was_a_server_error'),
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    }

    if (!isLoading) {
      loadMatches()
    }
  }, [userId, isLoading, totalHeroes, totalItems, t])

  function renderItem({ item, index }: ListRenderItemInfo<Match>) {
    return (
      <HStackAnimated
        space={3}
        alignItems={'center'}
        entering={FadeInUp.delay(index * 100)}
      >
        <HStack space={2} width={'2/5'} alignItems={'center'}>
          <Image
            source={{
              uri: item.heroAvatar,
              width: 10 * 4,
              height: 10 * 4,
            }}
            alt={item.heroName}
            width={10}
            h={10}
            rounded={'full'}
            resizeMode="cover"
          />
          <VStack flex={1}>
            <Text color={'gray.300'} flexShrink={1} isTruncated={true}>
              {item.heroName}
            </Text>
            <Text color={'gray.300'}>Level: {item.level}</Text>
          </VStack>
        </HStack>

        <Text color={item.win ? 'green.600' : 'red.500'}>
          {item.win
            ? `${firstLetterUppercase(t('win'))}`
            : `${firstLetterUppercase(t('loss'))}`}
        </Text>

        <VStack space={'0.5'}>
          <HStack space={'0.5'} justifyContent={'space-between'}>
            {item.items.slice(0, 3).map((itemAux, itemAuxIndex) => (
              <Box
                w={4}
                h={4}
                overflow={'hidden'}
                borderWidth={1}
                borderColor={'gray.500'}
                rounded={'sm'}
                bg={'gray.700'}
                key={`item-${itemAuxIndex}`}
              >
                {itemAux?.img && (
                  <Image
                    source={{
                      uri: itemAux.img,
                      width: 4 * 4,
                      height: 4 * 4,
                    }}
                    resizeMode="cover"
                    alt={itemAux?.name}
                    w={'full'}
                    h={'full'}
                  />
                )}
              </Box>
            ))}
          </HStack>

          <HStack space={'0.5'} justifyContent={'space-between'}>
            {item.items.slice(3, 6).map((itemAux, itemAuxIndex) => (
              <Box
                w={4}
                h={4}
                overflow={'hidden'}
                borderWidth={1}
                borderColor={'gray.500'}
                rounded={'sm'}
                bg={'gray.700'}
                key={`item-${itemAuxIndex}`}
              >
                {itemAux?.img && (
                  <Image
                    source={{
                      uri: itemAux.img,
                      width: 4 * 4,
                      height: 4 * 4,
                    }}
                    alt={itemAux?.name}
                    w={'full'}
                    h={'full'}
                  />
                )}
              </Box>
            ))}
          </HStack>
        </VStack>

        <VStack marginLeft={'auto'}>
          <HStack>
            <Text color={'gray.300'}>{item.kills}</Text>
            <Text color={'gray.400'}> / </Text>
            <Text color={'gray.300'}>{item.deaths}</Text>
            <Text color={'gray.400'}> / </Text>
            <Text color={'gray.300'}>{item.assists}</Text>
          </HStack>
          <Text color={'gray.300'} textAlign={'right'}>
            {item.duration}
          </Text>
        </VStack>
      </HStackAnimated>
    )
  }

  return (
    <VStack flex={1}>
      <Text color={'gray.300'} mb={2}>
        {t('recent_matches').toUpperCase()}
      </Text>

      {matches.length ? (
        <FlatList
          data={matches}
          keyExtractor={(item) => String(item.matchId)}
          ItemSeparatorComponent={() => (
            <Divider orientation="horizontal" my={'1'} />
          )}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
      ) : (
        <ScrollView>
          {Array.from({ length: 10 }).map((_, index) => (
            <HStack
              space={4}
              key={`match-loading-${index}`}
              alignItems={'center'}
              mb={2}
              paddingBottom={1}
              borderBottomWidth={1}
              borderBottomColor={'gray.600'}
            >
              <HStack space={2} width={'2/5'} alignItems={'center'}>
                <Skeleton width={10} h={10} rounded={'full'} />

                <Skeleton.Text lines={2} flex={1} />
              </HStack>

              <Skeleton.Text lines={1} w={8} />

              <VStack space={'0.5'}>
                <HStack space={'0.5'} justifyContent={'space-between'}>
                  <Skeleton w={4} h={4} rounded={'sm'} />
                  <Skeleton w={4} h={4} rounded={'sm'} />
                  <Skeleton w={4} h={4} rounded={'sm'} />
                </HStack>

                <HStack space={'0.5'} justifyContent={'space-between'}>
                  <Skeleton w={4} h={4} rounded={'sm'} />
                  <Skeleton w={4} h={4} rounded={'sm'} />
                  <Skeleton w={4} h={4} rounded={'sm'} />
                </HStack>
              </VStack>

              <Skeleton.Text lines={2} flex={1} alignItems={'flex-end'} />
            </HStack>
          ))}
        </ScrollView>
      )}
    </VStack>
  )
}

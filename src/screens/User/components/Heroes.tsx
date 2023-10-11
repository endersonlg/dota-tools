import {
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
import { useEffect, useState } from 'react'

import { api } from '../../../service/api'
import { useHeroesItems } from '../../../hook/useHeroesItems'
import Animated, { FadeInRight } from 'react-native-reanimated'
import { useTranslation } from 'react-i18next'

const VStackAnimated = Animated.createAnimatedComponent(VStack)

interface ResponseHero {
  hero_id: number
  games: number
  win: number
}

interface Hero extends ResponseHero {
  winRate: number
  avatar: string
  name: string
}

interface CountsProps {
  userId: number
}

export function Heroes({ userId }: CountsProps) {
  const [heroes, setHeroes] = useState<Hero[]>([])

  const { heroes: totalHeroes, isLoading } = useHeroesItems()

  const toast = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    async function loadCounts() {
      try {
        const { data } = await api.get<ResponseHero[]>(
          `/players/${userId}/heroes`,
        )

        setHeroes(
          data.map((hero) => {
            const heroInformation = totalHeroes.find(
              (totalHero) => totalHero.id === hero.hero_id,
            )

            return {
              hero_id: hero.hero_id,
              games: hero.games,
              win: hero.win,
              winRate: (hero.win / hero.games) * 100,
              avatar: heroInformation?.avatar || '',
              name: heroInformation?.name || '',
            }
          }),
        )
      } catch (e) {
        toast.closeAll()

        toast.show({
          title: t('sorry_there_was_a_server_error'),
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    }

    if (!isLoading) {
      loadCounts()
    }
  }, [userId, isLoading, totalHeroes, t])

  return (
    <VStack mt={2}>
      <Text color={'gray.300'} mb={2}>
        {`${t('heroes').toUpperCase()} (${t('win')} / ${t('loss')} / ${t(
          'winrate',
        )})`}
      </Text>
      {heroes.length ? (
        <FlatList
          data={heroes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => String(item.hero_id)}
          ItemSeparatorComponent={() => (
            <Divider orientation="vertical" mx={'2'} bg={'transparent'} />
          )}
          renderItem={({ item, index }) => (
            <VStackAnimated
              borderWidth={1}
              borderColor={'gray.500'}
              rounded={'md'}
              alignItems={'center'}
              justifyContent={'space-between'}
              p={2}
              minW={'32'}
              entering={FadeInRight.delay(index * 100)}
            >
              <Image
                source={{
                  uri: item.avatar,
                  width: 48,
                }}
                alt={item.name}
                width={12}
                height={12}
                rounded={'sm'}
              />

              <Text color={'gray.300'} fontSize={'sm'} textAlign={'center'}>
                {t(item.name)}
              </Text>

              <HStack>
                <Text color={'green.600'}>{item.win}</Text>
                <Text color={'gray.400'}> / </Text>
                <Text color={'red.500'}>{item.games - item.win}</Text>
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
          {Array.from({ length: 10 }).map((_, index) => (
            <VStackAnimated
              borderWidth={1}
              borderColor={'gray.500'}
              rounded={'md'}
              alignItems={'center'}
              justifyContent={'space-between'}
              p={2}
              w={'32'}
              mr={index !== 9 ? '4' : 0}
              key={`hero-loading-${index}`}
            >
              <Skeleton width={12} height={12} rounded={'sm'} mb={1} />

              <Skeleton.Text lines={1} mb={1} />

              <Skeleton h={'4'} rounded={'md'} />
            </VStackAnimated>
          ))}
        </ScrollView>
      )}

      <HStack space={2}></HStack>
    </VStack>
  )
}

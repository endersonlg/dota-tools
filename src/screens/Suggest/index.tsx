import {
  FlatList,
  Divider,
  HStack,
  Image,
  Text,
  VStack,
  useToast,
} from 'native-base'
import { useHeroesItems } from '../../hook/useHeroesItems'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Hero } from '../../context/HeroesItemsContext'
import { TouchableOpacity, ListRenderItemInfo } from 'react-native'
import { api } from '../../service/api'
import Animated from 'react-native-reanimated'

import { Input } from '../../components/Input'

import { TechiesLoading } from '../../components/TechiesLoading'
import { SelectedHeroes } from './components/SelectedHeroes'
import { useTranslation } from 'react-i18next'

const TouchableOpacityAnimated =
  Animated.createAnimatedComponent(TouchableOpacity)

type Percentage = {
  heroId: number
  value: number
}

export interface HeroWithPercentages extends Hero {
  percentages: Percentage[]
}

interface ResponseMatchups {
  rows: {
    hero_id: number
    hero_id2: number
    'AVG Hero-Hero': string
    count: number
    winrate: number
    winrate_wilson: number
    sum: number
    min: number
    max: number
    stddev: '0'
  }[]
}

interface Matchup {
  heroId: number
  percentagesByHero: Percentage[]
}

export function Suggest() {
  const [heroes, setHeroes] = useState<Hero[]>([])

  const [selectedHeroes, setSelectedHeroes] = useState<HeroWithPercentages[]>(
    [],
  )

  const [search, setSearch] = useState('')

  const [matchup, setMatchup] = useState<Matchup[]>([])

  const { heroes: totalHeroes } = useHeroesItems()

  const toast = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    if (totalHeroes.length > 0) {
      setHeroes(
        totalHeroes.map((hero) => ({
          ...hero,
          percentage: null,
        })),
      )
    }
  }, [totalHeroes])

  function handleSearch(value: string) {
    if (value !== search) {
      setSearch(value)
    }
  }

  useEffect(() => {
    async function loadMatchup() {
      try {
        const { data } = await api.get<ResponseMatchups>(
          `/explorer?sql=
          SELECT player_matches.hero_id%2C player_matches2.hero_id hero_id2 %2C
          avg(1) %22AVG Hero-Hero%22%2C
          count(distinct matches.match_id) count%2C
          sum(case when (player_matches.player_slot %3C 128) %3D radiant_win then 1 else 0 end)%3A%3Afloat%2Fcount(1) winrate%2C
          ((sum(case when (player_matches.player_slot %3C 128) %3D radiant_win then 1 else 0 end)%3A%3Afloat%2Fcount(1)) 
          %2B 1.96 * 1.96 %2F (2 * count(1)) 
          - 1.96 * sqrt((((sum(case when (player_matches.player_slot %3C 128) %3D radiant_win then 1 else 0 end)%3A%3Afloat%2Fcount(1)) * (1 - (sum(case when (player_matches.player_slot %3C 128) %3D radiant_win then 1 else 0 end)%3A%3Afloat%2Fcount(1))) %2B 1.96 * 1.96 %2F (4 * count(1))) %2F count(1))))
          %2F (1 %2B 1.96 * 1.96 %2F count(1)) winrate_wilson%2C
          sum(1) sum%2C
          min(1) min%2C
          max(1) max%2C
          stddev(1%3A%3Anumeric) stddev
            
          FROM matches
          JOIN match_patch using(match_id)
          JOIN leagues using(leagueid)
          JOIN player_matches using(match_id)
          JOIN heroes on heroes.id %3D player_matches.hero_id
          LEFT JOIN notable_players ON notable_players.account_id %3D player_matches.account_id
          LEFT JOIN teams using(team_id)
          JOIN player_matches player_matches2
          ON player_matches.match_id %3D player_matches2.match_id
          AND player_matches.hero_id !%3D player_matches2.hero_id 
          AND abs(player_matches.player_slot - player_matches2.player_slot) %3C 10
          AND player_matches.hero_id %3C player_matches2.hero_id
          WHERE TRUE
          AND 1 IS NOT NULL 
          AND matches.start_time %3E%3D extract(epoch from timestamp %272023-06-24T03%3A00%3A00.000Z%27)
          AND matches.start_time %3C%3D extract(epoch from timestamp %272023-09-24T03%3A00%3A00.000Z%27)
          GROUP BY player_matches.hero_id%2C player_matches2.hero_id
          HAVING count(distinct matches.match_id) %3E%3D 1
          ORDER BY %22AVG Hero-Hero%22 DESC%2Ccount DESC NULLS LAST`,
        )

        const matchupAux: Matchup[] = totalHeroes.map((hero) => {
          const matchupThisHero = data.rows.filter(
            (matchupByHero) =>
              matchupByHero.hero_id === hero.id ||
              matchupByHero.hero_id2 === hero.id,
          )

          if (matchupThisHero.length === 0) {
            return {
              heroId: hero.id,
              percentagesByHero: [],
            }
          }

          const percentage: Percentage[] = matchupThisHero.map(
            (matchupHero) => {
              const isHeroId1 = hero.id === matchupHero.hero_id

              const winRate = isHeroId1
                ? matchupHero.winrate
                : 1 - matchupHero.winrate

              const { total, wins } = matchupThisHero.reduce(
                (acc, current) => {
                  if (hero.id === current.hero_id) {
                    return {
                      wins: acc.wins + current.count * current.winrate,
                      total: acc.total + current.count,
                    }
                  }

                  return {
                    wins: acc.wins + current.count * (1 - current.winrate),
                    total: acc.total + current.count,
                  }
                },
                {
                  total: 0,
                  wins: 0,
                },
              )

              const totalWinsWithoutHero =
                wins -
                (isHeroId1
                  ? matchupHero.count * matchupHero.winrate
                  : matchupHero.count * (1 - matchupHero.winrate))

              const totalGamesWithoutHero = total - matchupHero.count

              const winRateWithoutHero =
                totalWinsWithoutHero / totalGamesWithoutHero

              const winRateHero = wins / total

              const percentageThisMatchup =
                (winRateHero - winRateWithoutHero - (winRate - 0.5)) * 10

              return {
                heroId: isHeroId1 ? matchupHero.hero_id2 : matchupHero.hero_id,
                value: percentageThisMatchup,
              }
            },
          )

          return {
            heroId: hero.id,
            percentagesByHero: percentage,
          }
        })

        setMatchup(matchupAux)
      } catch (err) {
        toast.closeAll()

        toast.show({
          title: t('sorry_there_was_a_server_error'),
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    }

    if (totalHeroes.length > 0) {
      loadMatchup()
    }
  }, [t, totalHeroes])

  const handleSelectHero = useCallback(
    async (heroSelectedAux: Hero) => {
      const matchupThisHero = matchup.find(
        (hero) => hero.heroId === heroSelectedAux.id,
      )

      setSelectedHeroes((state) => {
        return [
          ...state,
          {
            ...heroSelectedAux,
            percentages: matchupThisHero?.percentagesByHero || [],
          },
        ]
      })
    },
    [matchup],
  )

  function removeSelectedHero(heroToRemove: Hero) {
    setSelectedHeroes((state) => {
      return state.filter((heroAux) => heroAux.id !== heroToRemove.id)
    })
  }

  const heroesToShow = useMemo(() => {
    return heroes
      .filter((hero) => {
        if (
          selectedHeroes.some((heroSelected) => heroSelected.id === hero.id)
        ) {
          return false
        }

        return search.length
          ? hero.name.toLowerCase().includes(search.toLowerCase())
          : true
      })
      .map((hero) => {
        if (selectedHeroes.length === 0) {
          return {
            ...hero,
            percentage: 0,
            percentageText: '??',
            percentageColor: 'gray.300',
          }
        }

        const percentage = selectedHeroes
          .map((heroSelected) =>
            heroSelected.percentages.find((heroSelectedPercentage) => {
              return heroSelectedPercentage.heroId === hero.id
            }),
          )
          .reduce((acc, current) => acc + (current?.value || 0), 0)

        return {
          ...hero,
          percentage,
          percentageText: percentage.toFixed(2),
          percentageColor: percentage > 0 ? 'green.600' : 'red.500',
        }
      })
      .sort((a, b) => {
        return b.percentage - a.percentage
      })
  }, [heroes, selectedHeroes, search])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<(typeof heroesToShow)[0]>) => {
      return (
        <TouchableOpacityAnimated
          onPress={() => handleSelectHero(item)}
          disabled={selectedHeroes.length >= 5}
        >
          <HStack space={2} alignItems={'center'}>
            <HStack space={2} alignItems={'center'} flex={1}>
              <Image
                source={{
                  uri: item.avatar,
                  width: 10 * 4,
                  height: 10 * 4,
                }}
                w={10}
                h={10}
                rounded={'full'}
                alt={item.name}
              />
              <Text color={'gray.300'}>{item.name}</Text>
            </HStack>
            <Text color={item.percentageColor}>{item.percentageText}</Text>
          </HStack>
        </TouchableOpacityAnimated>
      )
    },
    [handleSelectHero, selectedHeroes.length],
  )

  return (
    <VStack flex={1}>
      <SelectedHeroes
        selectedHeroes={selectedHeroes}
        removeSelectedHero={removeSelectedHero}
      />

      <Text color="gray.300" mb={4}>
        {t('select_the_enemy_team_heroes')}
      </Text>

      <Input
        placeholder={t('search_hero')}
        mb={4}
        onChangeText={(value) => handleSearch(value.trim())}
        value={search}
      />

      <Text color={'gray.300'} textAlign={'right'} mb={1}>
        {t('advantage')}
      </Text>

      {heroes.length && matchup.length ? (
        <FlatList
          data={heroesToShow}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={() => (
            <Divider orientation="horizontal" my={'1'} />
          )}
          windowSize={5}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text color={'gray.300'} textAlign={'center'}>{`${t(
              'unable_to_find_a_hero_containing_the_word',
            )} '${search}'.`}</Text>
          }
          flex={1}
        />
      ) : (
        <TechiesLoading />
      )}
    </VStack>
  )
}

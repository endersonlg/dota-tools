import { ReactNode, createContext, useEffect, useState } from 'react'
import { api } from '../service/api'
import { useToast } from 'native-base'
import { useTranslation } from 'react-i18next'

interface ResponseHero {
  [key: string]: {
    id: number
    name: string
    localized_name: string
    attack_type: string
  }
}

export interface Hero {
  id: number
  name: string
  isRange: boolean
  avatar: string
}

export interface Item {
  id: number
  img: string
  name: string
}

interface IHeroesItemsContext {
  heroes: Hero[]
  items: Item[]
  isLoading: boolean
}

export const HeroesItemsContext = createContext({} as IHeroesItemsContext)

interface HeroesItemsContextProviderProps {
  children: ReactNode
}

export function HeroesItemsContextProvider({
  children,
}: HeroesItemsContextProviderProps) {
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    async function load() {
      setIsLoading(true)

      try {
        const heroesResponse = await api.get<ResponseHero>('/constants/heroes')

        const heroesKeys = Object.keys(heroesResponse.data)

        setHeroes(
          heroesKeys.map((key) => {
            const [, nameSplit] =
              heroesResponse.data[key].name.split('npc_dota_hero_')

            const avatar = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${nameSplit}.png`

            return {
              id: heroesResponse.data[key].id,
              name: heroesResponse.data[key].localized_name,
              isRange: heroesResponse.data[key].attack_type === 'Ranged',
              avatar,
            }
          }),
        )

        const itemsResponse = await api.get('/constants/items')

        const keys = Object.keys(itemsResponse.data)

        setItems(
          keys.map((key) => {
            const img = itemsResponse.data[key].img

            return {
              id: itemsResponse.data[key].id,
              name: itemsResponse.data[key].dname,
              img: `https://cdn.cloudflare.steamstatic.com/${img}`,
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
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [t])

  return (
    <HeroesItemsContext.Provider value={{ heroes, items, isLoading }}>
      {children}
    </HeroesItemsContext.Provider>
  )
}

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

interface IHeroesContext {
  heroes: Hero[]
  isLoading: boolean
}

export const HeroesContext = createContext({} as IHeroesContext)

interface HeroesContextProviderProps {
  children: ReactNode
}

export function HeroesContextProvider({
  children,
}: HeroesContextProviderProps) {
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    async function loadHeroes() {
      setIsLoading(true)

      try {
        const { data } = await api.get<ResponseHero>('/constants/heroes')

        const keys = Object.keys(data)

        setHeroes(
          keys.map((key) => {
            const [, nameSplit] = data[key].name.split('npc_dota_hero_')

            const avatar = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${nameSplit}.png`

            return {
              id: data[key].id,
              name: data[key].localized_name,
              isRange: data[key].attack_type === 'Ranged',
              avatar,
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

    loadHeroes()
  }, [t])

  return (
    <HeroesContext.Provider value={{ heroes, isLoading }}>
      {children}
    </HeroesContext.Provider>
  )
}

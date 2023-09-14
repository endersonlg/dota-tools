import { ReactNode, createContext, useEffect, useState } from 'react'
import { api } from '../service/api'

interface ResponseHero {
  id: number
  name: string
  localized_name: string
  attack_type: string
}

interface Hero {
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

  useEffect(() => {
    function loadHeroes() {
      setIsLoading(true)
      api
        .get<ResponseHero[]>('/heroes')
        .then(({ data }) => {
          setHeroes(
            data.map((hero) => {
              const [, nameSplit] = hero.name.split('npc_dota_hero_')

              const avatar = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${nameSplit}.png`

              return {
                id: hero.id,
                name: hero.localized_name,
                isRange: hero.attack_type === 'Ranged',
                avatar,
              }
            }),
          )
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    loadHeroes()
  }, [])

  return (
    <HeroesContext.Provider value={{ heroes, isLoading }}>
      {children}
    </HeroesContext.Provider>
  )
}

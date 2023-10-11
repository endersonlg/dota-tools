import { useContext } from 'react'
import { HeroesItemsContext } from '../context/HeroesItemsContext'

export function useHeroesItems() {
  const context = useContext(HeroesItemsContext)

  return context
}

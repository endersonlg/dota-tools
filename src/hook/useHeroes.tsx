import { useContext } from 'react'
import { HeroesContext } from '../context/HeroesContext'

export function useHeroes() {
  const context = useContext(HeroesContext)

  return context
}

import { useContext } from 'react'
import { ItemsContext } from '../context/ItemsContext'

export function useItems() {
  const context = useContext(ItemsContext)

  return context
}

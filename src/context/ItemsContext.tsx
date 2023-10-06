import { ReactNode, createContext, useEffect, useState } from 'react'
import { api } from '../service/api'
import { useToast } from 'native-base'
import { useTranslation } from 'react-i18next'

export interface Item {
  id: number
  img: string
  name: string
}

interface ItemsContext {
  items: Item[]
  isLoading: boolean
}

export const ItemsContext = createContext({} as ItemsContext)

interface ItemsContextProviderProps {
  children: ReactNode
}

export function ItemsContextProvider({ children }: ItemsContextProviderProps) {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    async function loadItems() {
      setIsLoading(true)
      try {
        const { data } = await api.get('/constants/items')

        const keys = Object.keys(data)

        setItems(
          keys.map((key) => {
            return {
              id: data[key].id,
              name: data[key].dname,
              img: `https://cdn.cloudflare.steamstatic.com/${data[key].img}`,
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
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [t])

  return (
    <ItemsContext.Provider value={{ items, isLoading }}>
      {children}
    </ItemsContext.Provider>
  )
}

import { HStack, VStack, Image, Text, Divider } from 'native-base'
import { FlatList, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { api } from '../service/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useNavigation, useRoute } from '@react-navigation/native'

import Animated, { FadeInUp } from 'react-native-reanimated'
import { TechiesLoading } from '../components/TechiesLoading'

import { AppNavigatorRoutesProps } from '../routes/app.routes'

const TouchableOpacityAnimated =
  Animated.createAnimatedComponent(TouchableOpacity)

dayjs.extend(relativeTime)

interface User {
  account_id: number
  personaname: string
  avatarfull: string
  last_match_time: string
}

type RouteParamsProps = {
  search: string
}

export function ListUsers() {
  const [users, setUsers] = useState<User[]>([])

  const route = useRoute()

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const { search } = route.params as RouteParamsProps

  useEffect(() => {
    async function loadUsers() {
      try {
        const { data } = await api.get(`/search?q=${search}`)
        setUsers(data)
      } catch (e) {
        console.log(e)
      }
    }

    loadUsers()
  }, [search])

  function handleNavigate(userId: number) {
    navigation.navigate('user', {
      userId,
    })
  }

  return (
    <VStack flex={1}>
      {users.length ? (
        <FlatList
          data={users}
          keyExtractor={(user) => String(user.account_id)}
          ItemSeparatorComponent={() => (
            <Divider orientation="horizontal" my={'4'} />
          )}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacityAnimated
              onPress={() => handleNavigate(item.account_id)}
              entering={FadeInUp.delay(index * 100)}
            >
              <HStack width={'full'} alignItems={'center'} space={'4'}>
                <Image
                  source={{
                    uri: item.avatarfull,
                    width: 12 * 4,
                  }}
                  alt={item.personaname}
                  w={12}
                  h={12}
                  rounded={'full'}
                  resizeMode="cover"
                />
                <Text
                  color={'gray.100'}
                  fontSize={'lg'}
                  flexShrink={1}
                  noOfLines={1}
                  isTruncated={true}
                >
                  {item.personaname}
                </Text>
                <Text color={'gray.500'} ml={'auto'}>
                  {dayjs(new Date(item.last_match_time)).fromNow()}
                </Text>
              </HStack>
            </TouchableOpacityAnimated>
          )}
        />
      ) : (
        <TechiesLoading w={32} h={32} />
      )}
    </VStack>
  )
}

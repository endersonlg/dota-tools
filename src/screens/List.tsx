import { HStack, VStack, Image, Text, Divider, useToast } from 'native-base'
import { FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { api } from '../service/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useNavigation, useRoute } from '@react-navigation/native'

import Animated, { FadeInUp } from 'react-native-reanimated'
import { TechiesLoading } from '../components/TechiesLoading'

import { AppStackNavigatorRoutesProps } from '../routes/user.routes'
import { useTranslation } from 'react-i18next'

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

  const navigation = useNavigation<AppStackNavigatorRoutesProps>()

  const toast = useToast()
  const { i18n, t } = useTranslation()

  const { search } = route.params as RouteParamsProps

  useEffect(() => {
    async function loadUsers() {
      try {
        const { data } = await api.get(`/search?q=${search}`)
        setUsers(data)
      } catch (e) {
        toast.closeAll()

        toast.show({
          title: t('sorry_there_was_a_server_error'),
          placement: 'top',
          bgColor: 'red.500',
        })
      }
    }

    loadUsers()
  }, [search, toast])

  function handleNavigate(userId: number) {
    navigation.navigate('user', {
      userId,
    })
  }

  function renderItem({ item, index }: ListRenderItemInfo<User>) {
    return (
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
            {dayjs(new Date(item.last_match_time))
              .locale(i18n.language)
              .fromNow()}
          </Text>
        </HStack>
      </TouchableOpacityAnimated>
    )
  }

  return (
    <VStack flex={1}>
      <Text color={'gray.300'} textAlign={'right'} mb={1}>
        {t('last_access')}
      </Text>
      {users.length ? (
        <FlatList
          data={users}
          keyExtractor={(user) => String(user.account_id)}
          ItemSeparatorComponent={() => (
            <Divider orientation="horizontal" my={'4'} />
          )}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
      ) : (
        <TechiesLoading w={32} h={32} />
      )}
    </VStack>
  )
}

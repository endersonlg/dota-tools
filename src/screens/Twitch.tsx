import {
  Box,
  HStack,
  Image,
  Text,
  VStack,
  useTheme,
  useToast,
} from 'native-base'

import pedrinho from '../assets/pedrinho.png'

import { Feather } from '@expo/vector-icons'
import { Linking, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'

export function Twitch() {
  const { colors } = useTheme()

  const toast = useToast()
  const { t } = useTranslation()

  function handleNavigateToTwitch(streamer: string) {
    const twitchAppUrl = `twitch://channel/${streamer}`

    Linking.canOpenURL(twitchAppUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(twitchAppUrl)
        } else {
          Linking.openURL(`https://www.twitch.tv/${streamer}`)
        }
      })
      .catch(() => {
        toast.closeAll()

        toast.show({
          title: t('sorry_there_was_a_server_error'),
          placement: 'top',
          bgColor: 'red.500',
        })
      })
  }

  return (
    <VStack flex={1} justifyContent={'space-between'}>
      <HStack alignItems={'center'} justifyContent={'space-between'}>
        <HStack space={4} flex={1}>
          <Box
            w={16}
            h={16}
            borderWidth={2}
            borderColor={'gray.600'}
            rounded={'full'}
            overflow={'hidden'}
          >
            <Image
              source={pedrinho}
              w={'full'}
              h={'full'}
              alt="pedrinho"
              resizeMode="stretch"
            />
          </Box>
          <VStack flex={1}>
            <Text color={'gray.100'} fontSize={'lg'}>
              dreeziinhoo
            </Text>
            <Text
              color={'gray.300'}
              fontSize={'sm'}
              flex={1}
              noOfLines={2}
              lineHeight={'sm'}
            >
              {t('twitch_dreeziinhoo_description')}
            </Text>
          </VStack>
        </HStack>
        <TouchableOpacity onPress={() => handleNavigateToTwitch('dreeziinhoo')}>
          <Feather name="arrow-up-right" size={24} color={colors.gray[300]} />
        </TouchableOpacity>
      </HStack>

      <Box bg={'gray.600'} p={4} rounded={'md'}>
        <Text color={'gray.300'} textAlign={'justify'}>
          {t('twitch_recommended')}
        </Text>
      </Box>
    </VStack>
  )
}

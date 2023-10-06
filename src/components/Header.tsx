import { Box, HStack, Heading, Image, Pressable, useTheme } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'

import LogoSvg from '../assets/logo.png'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '../routes/app.routes'

export function Header() {
  const { colors } = useTheme()

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute()

  function handleTwitchButton() {
    navigation.navigate('twitch')
  }

  const isScreenTwitch = route.name === 'twitch'

  return (
    <Box pt={2} pb={6}>
      <HStack
        justifyContent={'center'}
        alignItems={'center'}
        space={2}
        position={'relative'}
      >
        <Image source={LogoSvg} alt={'Logo'} w={8} h={8} resizeMode="cover" />
        <Heading color={'white'} fontSize={'lg'}>
          DOTA TOOLS
        </Heading>
        <Pressable onPress={handleTwitchButton} position={'absolute'} right={0}>
          <FontAwesome
            name="twitch"
            size={24}
            color={isScreenTwitch ? colors.purple[500] : colors.gray[400]}
          />
        </Pressable>
      </HStack>
    </Box>
  )
}

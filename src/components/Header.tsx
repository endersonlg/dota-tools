import { Box, HStack, Image, Text } from 'native-base'

import LogoSvg from '../assets/logo.png'

export function Header() {
  return (
    <Box paddingY={2}>
      <HStack justifyContent={'center'} alignItems={'center'} space={2}>
        <Image source={LogoSvg} alt={'Logo'} w={8} h={8} resizeMode="cover" />
        <Text color={'white'} fontSize={'lg'}>
          DOTA TOOLS
        </Text>
      </HStack>
    </Box>
  )
}

import { Center, Image, IImageProps } from 'native-base'

import techies from '../assets/techies.gif'

export function TechiesLoading({ ...rest }: IImageProps) {
  return (
    <Center flex={1}>
      <Image source={techies} alt="techies dancing" {...rest} />
    </Center>
  )
}

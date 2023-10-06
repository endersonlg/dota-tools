import { Box, HStack, Image } from 'native-base'
import { TouchableOpacity } from 'react-native'
import Animated, { BounceIn, BounceOut } from 'react-native-reanimated'
import { MaterialIcons } from '@expo/vector-icons'
import { HeroWithPercentages } from '..'

const BoxAnimated = Animated.createAnimatedComponent(Box)

interface SelectedHeroesProps {
  selectedHeroes: HeroWithPercentages[]
  removeSelectedHero: (hero: HeroWithPercentages) => void
}

export function SelectedHeroes({
  selectedHeroes,
  removeSelectedHero,
}: SelectedHeroesProps) {
  function handleRemoveHero(hero: HeroWithPercentages) {
    removeSelectedHero(hero)
  }

  return (
    <HStack space={'2'} bg={'gray.600'} p={4} rounded={'md'} mb={6}>
      {selectedHeroes.map((hero) => (
        <BoxAnimated
          flex={1}
          position={'relative'}
          key={`${hero.name}-box`}
          entering={BounceIn}
          exiting={BounceOut}
        >
          <Box
            h={12}
            overflow={'hidden'}
            borderWidth={1}
            borderColor={'gray.500'}
            rounded={'sm'}
            bg={'gray.700'}
          >
            <Image
              source={{
                uri: hero.avatar,
                height: 12 * 4,
              }}
              h={12}
              resizeMode="cover"
              alt={hero.name}
            />
          </Box>
          <Box
            position={'absolute'}
            top={-6}
            right={-6}
            bg={'red.500'}
            h={5}
            w={5}
            rounded={'full'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <TouchableOpacity onPress={() => handleRemoveHero(hero)}>
              <MaterialIcons name="delete" size={14} color={'white'} />
            </TouchableOpacity>
          </Box>
        </BoxAnimated>
      ))}
      {Array.from({ length: 5 - selectedHeroes.length }).map((_, index) => (
        <Box
          flex={1}
          h={12}
          overflow={'hidden'}
          borderWidth={1}
          borderColor={'gray.500'}
          rounded={'sm'}
          bg={'gray.700'}
          key={`empty-box-${index}`}
        ></Box>
      ))}
    </HStack>
  )
}

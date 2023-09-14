import { Box, Image } from 'native-base'

interface MedalProps {
  medal: string | null
  stars: string | null
}

export function Medal({ medal, stars }: MedalProps) {
  const hasMedalAndStars = medal && stars

  const medalPNG = `https://www.opendota.com/assets/images/dota2/rank_icons/rank_icon_${
    hasMedalAndStars ? medal : 0
  }.png`

  const starsPNG = hasMedalAndStars
    ? `https://www.opendota.com/assets/images/dota2/rank_icons/rank_star_${stars}.png`
    : null

  return (
    <Box position={'relative'} w={20} h={20}>
      <Image
        source={{
          uri: medalPNG,
        }}
        alt="medal"
        w={20}
        h={20}
      />

      {starsPNG && (
        <Image
          source={{
            uri: 'https://www.opendota.com/assets/images/dota2/rank_icons/rank_star_1.png',
          }}
          alt="medal"
          w={20}
          h={20}
          position={'absolute'}
          top={0}
        />
      )}
    </Box>
  )
}

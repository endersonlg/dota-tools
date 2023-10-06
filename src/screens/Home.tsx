import { HStack, Heading, Image, SearchIcon, VStack } from 'native-base'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '../components/Input'
import { Button } from '../components/Button'

import LogoSvg from '../assets/logo.png'
import { useNavigation } from '@react-navigation/native'
import { AppStackNavigatorRoutesProps } from '../routes/user.routes'
import { useTranslation } from 'react-i18next'

const homeSchema = z.object({
  search: z
    .string({
      required_error: 'Required field',
    })
    .trim()
    .min(3, { message: 'Must be 3 or more characters' }),
})

type HomeSchema = z.infer<typeof homeSchema>

export function Home() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<HomeSchema>({
    resolver: zodResolver(homeSchema),
  })

  const { t } = useTranslation()

  const navigation = useNavigation<AppStackNavigatorRoutesProps>()

  function handleSearch({ search }: HomeSchema) {
    navigation.navigate('listUsers', {
      search,
    })
  }

  return (
    <VStack flex={1} alignItems={'center'} justifyContent={'center'}>
      <Image
        source={LogoSvg}
        alt={'Logo'}
        w={16}
        h={16}
        resizeMode="cover"
        mb={2}
      />
      <Heading color={'white'} fontSize={'2xl'} mb={6}>
        DOTA TOOLS
      </Heading>
      <HStack space={2}>
        <Controller
          control={control}
          name="search"
          render={({ field: { onChange, value } }) => (
            <Input
              flex={1}
              placeholder={t('type_your_account')}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.search?.message}
              returnKeyType="send"
              onSubmitEditing={handleSubmit(handleSearch)}
            />
          )}
        />
        <Button w={12} onPress={handleSubmit(handleSearch)} disabled={!isValid}>
          <SearchIcon size={6} color={isValid ? 'gray.200' : 'gray.400'} />
        </Button>
      </HStack>
    </VStack>
  )
}

import {
  Input as NativeBaseInput,
  IInputProps,
  FormControl,
  useTheme,
} from 'native-base'

type Props = IInputProps & {
  errorMessage?: string | null
}

export function Input({
  errorMessage = null,
  isInvalid,
  flex,
  ...rest
}: Props) {
  const invalid = !!errorMessage || isInvalid

  const { colors } = useTheme()

  return (
    <FormControl isInvalid={invalid} flex={flex} position={'relative'}>
      <NativeBaseInput
        variant={'outline'}
        borderColor={'gray.500'}
        backgroundColor="rgba(255, 255, 255, 0.1)"
        h={12}
        color={'gray.200'}
        placeholderTextColor={'gray.300'}
        fontSize={'md'}
        fontFamily={'body'}
        cursorColor={colors.gray[200]}
        _focus={{
          borderColor: 'gray.400',
        }}
        {...rest}
      />

      <FormControl.ErrorMessage
        position={'absolute'}
        bottom={'-20px'}
        _text={{ color: 'red.500' }}
      >
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}

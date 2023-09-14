import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base'
import { ReactNode } from 'react'

type Props = IButtonProps & {
  title?: string
  children: ReactNode
}

export function Button({ title, children, disabled, ...rest }: Props) {
  return (
    <NativeBaseButton
      variant={'outline'}
      w="full"
      borderColor={disabled ? 'gray.600' : 'gray.500'}
      rounded={'sm'}
      _pressed={{
        borderColor: 'red.800',
        bg: 'red.600',
      }}
      disabled={disabled}
      {...rest}
    >
      {title && <Text color={'white'}>{title}</Text>}
      {children}
    </NativeBaseButton>
  )
}

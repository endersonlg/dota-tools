import { Spinner, Center, ISpinnerProps } from 'native-base'

export function Loading({ ...rest }: ISpinnerProps) {
  return (
    <Center flex={1}>
      <Spinner color={'gray.300'} {...rest} />
    </Center>
  )
}

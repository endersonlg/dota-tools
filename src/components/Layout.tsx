import { Box } from 'native-base'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box
      flex={1}
      p={8}
      // bg={{
      //   // linearGradient: {
      //   //   colors: ['gray.800', 'gray.700'],
      //   //   start: [1, 1],
      //   //   end: [1, 0],
      //   // },
      // }}
      bg={'gray.700'}
    >
      {children}
    </Box>
  )
}

import { Box } from 'native-base'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box
      flex={1}
      px={8}
      safeArea
      bg={{
        linearGradient: {
          colors: ['gray.800', 'gray.700'],
          start: [1, 1],
          end: [1, 0],
        },
      }}
    >
      {children}
    </Box>
  )
}

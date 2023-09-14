import { extendTheme } from 'native-base'

export const THEME = extendTheme({
  colors: {
    gray: {
      800: '#08090A',
      700: '#1b1f22',
      600: '#2D3439',
      500: '#3F4950',
      400: '#515E67',
      300: '#8D9BA5',
      200: '#C6CDD2',
      100: '#F4F5F6',
    },
    white: '#FFFFFF',
  },
  fonts: {
    heading: 'Roboto_700Bold',
    body: 'Roboto_400Regular',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },
  components: {
    Skeleton: {
      defaultProps: {
        startColor: 'gray.500',
        endColor: 'gray.600',
      },
    },
    SkeletonText: {
      defaultProps: {
        startColor: 'gray.500',
        endColor: 'gray.600',
      },
    },
    Divider: {
      defaultProps: {
        bg: 'gray.600',
      },
    },
  },
})

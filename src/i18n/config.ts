import i18n from 'i18next'

import { initReactI18next } from 'react-i18next'

import enUSTranslations from './translations/en-US.json'
import ptUSTranslations from './translations/pt-BR.json'

i18n
  .use(initReactI18next)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      'en-US': {
        translation: enUSTranslations,
      },
      'pt-BR': {
        translation: ptUSTranslations,
      },
    },
    lng: 'pt-BR', // Idioma padrão
    fallbackLng: 'en-US', // Idioma de fallback
  })

export default i18n

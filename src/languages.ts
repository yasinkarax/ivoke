// The product is language agnostic. This local prototype contains five pictured
// concepts in these languages; additional vocabulary needs a translation service.
export const languages = [
  { code: 'en', name: 'English', nativeName: 'English', speechTag: 'en-US', direction: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', speechTag: 'es-ES', direction: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', speechTag: 'tr-TR', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', speechTag: 'fr-FR', direction: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', speechTag: 'de-DE', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', speechTag: 'ar-SA', direction: 'rtl' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', speechTag: 'it-IT', direction: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', speechTag: 'pt-PT', direction: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', speechTag: 'ru-RU', direction: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', speechTag: 'ja-JP', direction: 'ltr' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', speechTag: 'zh-CN', direction: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', speechTag: 'ko-KR', direction: 'ltr' },
] as const

export type Language = (typeof languages)[number]
export type LanguageCode = Language['code']

export function isLanguageCode(value: unknown): value is LanguageCode {
  return languages.some((language) => language.code === value)
}

export function getLanguage(code: LanguageCode): Language {
  return languages.find((language) => language.code === code)!
}

export function getDeviceLanguage(locales: readonly string[]): LanguageCode {
  for (const locale of locales) {
    const code = locale.toLowerCase().split('-')[0]
    if (isLanguageCode(code)) return code
  }
  return 'en'
}

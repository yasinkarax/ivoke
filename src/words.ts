import { languages, type LanguageCode } from './languages'

export type WordTerm = { text: string; pronunciation?: string }

// A word entry represents a pictured concept, with a term for each demo language.
// Any pair of these languages works in either direction, without an English pivot
// in the interface. This is a curated demo, not a general translation dictionary.
export type Word = {
  id: string
  category: string
  image: string
  thumbnail: string
  memory: string
  terms: Record<LanguageCode, WordTerm>
}

export const sampleWord: Word = {
  id: 'cloud', category: 'noun · nature',
  image: '/assets/cloud.jpg', thumbnail: '/assets/cloud.jpg', memory: 'Growing',
  terms: {
    en: { text: 'cloud', pronunciation: '/klaʊd/' },
    es: { text: 'nube' },
    tr: { text: 'bulut' },
    fr: { text: 'nuage' },
    de: { text: 'Wolke' },
    ar: { text: 'سحابة' },
    it: { text: 'nuvola' },
    pt: { text: 'nuvem' },
    ru: { text: 'облако' },
    ja: { text: '雲' },
    zh: { text: '云' },
    ko: { text: '구름' },
  },
}

export const defaultSavedWordIds = ['apricot', 'ripple', 'bloom', 'pebble']

export const words: Word[] = [
  {
    id: 'apricot', category: 'noun · food & nature',
    image: '/assets/apricot.jpg', thumbnail: '/assets/collection-apricot.jpg', memory: 'Growing',
    terms: {
      en: { text: 'apricot', pronunciation: '/ˈeɪ.prɪ.kɒt/' },
      es: { text: 'albaricoque' },
      tr: { text: 'kayısı' },
      fr: { text: 'abricot' },
      de: { text: 'Aprikose' },
      ar: { text: 'مشمش' },
      it: { text: 'albicocca' },
      pt: { text: 'damasco' },
      ru: { text: 'абрикос' },
      ja: { text: '杏' },
      zh: { text: '杏' },
      ko: { text: '살구' },
    },
  },
  {
    id: 'ripple', category: 'noun · nature',
    image: '/assets/ripple.jpg', thumbnail: '/assets/ripple.jpg', memory: 'Rooted in memory',
    terms: {
      en: { text: 'ripple', pronunciation: '/ˈrɪp.əl/' },
      es: { text: 'onda' },
      tr: { text: 'dalgacık' },
      fr: { text: 'ondulation' },
      de: { text: 'Kräuselung' },
      ar: { text: 'تموج' },
      it: { text: 'increspatura' },
      pt: { text: 'ondulação' },
      ru: { text: 'рябь' },
      ja: { text: 'さざ波' },
      zh: { text: '涟漪' },
      ko: { text: '잔물결' },
    },
  },
  {
    id: 'bloom', category: 'verb · nature',
    image: '/assets/bloom.jpg', thumbnail: '/assets/bloom.jpg', memory: 'Rooted in memory',
    terms: {
      en: { text: 'bloom', pronunciation: '/bluːm/' },
      es: { text: 'florecer' },
      tr: { text: 'çiçek açmak' },
      fr: { text: 'fleurir' },
      de: { text: 'blühen' },
      ar: { text: 'يزهر' },
      it: { text: 'fiorire' },
      pt: { text: 'florescer' },
      ru: { text: 'цвести' },
      ja: { text: '咲く' },
      zh: { text: '开花' },
      ko: { text: '꽃피다' },
    },
  },
  {
    id: 'pebble', category: 'noun · nature',
    image: '/assets/pebble.jpg', thumbnail: '/assets/pebble.jpg', memory: 'Rooted in memory',
    terms: {
      en: { text: 'pebble', pronunciation: '/ˈpeb.əl/' },
      es: { text: 'guijarro' },
      tr: { text: 'çakıl taşı' },
      fr: { text: 'galet' },
      de: { text: 'Kieselstein' },
      ar: { text: 'حصاة' },
      it: { text: 'ciottolo' },
      pt: { text: 'seixo' },
      ru: { text: 'камешек' },
      ja: { text: '小石' },
      zh: { text: '鹅卵石' },
      ko: { text: '조약돌' },
    },
  },
  sampleWord,
]

export function getTerm(word: Word, language: LanguageCode): WordTerm {
  return word.terms[language]
}

function normalizeTerm(value: string, language: LanguageCode): string {
  return value.normalize('NFKC').trim().replace(/\s+/gu, ' ')
    .toLocaleLowerCase(language)
    // Arabic vowel marks and decorative elongation do not change the lookup.
    .replace(/[\u0640\u064B-\u065F\u0670]/gu, '')
}

export function findWord(value: string, language: LanguageCode): Word | undefined {
  const query = normalizeTerm(value, language)
  return words.find((word) => normalizeTerm(getTerm(word, language).text, language) === query)
}

export function findWordInAnyLanguage(
  value: string,
  preferredLanguage?: LanguageCode,
): { word: Word; language: LanguageCode } | undefined {
  if (preferredLanguage) {
    const word = findWord(value, preferredLanguage)
    if (word) return { word, language: preferredLanguage }
  }

  for (const { code } of languages) {
    if (code === preferredLanguage) continue
    const word = findWord(value, code)
    if (word) return { word, language: code }
  }

  return undefined
}

export function listWordExamples(language: LanguageCode): string {
  return words.map((word) => getTerm(word, language).text).join(', ')
}

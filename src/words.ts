export type Word = {
  id: string
  english: string
  spanish: string
  pronunciation: string
  category: string
  image: string
  thumbnail: string
  memory: string
}

export const sampleWord: Word = {
  id: 'cloud', english: 'cloud', spanish: 'nube',
  pronunciation: '/klaʊd/', category: 'noun · nature',
  image: '/assets/cloud.jpg', thumbnail: '/assets/cloud.jpg', memory: 'Growing',
}

export const defaultSavedWordIds = ['apricot', 'ripple', 'bloom', 'pebble']

export const words: Word[] = [
  {
    id: 'apricot', english: 'apricot', spanish: 'albaricoque',
    pronunciation: '/ˈeɪ.prɪ.kɒt/', category: 'noun · food & nature',
    image: '/assets/apricot.jpg', thumbnail: '/assets/collection-apricot.jpg', memory: 'Growing',
  },
  {
    id: 'ripple', english: 'ripple', spanish: 'onda',
    pronunciation: '/ˈrɪp.əl/', category: 'noun · nature',
    image: '/assets/ripple.jpg', thumbnail: '/assets/ripple.jpg', memory: 'Rooted in memory',
  },
  {
    id: 'bloom', english: 'bloom', spanish: 'florecer',
    pronunciation: '/bluːm/', category: 'verb · nature',
    image: '/assets/bloom.jpg', thumbnail: '/assets/bloom.jpg', memory: 'Rooted in memory',
  },
  {
    id: 'pebble', english: 'pebble', spanish: 'guijarro',
    pronunciation: '/ˈpeb.əl/', category: 'noun · nature',
    image: '/assets/pebble.jpg', thumbnail: '/assets/pebble.jpg', memory: 'Rooted in memory',
  },
  sampleWord,
]

export function findWord(value: string): Word | undefined {
  return words.find((word) => word.english === value.trim().toLowerCase())
}

import { useEffect, useMemo, useState } from 'react'
import { defaultSavedWordIds, findWordInAnyLanguage, getTerm, listWordExamples, sampleWord, words, type Word } from './words'
import { getDeviceLanguage, getLanguage, type LanguageCode } from './languages'

type View = 'home' | 'discover' | 'words'
type Filter = 'all' | 'growing' | 'rooted'
type LanguagePair = { source: LanguageCode; target: LanguageCode }

const icon = (name: string, className = '') => (
  <img className={className} src={`/assets/${name}.svg`} alt="" aria-hidden="true" />
)

function loadSaved(): string[] {
  try {
    const value = localStorage.getItem('ivoke-saved')
    return value ? JSON.parse(value) as string[] : defaultSavedWordIds
  } catch {
    return defaultSavedWordIds
  }
}

function Brand({ desktop = false }: { desktop?: boolean }) {
  return <div className={`brand ${desktop ? 'brand-desktop' : ''}`}>
    {desktop ? <span className="desktop-logo-mark">{icon('logo-desktop')}</span> : icon('logo-mobile')}
    <span>ivoke</span>
  </div>
}

function SpeakButton({ word, language, small = false, mobile = false }: { word: Word, language: LanguageCode, small?: boolean, mobile?: boolean }) {
  const term = getTerm(word, language)
  function speak() {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(term.text)
    utterance.lang = getLanguage(language).speechTag
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }
  return <button type="button" className={`speak-button ${small ? 'small' : ''}`} onClick={speak} aria-label={`Hear ${term.text} pronounced in ${getLanguage(language).name}`} title="Hear pronunciation">
    {icon(small ? (mobile ? 'volume-tile' : 'volume-tile-desktop') : mobile ? 'volume-mobile' : 'volume')}
  </button>
}

function TranslationAction({ word, target, revealed, onReveal, mobile = false }: { word: Word, target: LanguageCode, revealed: boolean, onReveal: () => void, mobile?: boolean }) {
  const language = getLanguage(target)
  return <div className="translation-area">
    <p className="translation-guidance">A picture first. A connection that lasts.</p>
    {revealed ? <div className="translation-reveal" role="status" aria-live="polite">
      <span>{language.name} translation</span>
      <strong lang={target} dir={language.direction}>{getTerm(word, target).text}</strong>
      <button type="button" onClick={onReveal}>Hide translation</button>
    </div> : <button type="button" className="primary-button" onClick={onReveal}>
      <span>Show translation</span>{icon(mobile ? 'arrow-right-mobile' : 'arrow-right')}
    </button>}
    {mobile && !revealed && <p className="translation-caption">Translation is hidden until you’re ready.</p>}
  </div>
}

function Lesson({ word, pair, revealed, onReveal, saved, onSave, onBack, mobile = false }: {
  word: Word, pair: LanguagePair, revealed: boolean, onReveal: () => void, saved: boolean, onSave: () => void, onBack?: () => void, mobile?: boolean
}) {
  const term = getTerm(word, pair.source)
  const language = getLanguage(pair.source)
  return <section className={`lesson ${mobile ? 'lesson-mobile' : 'lesson-desktop'}`} aria-label={`${term.text} image-first lesson`}>
    <div className="lesson-image">
      <img src={word.image} alt={`Picture illustrating ${term.text}`} />
      {mobile && <>
        <div className="image-top-fade" />
        <div className="lesson-topbar">
          <button type="button" className="round-button" onClick={onBack} aria-label="Back to home">{icon('arrow-left')}</button>
          <span className="language-pill">See it. Imagine it.</span>
          <button type="button" className={`round-button ${saved ? 'is-saved' : ''}`} onClick={onSave} aria-label={saved ? 'Remove from collection' : 'Save to collection'}>{icon('bookmark-mobile')}</button>
        </div>
      </>}
      {mobile && <div className="observation-cue">{icon('scan-eye-lesson')}<span>Look closely. Let the image sink in.</span></div>}
    </div>
    <div className="lesson-details">
      <div className="word-block">
        <div className="word-kicker">
          <span>SEE IT. KNOW IT.</span>
          {mobile ? <span>{word.category}</span> : <button type="button" className={`desktop-bookmark ${saved ? 'is-saved' : ''}`} onClick={onSave} aria-label={saved ? 'Remove from collection' : 'Save to collection'}>{icon('bookmark')}</button>}
        </div>
        {!mobile && <p className="desktop-category">{word.category}</p>}
        {mobile ? <>
          <div className="word-title-row"><h2 lang={pair.source} dir={language.direction}>{term.text}</h2><SpeakButton word={word} language={pair.source} mobile /></div>
          {term.pronunciation && <p className="pronunciation">{term.pronunciation}</p>}
        </> : <>
          <h2 className="desktop-word-title" lang={pair.source} dir={language.direction}>{term.text}</h2>
          <div className="desktop-pronunciation"><SpeakButton word={word} language={pair.source} />{term.pronunciation && <p className="pronunciation">{term.pronunciation}</p>}</div>
          <p className="saved-status">{saved ? <>{icon('check')} Saved to your word collection</> : 'Save this word to your collection'}</p>
        </>}
      </div>
      <TranslationAction word={word} target={pair.target} revealed={revealed} onReveal={onReveal} mobile={mobile} />
    </div>
  </section>
}

function Collection({ savedIds, language, onSelect, mobile = false }: { savedIds: string[], language: LanguageCode, onSelect: (word: Word) => void, mobile?: boolean }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [searching, setSearching] = useState(false)
  const [search, setSearch] = useState('')
  const savedWords = words.filter((word) => savedIds.includes(word.id))
  const filtered = savedWords.filter((word) => {
    const matchesFilter = filter === 'all' || (filter === 'growing' ? word.memory === 'Growing' : word.memory !== 'Growing')
    return matchesFilter && getTerm(word, language).text.normalize('NFKC').toLocaleLowerCase(language).includes(search.normalize('NFKC').toLocaleLowerCase(language).trim())
  })

  return <section className={`collection ${mobile ? 'collection-mobile' : 'collection-desktop'}`} aria-label="Word collection">
    {!mobile && <div className="collection-heading">
      <h2>Word collection <span>{savedWords.length}</span></h2>
      <button type="button" className="search-button" onClick={() => { setSearching(!searching); setSearch('') }} aria-label={searching ? 'Close search' : 'Search collection'}>{icon('search')}</button>
    </div>}
    {searching && <input className="collection-search" autoFocus type="search" lang={language} dir={getLanguage(language).direction} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your words" aria-label="Search your words" />}
    <div className="filter-row" role="group" aria-label="Filter words">
      <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All words</button>
      <button className={filter === 'growing' ? 'active' : ''} onClick={() => setFilter('growing')}>Growing · {savedWords.filter((word) => word.memory === 'Growing').length}</button>
      <button className={filter === 'rooted' ? 'active' : ''} onClick={() => setFilter('rooted')}>Rooted · {savedWords.filter((word) => word.memory !== 'Growing').length}</button>
    </div>
    {filtered.length ? <div className="word-grid">
      {filtered.map((word) => <div className="word-tile" key={word.id}>
        <button type="button" className="tile-open" onClick={() => onSelect(word)} aria-label={`Open ${getTerm(word, language).text} lesson`}>
          <img src={word.thumbnail} alt="" />
          <span className="tile-copy"><strong lang={language} dir={getLanguage(language).direction}>{getTerm(word, language).text}</strong><small>{word.memory}</small></span>
        </button>
        <SpeakButton word={word} language={language} small mobile={mobile} />
      </div>)}
    </div> : <div className="empty-collection">{savedWords.length ? 'No words match this filter.' : 'Save a word from a lesson to see it here.'}</div>}
    {!mobile && <button type="button" className="view-all" onClick={() => { setFilter('all'); setSearching(true); setSearch('') }}>View all {savedWords.length} words {icon('arrow-link')}</button>}
  </section>
}

function BottomNav({ view, onNavigate }: { view: View, onNavigate: (view: View) => void }) {
  const tabs: { view: View, label: string, image: string }[] = [
    { view: 'home', label: 'Home', image: view === 'home' ? 'home' : 'home-inactive' },
    { view: 'words', label: 'Mind', image: view === 'words' ? 'brain-active' : 'brain-inactive' },
  ]
  return <nav className="bottom-nav" aria-label="Main navigation">
    <div className="bottom-tabs">{tabs.map((tab) => <button type="button" key={tab.view} onClick={() => onNavigate(tab.view)} className={view === tab.view ? 'active' : ''} aria-current={view === tab.view ? 'page' : undefined}>
      <span className="nav-icon">{icon(tab.image, tab.view === 'words' ? 'nav-brain' : '')}</span><span>{tab.label}</span>
    </button>)}</div>
    <div className="home-indicator" aria-hidden="true"><span /></div>
  </nav>
}

function ImagePreview({ word, language, isSample, onOpen }: { word: Word, language: LanguageCode, isSample: boolean, onOpen: () => void }) {
  const term = getTerm(word, language)
  return <section className="sample-translation" aria-label={isSample ? 'Sample translation' : 'Word image'}>
    <div className="sample-header">
      <span>{isSample ? 'SAMPLE TRANSLATION' : 'YOUR WORD IMAGE'}</span>
      <span className="sample-badge">Image-first</span>
    </div>
    <button type="button" className="sample-image-card" onClick={onOpen} aria-label={`Explore ${term.text}. See the image before the translation.`}>
      <img src={word.thumbnail} alt={`Picture illustrating ${term.text}`} />
    </button>
  </section>
}

export default function App() {
  const [deviceLanguage] = useState(() => getDeviceLanguage(navigator.languages))
  const [view, setView] = useState<View>('home')
  const [input, setInput] = useState(() => window.innerWidth >= 900 ? getTerm(words[0], deviceLanguage).text : '')
  const [activeId, setActiveId] = useState('apricot')
  const [activeSource, setActiveSource] = useState<LanguageCode>(deviceLanguage)
  const [revealed, setRevealed] = useState(false)
  const [savedIds, setSavedIds] = useState(loadSaved)
  const [inputError, setInputError] = useState('')
  const activeWord = words.find((word) => word.id === activeId) ?? words[0]
  const match = useMemo(() => findWordInAnyLanguage(input, deviceLanguage), [input, deviceLanguage])
  const matchedWord = match?.word
  const pair: LanguagePair = { source: match?.language ?? deviceLanguage, target: deviceLanguage }
  const previewWord = matchedWord ?? sampleWord
  const sourceLanguage = getLanguage(pair.source)
  const examples = listWordExamples(deviceLanguage)

  useEffect(() => { localStorage.setItem('ivoke-saved', JSON.stringify(savedIds)) }, [savedIds])
  function openWord(word: Word, language: LanguageCode = pair.source) {
    setActiveId(word.id)
    setActiveSource(language)
    setInput(getTerm(word, language).text)
    setRevealed(false)
    setView('discover')
    setInputError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function submitWord() {
    if (matchedWord) openWord(matchedWord)
    else setInputError(`Try one of the sample words: ${examples}.`)
  }

  function changeInput(value: string) {
    setInput(value)
    setInputError('')
    const nextMatch = findWordInAnyLanguage(value, deviceLanguage)
    if (nextMatch) { setActiveId(nextMatch.word.id); setActiveSource(nextMatch.language); setRevealed(false) }
  }

  function toggleSave() {
    setSavedIds((current) => current.includes(activeWord.id) ? current.filter((id) => id !== activeWord.id) : [...current, activeWord.id])
  }

  function navigate(next: View) {
    setView(next)
    setRevealed(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return <div className="app-shell">
    <header className="desktop-header"><Brand desktop /><span className="desktop-account">Image-first learning</span></header>

    <main className="desktop-workspace">
      <div className="desktop-primary">
        <div className="desktop-intro"><h1>Start with a word.</h1><p>See the meaning. Make the connection.</p></div>
        <form className="desktop-entry" onSubmit={(event) => { event.preventDefault(); submitWord() }}>
          <label><span>TYPE A WORD</span><input lang={pair.source} dir="auto" value={input} onChange={(event) => changeInput(event.target.value)} placeholder={`e.g. ${getTerm(words[0], deviceLanguage).text}`} autoComplete="off" /></label>
          <span className="source-language">{match ? sourceLanguage.name : 'Auto-detect'}</span>
          {input && <button type="button" className="clear-input" onClick={() => changeInput('')} aria-label="Clear word">{icon('x')}</button>}
        </form>
        <div className="entry-hint">{icon('layers')}<span>Images appear automatically as you type. No searching, just seeing.</span></div>
        {inputError && <p className="input-error" role="alert">{inputError}</p>}
        {matchedWord ? <Lesson word={matchedWord} pair={pair} revealed={revealed} onReveal={() => setRevealed(!revealed)} saved={savedIds.includes(matchedWord.id)} onSave={toggleSave} /> : <div className="desktop-empty"><strong>Picture a word.</strong><p>Try one of the sample words: {examples}.</p></div>}
      </div>
      <aside className="desktop-sidebar">
        <div className="sidebar-intro"><h2>Your mind in pictures.</h2></div>
        <Collection savedIds={savedIds} language={deviceLanguage} onSelect={(word) => openWord(word, deviceLanguage)} />
      </aside>
    </main>

    <div className="mobile-app">
      {view === 'home' && <>
        <div className="mobile-home-content">
          <Brand />
          <section className="mobile-entry-section">
            <div className="section-heading"><strong>Start with a word</strong><span>Image-first learning</span></div>
            <div className="entry-card">
              <div className="entry-prompt"><span className="eyebrow">TYPE A WORD</span><h1>What do you want to learn?</h1></div>
              <form onSubmit={(event) => { event.preventDefault(); submitWord() }}>
                <label className="mobile-input"><span>WORD</span><input lang={pair.source} dir="auto" value={input} onChange={(event) => changeInput(event.target.value)} placeholder={`e.g. ${getTerm(sampleWord, deviceLanguage).text}`} autoComplete="off" /></label>
              </form>
              <div className="mobile-entry-guidance"><span className="guidance-icon">{icon('information')}</span><p>Type a word and the image appears automatically to show its meaning.</p></div>
            </div>
            {inputError && <p className="input-error" role="alert">{inputError}</p>}
            <ImagePreview word={previewWord} language={pair.source} isSample={!matchedWord} onOpen={() => openWord(previewWord)} />
            {!matchedWord && input.trim() && <p className="available-words">Sample words: {words.map((word) => <button key={word.id} lang={deviceLanguage} dir={getLanguage(deviceLanguage).direction} onClick={() => changeInput(getTerm(word, deviceLanguage).text)}>{getTerm(word, deviceLanguage).text}</button>)}</p>}
          </section>
        </div>
        <BottomNav view={view} onNavigate={navigate} />
      </>}
      {view === 'discover' && <Lesson word={activeWord} pair={{ source: activeSource, target: deviceLanguage }} revealed={revealed} onReveal={() => setRevealed(!revealed)} saved={savedIds.includes(activeWord.id)} onSave={toggleSave} onBack={() => navigate('home')} mobile />}
      {view === 'words' && <>
        <div className="mobile-collection-content">
          <div className="mobile-collection-intro"><span>GROWING, ONE IMAGE AT A TIME</span><h1>Your mind in pictures.</h1></div>
          <Collection savedIds={savedIds} language={deviceLanguage} onSelect={(word) => openWord(word, deviceLanguage)} mobile />
        </div>
        <BottomNav view={view} onNavigate={navigate} />
      </>}
    </div>
  </div>
}

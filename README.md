# ivoke

**Imagine the meaning. Then reveal the translation.**

ivoke is a vocabulary learning app intended for people learning any language. It shows a picture of a word's meaning first, giving the learner time to form a mental image and make their own connection. The translated text appears only when the learner asks for it.

The primary experience is on mobile, with a responsive browser layout. The interface follows the supplied Figma design, using mint and teal colors, Inter typography, and a thought-cloud logo.

## Learning flow

1. **Enter a word.** A matching picture appears automatically.
2. **Imagine its meaning.** Open the picture, study it, and make the connection before reading translated text. Pronunciation is available through the speaker button.
3. **Reveal when ready.** Press **Show translation** to see the meaning in the translation language. Each newly opened word starts with its translation hidden.
4. **Keep the connection.** Bookmark the word to revisit it in **Mind**.

The interface has no language-pair selector or daily goal counter.

## Current prototype

The product's scope is learning across all languages. This local prototype demonstrates the experience with **five pictured concepts in 12 languages**; full language coverage is still to be implemented.

The concepts are **cloud**, **apricot**, **ripple**, **bloom** (the verb), and **pebble**. Their demo vocabulary spans multiple languages and writing systems. The current demo language catalog is defined in `src/languages.ts`.

- **Automatic recognition:** entering a known sample word opens its underlying pictured concept. Words with the same meaning share the same image across languages.
- **Translation language:** the app uses the first supported language in the browser's language preferences, or the prototype's default fallback when none matches. If the entered word is already in that language, revealing it shows the same term.
- **Pronunciation and scripts:** speech uses the recognized source language. Vocabulary text supports left-to-right and right-to-left writing systems. Interface localization remains future work.
- **Collection:** four concepts start saved; cloud can be added with its bookmark. Saved concepts remain in this browser's local storage. Memory filters work on both layouts, and desktop also has collection search.

On mobile, tap a picture preview or press Enter to open a lesson. The sample cloud card also opens a lesson. On desktop, the lesson image updates as you type.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

```bash
npm run build
npm run preview
```

`build` checks TypeScript and generates the production app in `dist/`. `preview` serves that build locally. The web app manifest allows installation in compatible browsers; outside localhost, this requires HTTPS.

## Project structure

- `src/App.tsx` — word entry, image previews, lessons, translation reveal, and collection.
- `src/words.ts` — shared pictured concepts, localized vocabulary, and sample-word recognition.
- `src/languages.ts` — demo languages, speech tags, text directions, and device-language selection.
- `src/styles.css` — responsive layouts, typography, and color tokens.
- `public/assets` — local images, logo, and icons from the Figma design.

The app uses React, TypeScript, and Vite. Inter is bundled through Fontsource.

## What remains for full language coverage

Arbitrary words, broader language coverage, and dynamic image retrieval require live translation and image services. Those services are not connected yet. A service layer will also be needed to keep API keys private and handle failed requests.

Current language recognition looks up the curated vocabulary, so shared spellings can be ambiguous. Pronunciation depends on voices available in the browser. **Growing** and **Rooted** are sample collection labels, not measured recall scores.

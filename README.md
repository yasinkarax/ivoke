# ivoke

An image-first English-to-Spanish word learning prototype based on the supplied Figma design. The mint and teal interface uses a thought-cloud logo to reflect imagining a word's meaning before revealing its translation. The phone layout is the primary experience; the same React app expands into a desktop workspace in a browser. Phones use Home and Mind navigation, and Inter is bundled throughout the app through Fontsource. Daily goal tracking has been removed.

## Run it

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. `npm run build` checks the TypeScript code and creates a production build in `dist/`. The manifest lets compatible mobile browsers add the app to the home screen. Hosting the production build over HTTPS is required for that outside localhost.

## Current learning flow

1. Enter **cloud**, **apricot**, **ripple**, **bloom**, or **pebble**. On a phone, a picture preview appears as soon as the entry matches a pictured word. Tap it or press Enter to open the lesson. The sample cloud card also opens the cloud lesson, whose Spanish translation is **nube**. On desktop, the full image updates as you type.
2. Study the image and English word. The speaker button uses the browser's speech synthesis for pronunciation.
3. Tap **Show translation** to reveal the Spanish word. The translation starts hidden each time a word is opened.
4. Save or remove words with the bookmark button. Mind starts with **apricot**, **ripple**, **bloom**, and **pebble** saved; cloud can be added from its lesson. Filters work on phone and desktop, and the desktop collection also has search. Saved words are stored in this browser's local storage.

The pictured-word images, thought-cloud logo, and UI icons come from the Figma design and are stored in `public/assets`.

## Current limits

This version uses five curated word/image/translation entries. It does not translate arbitrary text or generate images. Adding that requires a translation source, an image source, and a small service layer to protect API keys and handle errors. The Growing and Rooted labels are sample content from the design, not a tested recall score. Pronunciation voices depend on the device and browser.

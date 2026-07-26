# JSON Animation Viewer

JSON Animation Viewer is a bilingual browser tool for previewing and inspecting Lottie JSON files. It combines lottie-web playback with metadata, layer, optimization, static performance, compatibility, background, and starter-code panels.

Production: [json-animation-viewer.com](https://json-animation-viewer.com)

Source: [github.com/byungsker/json-animation-viewer](https://github.com/byungsker/json-animation-viewer)

## Current capabilities

- Select or drag a Lottie-style `.json` file
- Validate the minimum animation structure and report invalid input
- Control play, pause, direction, speed, looping, segments, and frames
- Test transparency against preset, custom-color, or local-image backgrounds
- Inspect dimensions, timing, layers, assets, markers, and file size
- Review documented static performance signals and optimization suggestions
- Flag features that may behave differently on web, iOS, or Android
- Generate starter snippets for common web and mobile runtimes
- Read English or Korean product, guide, methodology, FAQ, legal, and blog pages

The [analysis methodology](https://json-animation-viewer.com/methodology) documents the score inputs, weights, detection rules, and limitations. Results are heuristics, not device benchmarks or runtime certification.

## File-processing boundary

The selected JSON file is parsed in browser memory and is not intentionally uploaded to an application server or stored in a product database. This does not mean the whole page is offline: hosting and advertising code can make network requests, and a JSON file that references external assets can cause the browser to request those assets.

Review the production Privacy Policy and your browser's network panel before using sensitive files.

## Local development

Requirements:

- Node.js 20 or newer
- npm

```bash
git clone https://github.com/byungsker/json-animation-viewer.git
cd json-animation-viewer
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm test
npm run lint
npm run build
npm run audit:routes -- http://localhost:3000
npm run test:e2e
```

## Tech stack

- Next.js and React
- TypeScript
- next-intl
- lottie-web
- Tailwind CSS
- Vitest and Playwright

## Contributing

Open an issue before a substantial change so behavior, scope, and verification can be agreed. Pull requests should include relevant tests and preserve both English and Korean routes.

## License

No project license file is currently included. Public source availability does not by itself grant reuse, modification, or redistribution rights.

---
name: wan-snap-design
description: Use this skill to generate well-branded interfaces and assets for Wan-Snap (ワンスナップ) — a dog-fashion-snap & community app for owners. Contains essential design guidelines, colors, type, fonts, icon set, and full UI kits (mobile + PC) for prototyping or production.
user-invocable: true
---

Read the `README.md` file at the root of this skill, and explore the other available files:

- `colors_and_type.css` — all color + typography CSS variables
- `preview/` — 25 design-system specimen cards (Type / Colors / Spacing / Components / Brand)
- `ui_kits/mobile/` — interactive mobile prototype (17 screens, click-through navigation)
- `ui_kits/pc/` — desktop layouts (6 screens, 3-column 1440×900)
- `tokens.jsx`, `shared.jsx`, `nav.jsx`, `screen-*.jsx`, `pc-*.jsx` — production-ready React components

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for the user to view. Reuse the existing `<Screen>`, `<AppBar>`, `<TabBar>`, `<PCLayout>`, `<DogAvatar>`, `<ItemTag>`, `<FeedCard>`, etc. components rather than rebuilding them.

If working on production code, copy `colors_and_type.css` as the single source of truth for tokens, and read the README to become an expert in this brand.

## Brand essentials (always preserve)

- **Color**: warm cream (#F4EDE0) ベース、ink black 文字、terracotta (#B95A3D) / forest (#3F5A40) / ochre (#B88A3C) のアクセント
- **Type**: Noto Serif JP 見出し + Zen Kaku Gothic New 本文 + JetBrains Mono 数値
- **Imagery**: 4/5 縦長 or 1/1 正方形。写真を主役にUIは脇役
- **Tone**: 大人っぽく温かい日本語。句点「。」をブランドアクセント化
- **No-no**: グラデ多用 / 絵文字濫用 / Helvetica系の冷たい字体 / 子供っぽい配色

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions about audience / surface / variations they want, and act as an expert designer who outputs HTML artifacts or production code, depending on the need.

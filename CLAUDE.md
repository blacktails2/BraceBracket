# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BraceBracket is a Next.js-based tournament scoreboard system for fighting games, designed to integrate with OBS for live streaming. It uses Firebase Realtime Database for synchronization and supports remote editing through Google Sheets.

## Essential Commands

```bash
# Development
yarn dev          # Start development server on localhost:3000
yarn storybook    # Start Storybook on localhost:6006

# Build & Production
yarn build        # Build for production
yarn start        # Start production server

# Code Quality (run before committing)
yarn lint         # Run all linters (ESLint + Stylelint)
yarn lint:next    # ESLint for TypeScript/React
yarn lint:scss    # Stylelint for SCSS
```

## High-Level Architecture

### Core Data Flow
1. **Control Panel** (`/control`) → Firebase Realtime Database → **OBS Overlays** (`/obs/*`)
2. Tournament data stored under `/tournaments/{id}/` in Firebase
3. OBS sources poll Firebase every 3-5 seconds for updates

### Key Component Structure
- **control2/**: Tournament control interface with tabs for Score, MC, Next Match, and Top 8
- **obs/**: OBS overlay components that read from Firebase and auto-update
  - `score/`: Main scoreboard with multiple layout options (Dual, Single, Solid, Simple)
  - `mc/`: Commentator information display
  - `next/`: Next match information
  - `bracket/`: Top 8 bracket visualization

### Firebase Data Model
```
/tournaments/{tournamentId}/
  ├── setting/           # Tournament settings (colors, logos, layout)
  ├── score/            # Current match data (players, scores, round)
  ├── mc/               # Commentator information
  ├── matchIntervalInfo/ # Next match details
  └── loadBracket/      # Bracket structure for Top 8
```

### Styling System
- Uses SCSS Modules (`.module.scss`) for component-specific styles
- Design system variables in base SCSS files (`base.scss`, `normal.scss`, `simple.scss`)
- Tailwind CSS available but primarily uses custom SCSS
- Bulma framework integrated for some components

### State Management
- Custom Firebase hooks in `hooks/` directory handle real-time data synchronization
- No global state management library - relies on Firebase as single source of truth
- Component state managed with React hooks

### Key Technologies
- **Next.js 12.1.6** with TypeScript (strict mode)
- **Firebase Realtime Database** for data persistence
- **React 18.1.0** with functional components
- **SCSS/CSS Modules** for styling
- **Storybook** for component development

### Important Patterns
1. **Data Updates**: Components use `useDatabaseValue` hook to subscribe to Firebase paths
2. **Layout Variants**: Each OBS component supports multiple visual styles selected via settings
3. **Color Customization**: Uses CSS custom properties for dynamic theming
4. **Logo Management**: Supports custom logos stored as base64 in Firebase settings
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- GitHub Actions CI workflow (lint, typecheck, test, build)
- GitHub Actions Docker build and push workflow
- `setup.js` for automated project initialization
- CONTRIBUTING.md with development guide
- Widget dev script in root package.json
- Multi-size favicon.ico (16x16, 32x32) generated from Megh EngageX logo

### Changed
- Improved socket event dispatcher routing with direct Map lookups
- Enhanced dashboard NoDataChart with hint text and larger icon
- Rebranded widget build output: `hexabot-widget.umd.js` → `megh-widget.umd.js`
- Rebranded widget library name: `HexabotWidget` → `MeghWidget`
- Updated backend and widget package.json descriptions to Megh EngageX

### Performance
- Added Handlebars template cache in EnvelopeFactory (max 1000 entries)
- Added RegExp cache in BlockService for pattern matching
- Reused Uint32Array buffer in safeRandom to reduce allocations

### Fixed
- Normalized event paths to prevent duplicate registrations in socket dispatcher

## [2.3.4] - 2026-04-03

### Added
- Migrated to Hexabot open-source chatbot platform
- OpenRouter LLM helper set as default
- Docker Compose setup for local development

### Changed
- Rebranded from Hexabot to Megh EngageX
- Updated color scheme to purple (#7B1FA2) with sky blue gradient

### Fixed
- Resolved TypeScript build errors
- Fixed Docker entry point and port inconsistencies
- Replaced npm ci with npm install in Dockerfiles

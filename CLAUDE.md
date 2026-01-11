# Flag guessing game

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment Overview

This is a **Claude Code Development Sandbox** - a secure, containerized devcontainer environment for Node.js development with Claude Code pre-installed.

## Architecture

- **Base:** Node 20 LTS in Docker container
- **User:** Non-root `node` user for security
- **Shell:** zsh with Powerlevel10k theme, git and fzf plugins
- **Network:** Strict firewall allowing only: GitHub, npm registry, Anthropic API, Sentry, Statsig, VSCode Marketplace

## Key Directories

- `/workspace` - Project workspace (bind mount from host)
- `/home/node/.claude` - Claude Code configuration (persisted volume)
- `/commandhistory` - Shell history (persisted volume)
- `/usr/local/share/npm-global` - Global npm packages
- `src/components/` - React components
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions
- `src/api/` - API client code
- `tests/` - Test files

## Pre-configured Tools

- **Formatting:** Prettier (format on save enabled)
- **Linting:** ESLint (auto-fix on save)
- **Git:** git-delta for diffs, GitLens extension
- **Search:** fzf fuzzy finder

## Container Capabilities

The container has `NET_ADMIN` and `NET_RAW` capabilities for firewall management. The firewall initializes on container start via `postStartCommand`.

## Environment Variables

- `NODE_OPTIONS=--max-old-space-size=4096` (4GB memory limit)
- `DEVCONTAINER=true`
- `CLAUDE_CONFIG_DIR=/home/node/.claude`

## Quick Facts

- **Stack**: React, TypeScript, Node.js
- **Test Command**: `npm test`
- **Lint Command**: `npm run lint`
- **Build Command**: `npm run build`

## Code Style

- TypeScript strict mode enabled
- Prefer `interface` over `type` (except unions/intersections)
- No `any` - use `unknown` instead
- Use early returns, avoid nested conditionals
- Prefer composition over inheritance

## Git Conventions

- **Branch naming**: `{initials}/{description}` (e.g., `jd/fix-login`)
- **Commit format**: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
- **PR titles**: Same as commit format

## Critical Rules

### Error Handling

- NEVER swallow errors silently
- Always show user feedback for errors
- Log errors for debugging

### UI States

- Always handle: loading, error, empty, success states
- Show loading ONLY when no data exists
- Every list needs an empty state

### Mutations

- Disable buttons during async operations
- Show loading indicator on buttons
- Always have onError handler with user feedback

## Testing

- Write failing test first (TDD)
- Use factory pattern: `getMockX(overrides)`
- Test behavior, not implementation
- Run tests before committing

## Skill Activation

Before implementing ANY task, check if relevant skills apply:

- Creating tests → `testing-patterns` skill
- Building forms → `formik-patterns` skill
- GraphQL operations → `graphql-schema` skill
- Debugging issues → `systematic-debugging` skill
- UI components → `react-ui-patterns` skill

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm test             # Run tests
npm run lint         # Run linter
npm run typecheck    # Check types
```

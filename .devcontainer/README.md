# Dev Container Configuration

This directory contains the GitHub Codespaces / VS Code Dev Container configuration for PCS Developer Runtime.

## What This Provides

- **Pre-configured Node.js 20** environment
- **Automatic dependency installation** (`npm install`)
- **Pre-linked CLI** (`npm link` runs automatically)
- **Zero local setup required** - works in browser via GitHub Codespaces

## Usage

### GitHub Codespaces (Recommended)

1. Click "Open in GitHub Codespaces" badge in main README
2. Wait for container to build (~1-2 minutes first time)
3. Set API keys in terminal
4. Start tutorial

### VS Code Local Dev Containers

1. Install "Dev Containers" extension in VS Code
2. Open repository in VS Code
3. Click "Reopen in Container" when prompted
4. Container builds and configures automatically

## Configuration Details

- **Base Image:** `mcr.microsoft.com/devcontainers/javascript-node:20`
- **Post-Create Command:** `npm install && npm link`
- **Extensions:** ESLint, Prettier (optional)
- **User:** `node` (non-root)

## Why This Matters

Eliminates common setup friction:
- ❌ Wrong Node version
- ❌ Missing CLI setup
- ❌ Broken install path
- ❌ Platform-specific issues

Users can reach the tutorial in <2 minutes instead of debugging local environment issues.

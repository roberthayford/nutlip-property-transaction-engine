# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Claude Code - Nutlip Property Transaction Engine

## Project Overview

This is the **Nutlip Property Transaction Engine** - a comprehensive property transaction management platform built with Next.js. The application orchestrates the entire property buying/selling process from initial offer acceptance through to completion, serving multiple stakeholders including buyers, estate agents, and conveyancers.

## Tech Stack

- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Context API + localStorage
- **Real-time**: Custom context with localStorage/sessionStorage sync
- **Package Manager**: Multiple lock files present (yarn.lock, pnpm-lock.yaml); use npm for development commands
- **Font**: Poppins (Google Fonts)

## Architecture Overview

### Core Concepts

1. **Multi-Role System**: Four distinct user roles with role-specific dashboards
   - Buyer (`/buyer`)
   - Estate Agent (`/estate-agent`)
   - Buyer Conveyancer (`/buyer-conveyancer`)
   - Seller Conveyancer (`/seller-conveyancer`)

2. **Transaction Stages**: 12 sequential stages in the property transaction process
   - Each stage has role-specific permissions and functionality
   - Visual progress tracking across all stages

3. **Real-time Collaboration**: Cross-tab synchronization using localStorage events
   - Document sharing between roles
   - Amendment requests and replies
   - Activity feeds and notifications

### Directory Structure

```
/app/                          # Next.js App Router pages
├── [role]/                    # Role-specific page directories
│   ├── [stage]/              # Stage-specific pages
│   └── page.tsx              # Role dashboard
├── layout.tsx                # Root layout with Poppins font
├── page.tsx                  # Homepage with role selection
└── globals.css               # Global styles (forced light mode)

/components/                   # React components
├── ui/                       # shadcn/ui components
├── providers.tsx             # Context providers wrapper
├── transaction-layout.tsx    # Main layout component
├── real-time-*.tsx          # Real-time UI components
└── *-chat.tsx               # Chat components

/contexts/                    # React contexts
└── real-time-context.tsx    # Main state management

/lib/                         # Utilities
└── hooks/                    # Custom hooks
```

### Key Files

- **`/app/layout.tsx`**: Root layout with Poppins font and forced light mode
- **`/contexts/real-time-context.tsx`**: Central state management for documents, amendments, and updates
- **`/components/transaction-layout.tsx`**: Main layout with navigation, progress bar, and role switching
- **`/components/providers.tsx`**: Context providers wrapper
- **`/package.json`**: Dependencies and scripts
- **`/tailwind.config.ts`**: Tailwind configuration with custom colors and Poppins font
- **`/next.config.mjs`**: Next.js configuration (ESLint/TypeScript errors ignored)

## Development Commands

```bash
# Development
npm run dev       # Start development server on localhost:3000

# Production
npm run build     # Build for production
npm run start     # Start production server

# Code Quality
npm run lint      # Run ESLint
```

## Key Features

### 1. Role-Based Access Control
- Each role has specific permissions for each transaction stage
- Dynamic UI based on current user role
- Role switching functionality for testing

### 2. Transaction Stage Management
- 12 predefined stages with icons and descriptions
- Visual progress indicator
- Stage-specific content and permissions
- Status tracking (pending, in-progress, completed)

### 3. Real-time Collaboration
- Document upload/download with status tracking
- Amendment requests with reply system
- Activity feed with role-specific updates
- Cross-tab synchronization using localStorage events

### 4. Responsive Design
- Mobile-first design with responsive breakpoints
- Collapsible mobile navigation
- Adaptive layouts for different screen sizes

### 5. Professional Chat System
- Conveyancer-to-conveyancer messaging
- Estate agent access from Draft Contract stage onwards
- Buyer-Estate agent direct communication
- Chat history persistence

## Data Architecture

### State Management
- **Primary**: React Context API with localStorage persistence
- **Key**: `pte-state-v3` in localStorage
- **Sync**: Cross-tab synchronization via storage events

### Data Models
- **DocumentRecord**: File sharing with status tracking
- **AmendmentRequest**: Legal amendment workflows
- **Update**: Activity feed notifications
- **Role**: User role enumeration
- **StageId**: Transaction stage enumeration

## Styling System

### Design System
- **Primary Theme**: Light mode only (forced)
- **Font**: Poppins (300-700 weights)
- **Colors**: Custom HSL variables via CSS custom properties
- **Components**: shadcn/ui component library
- **Icons**: Lucide React

### CSS Architecture
- **Global**: Tailwind utilities with custom CSS variables
- **Components**: Utility-first with component variants
- **Responsive**: Mobile-first breakpoints
- **Dark Mode**: Explicitly disabled

## Development Notes

### Important Considerations
1. **Light Mode Only**: Dark mode is explicitly disabled in CSS
2. **Error Handling**: ESLint and TypeScript errors are ignored in build (next.config.mjs:3-7)
3. **Image Optimization**: Disabled in Next.js config (next.config.mjs:9-11) 
4. **State Persistence**: All state is stored in localStorage with cross-tab sync
5. **Demo Reset**: Full application reset functionality included
6. **v0.dev Integration**: Project is auto-synced with v0.dev deployments

### Common Patterns
- **Role Detection**: Extracted from URL pathname (`/[role]/[stage]`)
- **Stage Navigation**: Centralized in `transaction-layout.tsx`
- **Real-time Updates**: Context-based with localStorage sync
- **Component Structure**: Functional components with hooks

## Testing & Debugging

### Role Testing
- Use the role switcher in the header to test different user perspectives
- Each role has different permissions and available stages
- URLs follow pattern: `/{role}/{stage}`

### Demo Reset
- "Reset Demo" button clears all application state
- Clears localStorage, sessionStorage, browser cache, and history
- Useful for testing from clean state

## Deployment

- **Platform**: Vercel (configured)
- **Auto-sync**: Connected to v0.dev for automatic deployments
- **Live URL**: Available in README.md

## Future Development

### Extending the System
1. **New Roles**: Add role definitions in `transaction-layout.tsx`
2. **New Stages**: Add stage definitions in `transactionStages` array
3. **New Features**: Use the real-time context for state management
4. **Styling**: Extend the design system via Tailwind config

### File Conventions
- **Pages**: Use Next.js App Router conventions
- **Components**: Functional components with TypeScript
- **Hooks**: Custom hooks in `/lib/hooks/`
- **Utils**: Utility functions in `/lib/utils.ts`

## Getting Started

1. **Install dependencies**: `npm install`
2. **Start development**: `npm run dev`
3. **Open**: `http://localhost:3000`
4. **Select role**: Choose from homepage or navigate directly to `/{role}`
5. **Explore stages**: Navigate through transaction stages for each role

The application is fully functional as a demo/prototype of a property transaction management system with comprehensive role-based workflows and real-time collaboration features.

## Branding Considerations

- **Brand Logo**: Nutlip brand logo should be "nutlip_logo.webp" which is located in public folder

## Localization and Language

- **Always use British UK English format for application frontend copy text**
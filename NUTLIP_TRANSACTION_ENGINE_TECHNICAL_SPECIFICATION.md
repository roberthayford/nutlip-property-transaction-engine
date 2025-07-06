# Nutlip Property Transaction Engine - Technical Specification

## Executive Summary

The Nutlip Property Transaction Engine is a comprehensive property transaction management platform built with Next.js that orchestrates the entire property buying/selling process from initial offer acceptance through to completion. The system serves four distinct stakeholder roles and manages 12 sequential transaction stages with real-time collaboration features.

## 1. System Architecture Overview

### 1.1 Technology Stack

- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API + localStorage persistence
- **Real-time**: Cross-tab synchronisation via storage events
- **Package Manager**: pnpm
- **Font**: Poppins (Google Fonts)

### 1.2 Core Design Principles

- **Multi-Role Architecture**: Four distinct user roles with role-specific permissions
- **Stage-Based Workflow**: 12 sequential transaction stages with controlled progression
- **Real-time Collaboration**: Cross-tab document sharing and communication
- **Responsive Design**: Mobile-first with adaptive layouts
- **Demo-Friendly**: Complete reset functionality for demonstration purposes

## 2. Role-Based System Architecture

### 2.1 User Roles Definition

The system supports four primary user roles, each with specific responsibilities and permissions:

#### 2.1.1 Buyer (`buyer`)
- **Purpose**: Property purchaser managing their transaction
- **Key Responsibilities**:
  - Submit proof of funds documentation
  - Appoint conveyancers
  - Monitor transaction progress
  - Communicate with estate agent
- **Dashboard Features**:
  - Property search activity tracking
  - Transaction progress monitoring
  - Document upload capabilities
  - Direct communication with estate agent

#### 2.1.2 Estate Agent (`estate-agent`)
- **Purpose**: Transaction coordinator and intermediary
- **Key Responsibilities**:
  - Manage property listings
  - Coordinate between all parties
  - Track offers and viewings
  - Facilitate communication
- **Dashboard Features**:
  - Portfolio management (£15.2M+ value tracking)
  - Multi-property transaction oversight
  - Offer management system
  - Professional messenger access (from Draft Contract stage)

#### 2.1.3 Buyer Conveyancer (`buyer-conveyancer`)
- **Purpose**: Legal representative for the buyer
- **Key Responsibilities**:
  - Draft and review contracts
  - Conduct property searches
  - Handle legal enquiries
  - Manage exchange and completion
- **Dashboard Features**:
  - Legal case management
  - Document review workflows
  - Amendment request handling
  - Professional communication tools

#### 2.1.4 Seller Conveyancer (`seller-conveyancer`)
- **Purpose**: Legal representative for the seller
- **Key Responsibilities**:
  - Prepare sale contracts
  - Respond to enquiries
  - Handle requisitions
  - Coordinate completion
- **Dashboard Features**:
  - Sale transaction management
  - Enquiry response system
  - Requisition handling
  - Contract preparation tools

### 2.2 Role-Based Permissions Matrix

```typescript
// From transaction-layout.tsx lines 65-150
const transactionStages: TransactionStage[] = [
  {
    id: "offer-accepted",
    allowedRoles: ["buyer", "estate-agent", "buyer-conveyancer", "seller-conveyancer"]
  },
  // ... all stages allow all roles access
]
```

All roles have access to all 12 transaction stages, but with different functional capabilities and UI presentations within each stage.

## 3. Transaction Stage Management

### 3.1 Stage Progression System

The system implements 12 sequential transaction stages:

1. **Offer Accepted** - Initial offer acceptance and agreement
2. **Proof of Funds** - Verification of buyer financial capability
3. **Add Conveyancer** - Legal representatives appointment
4. **Draft Contract** - Initial contract preparation
5. **Search & Survey** - Property searches and surveys
6. **Enquiries** - Legal and property enquiries
7. **Mortgage Offer** - Mortgage approval and offer
8. **Completion Date** - Setting the completion date
9. **Contract Exchange** - Legal contract exchange
10. **Nutlip Transaction Fee** - Platform transaction fee payment
11. **Replies to Requisitions** - Responding to legal requisitions
12. **Completion** - Final transaction completion

### 3.2 Stage Navigation Logic

```typescript
// From transaction-layout.tsx lines 236-240
const stageUrl = (stage: TransactionStage) => {
  const stageId = stage.id === "conveyancers" ? "add-conveyancer" : stage.id
  return `/${role}/${stageId}`
}
```

URL structure follows the pattern: `/{role}/{stage-id}`

### 3.3 Progress Tracking

- Visual progress bar with completion indicators
- Stage status tracking (pending, in-progress, completed)
- Role-specific stage completion permissions
- Cross-role progress visibility

## 4. Real-Time Collaboration System

### 4.1 State Management Architecture

The real-time system is built around a central React context with localStorage persistence:

```typescript
// From real-time-context.tsx
const STORAGE_KEY = "pte-state-v3"

interface PersistedState {
  documents: DocumentRecord[]
  amendmentRequests: AmendmentRequest[]
  updates: Update[]
}
```

### 4.2 Document Management System

#### 4.2.1 Document Model
```typescript
interface DocumentRecord {
  id: string
  name: string
  size: number
  stage: StageId
  recipientRole: Role
  uploadedBy: Role
  uploadedAt: Date
  priority: "standard" | "urgent" | "critical"
  status: "delivered" | "downloaded" | "reviewed"
  coverMessage?: string
  deadline?: string
}
```

#### 4.2.2 Document Workflow
- **Upload**: Role-specific document submission
- **Delivery**: Automatic routing to appropriate recipient role
- **Status Tracking**: Real-time status updates (delivered → downloaded → reviewed)
- **Notifications**: Automatic update generation for document activities

### 4.3 Amendment Request System

```typescript
interface AmendmentRequest {
  id: string
  stage: StageId
  requestedBy: Role
  requestedTo: Role
  type: string
  priority: "low" | "medium" | "high"
  description: string
  proposedChange?: string
  deadline?: string
  affectedClauses: string[]
  status: "sent" | "acknowledged" | "replied"
  createdAt: Date
  reply?: {
    decision: "accepted" | "rejected" | "counter-proposal"
    message: string
    counterProposal?: string
    repliedAt: Date
  }
}
```

### 4.4 Cross-Tab Synchronisation

```typescript
// From real-time-context.tsx lines 149-164
useEffect(() => {
  function onStorage(e: StorageEvent) {
    if (e.key !== STORAGE_KEY || !e.newValue || e.newValue === snapshot.current) return
    try {
      const parsed = reviveDates(JSON.parse(e.newValue) as PersistedState)
      // Sync state across tabs
    } catch {
      /* ignore bad payload */
    }
  }
  window.addEventListener("storage", onStorage)
  return () => window.removeEventListener("storage", onStorage)
}, [documents, amendmentRequests, updates])
```

## 5. Communication Systems

### 5.1 Professional Messenger Chat

#### 5.1.1 Participants and Access
```typescript
// From messenger-chat.tsx lines 32-53
const CHAT_ENABLED_ROLES: Role[] = ["estate-agent", "buyer-conveyancer", "seller-conveyancer"]

// Estate agents gain access from Draft Contract stage onwards
const ESTATE_AGENT_PROFESSIONAL_CHAT_STAGES = [
  "draft-contract", "search-survey", "enquiries", "mortgage-offer",
  "completion-date", "contract-exchange", "nutlip-transaction-fee",
  "replies-to-requisitions", "completion"
]
```

#### 5.1.2 Features
- **Multi-participant chat**: Conveyancers and estate agents
- **Persistent messaging**: localStorage-based message storage
- **Status indicators**: Online/offline/away status
- **Message status**: Read/unread tracking with visual indicators
- **Cross-tab sync**: Real-time message synchronisation

### 5.2 Buyer-Estate Agent Chat

#### 5.2.1 Limited Stage Access
```typescript
// From buyer-estate-agent-chat.tsx lines 30
const ALLOWED_STAGES = ["offer-accepted", "proof-of-funds", "add-conveyancer"]
```

#### 5.2.2 Features
- **Stage-specific availability**: Early transaction stages only
- **Auto-responses**: Intelligent contextual responses based on stage and role
- **Visual enhancements**: Green branding, enhanced UI
- **Call/video buttons**: UI elements for future integration

## 6. Data Persistence and State Management

### 6.1 Storage Strategy

- **Primary Storage**: localStorage (`pte-state-v3`)
- **Chat Storage**: Separate keys for different chat systems
- **Cross-tab Events**: Storage event listeners for real-time sync
- **Data Revival**: Date object reconstruction from JSON

### 6.2 State Structure

```typescript
interface RealTimeCtx extends PersistedState {
  // Document management
  getDocumentsForRole: (role: Role, stage: StageId) => DocumentRecord[]
  addDocument: (doc: DocumentCreationData) => void
  downloadDocument: (id: string, asRole: Role) => Promise<Blob | null>
  markDocumentAsReviewed: (id: string) => void
  
  // Amendment management
  getAmendmentRequestsForRole: (role: Role, stage: StageId) => AmendmentRequest[]
  addAmendmentRequest: (req: AmendmentRequestData) => void
  replyToAmendmentRequest: (id: string, reply: ReplyData) => void
  
  // Activity tracking
  sendUpdate: (u: UpdateData) => void
  markAsRead: (id: string) => void
}
```

### 6.3 Reset Functionality

Complete system reset capabilities for demonstration purposes:
- **Storage Cleanup**: All localStorage, sessionStorage, and IndexedDB
- **Cache Clearing**: Browser cache and service worker caches
- **History Reset**: Browser history and navigation state
- **Cookie Cleanup**: Platform-related cookies

## 7. User Interface Architecture

### 7.1 Layout System

#### 7.1.1 Transaction Layout Component
Central layout component (`transaction-layout.tsx`) providing:
- **Header**: Logo, role indicator, notifications, navigation
- **Progress Bar**: Visual stage progression with status indicators
- **Main Content**: Stage-specific content area
- **Chat Systems**: Context-aware communication tools
- **Reset Functionality**: Demo reset capabilities

#### 7.1.2 Responsive Design
- **Mobile-first**: Collapsible navigation and adaptive layouts
- **Breakpoints**: Mobile (sm), tablet (md), desktop (lg)
- **Progressive Enhancement**: Feature availability based on screen size

### 7.2 Component Architecture

#### 7.2.1 Dashboard Components
Each role has a dedicated dashboard with:
- **Statistics Cards**: Role-specific metrics and KPIs
- **Activity Feeds**: Recent transactions and updates
- **Quick Actions**: Contextual action buttons
- **Progress Tracking**: Visual transaction status

#### 7.2.2 Stage-Specific Pages
Each transaction stage implements:
- **Role-specific content**: Tailored functionality per user type
- **Document handling**: Upload, download, review capabilities
- **Communication tools**: Integrated chat and messaging
- **Navigation controls**: Stage progression buttons

## 8. Integration Points and APIs

### 8.1 External Platform Integration

```typescript
// Property Chain Management integration
const externalPlatformUrl = "https://v0-nutlip-platform-design.vercel.app/dashboard"
```

### 8.2 Future Integration Considerations

- **Real-time backend**: WebSocket integration for true real-time updates
- **Document storage**: Cloud storage integration for document management
- **Authentication system**: User management and role-based access control
- **Payment processing**: Transaction fee handling
- **Legal integrations**: Conveyancer tool integrations

## 9. Performance and Scalability

### 9.1 Current Performance Characteristics

- **Client-side state**: All state management in browser storage
- **Minimal API calls**: Self-contained demo system
- **Efficient re-renders**: React Context optimisation
- **Lazy loading**: Component-based code splitting

### 9.2 Scalability Considerations

- **State size limits**: localStorage storage constraints
- **Cross-tab performance**: Storage event frequency
- **Memory management**: Large transaction datasets
- **Network requirements**: Future real-time backend integration

## 10. Security and Data Handling

### 10.1 Current Security Model

- **Client-side only**: No server-side data exposure
- **Local storage**: Browser-based data persistence
- **Demo environment**: No real transaction data

### 10.2 Production Security Considerations

- **Data encryption**: Sensitive document encryption
- **Access controls**: Role-based permission enforcement
- **Audit trails**: Transaction activity logging
- **Compliance**: GDPR and financial regulation compliance

## 11. Testing and Quality Assurance

### 11.1 Role Testing

- **Role switcher**: Built-in role switching for testing
- **URL navigation**: Direct role/stage access via URLs
- **Reset functionality**: Clean state testing capability

### 11.2 Demo Features

- **Complete reset**: Full application state clearing
- **Cross-tab testing**: Multi-window collaboration testing
- **Progress simulation**: Transaction stage progression

## 12. Deployment and Configuration

### 12.1 Build Configuration

```typescript
// From next.config.mjs
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true }
}
```

### 12.2 Environment Setup

- **Vercel deployment**: Auto-sync with v0.dev
- **Package management**: pnpm preferred, yarn.lock present
- **Font loading**: Google Fonts integration
- **Asset optimisation**: Image and CSS optimisation

## 13. Development Guidelines

### 13.1 Code Conventions

- **TypeScript**: Strict typing throughout
- **Component patterns**: Functional components with hooks
- **State management**: Context API for global state
- **Styling**: Utility-first with Tailwind CSS

### 13.2 File Organisation

```
/app/                    # Next.js App Router pages
├── [role]/             # Role-specific directories
│   ├── [stage]/       # Stage-specific pages
│   └── page.tsx       # Role dashboard
/components/            # Reusable components
├── ui/                # shadcn/ui components
└── *-chat.tsx         # Communication components
/contexts/             # React contexts
/lib/                  # Utilities and hooks
```

## 14. Future Development Roadmap

### 14.1 Near-term Enhancements

- **Backend integration**: Real-time server synchronisation
- **Authentication**: User management system
- **Document storage**: Cloud-based document handling
- **Mobile app**: Native mobile application

### 14.2 Long-term Vision

- **Multi-property support**: Portfolio transaction management
- **Advanced analytics**: Transaction performance metrics
- **Integration ecosystem**: Third-party service connections
- **AI-powered features**: Automated document processing

## Conclusion

The Nutlip Property Transaction Engine represents a comprehensive solution for property transaction management, built with modern web technologies and designed for scalability and real-time collaboration. The system's role-based architecture, stage-driven workflow, and integrated communication tools provide a solid foundation for managing complex property transactions across multiple stakeholders.

The platform's emphasis on real-time collaboration, combined with its robust state management and intuitive user interface, positions it as a leading solution in the property technology space. With proper backend integration and additional security measures, this system can scale to handle production-level property transaction volumes while maintaining the seamless user experience demonstrated in the current implementation.
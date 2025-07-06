# Nutlip Brand Identity Guide

## 🏢 Brand Overview

**Nutlip** is a modern property transaction platform that streamlines the buying and selling process for all parties involved. The brand represents trust, efficiency, and innovation in the property industry.

### Brand Values
- **Trust**: Reliable platform for significant financial transactions
- **Efficiency**: Streamlined workflows reduce transaction time
- **Transparency**: Clear communication between all parties
- **Innovation**: Modern technology meets traditional property processes
- **Professionalism**: Serious business tool for property professionals

### Brand Personality
- Professional yet approachable
- Modern and tech-forward
- Trustworthy and reliable
- Efficient and organized
- User-focused and intuitive

## 🎨 Visual Identity

### Logo & Wordmark
- **Primary Logo**: Nutlip wordmark with distinctive styling
- **Logo File**: `nutlip_logo.webp` (200x80px optimized)
- **Usage**: Always maintain clear space around logo
- **Minimum Size**: 120px width for digital, 1 inch for print

### Color Psychology
- **Red**: Urgency, importance, action - perfect for property transactions
- **Blue**: Trust, reliability, professionalism - essential for financial dealings
- **Navy**: Authority, stability, expertise - conveys industry knowledge
- **Light Background**: Clean, modern, approachable - reduces cognitive load

## 🎨 Brand Colors

### Primary Brand Colors
- **Nutlip Red (Primary)**: `#E53E3E` (HSL: 0, 84%, 60%)
- **Nutlip Blue**: `#4299E1` (HSL: 213, 94%, 68%)
- **Nutlip Navy**: `#003366` (HSL: 210, 100%, 15%)
- **Nutlip Light Background**: `#F7F9FC` (HSL: 210, 20%, 98%)

### Extended Color System

#### Red Palette (Primary Brand)
```css
--red-50: #FEF2F2    /* Lightest tint - backgrounds */
--red-100: #FEE2E2   /* Light tint - hover states */
--red-200: #FECACA   /* Subtle accent */
--red-300: #FCA5A5   /* Lighter accent */
--red-400: #F87171   /* Medium accent */
--red-500: #E53E3E   /* PRIMARY BRAND RED */
--red-600: #DC2626   /* Hover states */
--red-700: #B91C1C   /* Active states */
--red-800: #991B1B   /* Dark accent */
--red-900: #7F1D1D   /* Darkest - high contrast */
```

#### Blue Palette (Supporting)
```css
--blue-50: #EBF8FF    /* Light backgrounds */
--blue-100: #BEE3F8   /* Tinted backgrounds */
--blue-200: #90CDF4   /* Light accents */
--blue-300: #63B3ED   /* Medium accents */
--blue-400: #4299E1   /* NUTLIP BLUE */
--blue-500: #3182CE   /* Standard blue */
--blue-600: #2C5282   /* Hover states */
--blue-700: #2A4365   /* Active states */
--blue-800: #1A365D   /* Dark blue */
--blue-900: #1A202C   /* Darkest blue */
```

#### Navy Palette (Authority)
```css
--navy-50: #F0F4F8    /* Very light navy tint */
--navy-100: #D9E2EC   /* Light navy tint */
--navy-200: #BCCCDC   /* Subtle navy */
--navy-300: #9FB3C8   /* Medium navy */
--navy-400: #829AB1   /* Lighter navy */
--navy-500: #627D98   /* Standard navy */
--navy-600: #486581   /* Medium dark navy */
--navy-700: #334E68   /* Dark navy */
--navy-800: #003366   /* NUTLIP NAVY */
--navy-900: #102A43   /* Darkest navy */
```

#### Neutral Palette (Supporting)
```css
--gray-50: #F7F9FC    /* NUTLIP LIGHT BACKGROUND */
--gray-100: #F1F5F9   /* Subtle backgrounds */
--gray-200: #E2E8F0   /* Borders, dividers */
--gray-300: #CBD5E1   /* Disabled states */
--gray-400: #94A3B8   /* Placeholder text */
--gray-500: #64748B   /* Secondary text */
--gray-600: #475569   /* Primary text */
--gray-700: #334155   /* Headings */
--gray-800: #1E293B   /* High contrast text */
--gray-900: #0F172A   /* Maximum contrast */
```

#### Status Colors
```css
/* Success Green */
--green-50: #F0FDF4   /* Success backgrounds */
--green-100: #DCFCE7  /* Success tints */
--green-500: #22C55E  /* Success actions */
--green-600: #16A34A  /* Success hover */
--green-700: #15803D  /* Success active */

/* Warning Amber */
--amber-50: #FFFBEB   /* Warning backgrounds */
--amber-100: #FEF3C7  /* Warning tints */
--amber-500: #F59E0B  /* Warning actions */
--amber-600: #D97706  /* Warning hover */
--amber-700: #B45309  /* Warning active */

/* Error Red (uses brand red) */
--error-50: #FEF2F2   /* Error backgrounds */
--error-100: #FEE2E2  /* Error tints */
--error-500: #E53E3E  /* Error actions (brand red) */
--error-600: #DC2626  /* Error hover */
--error-700: #B91C1C  /* Error active */
```

## 🔤 Typography

### Font Family
**Primary**: Poppins (Google Fonts)
- Modern, approachable sans-serif
- Excellent readability across all sizes
- Professional appearance
- Wide character support

**Fallback Stack**: `Poppins, Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

### Font Weights & Usage
```css
/* Light - 300 */
font-weight: 300; /* Large display text, elegant headings */

/* Regular - 400 */
font-weight: 400; /* Body text, paragraphs, descriptions */

/* Medium - 500 */
font-weight: 500; /* Buttons, navigation, emphasized text */

/* Semibold - 600 */
font-weight: 600; /* Subheadings, card titles, important info */

/* Bold - 700 */
font-weight: 700; /* Main headings, section titles */

/* Extra Bold - 800 */
font-weight: 800; /* Hero text, major callouts */

/* Black - 900 */
font-weight: 900; /* Logo text, brand statements */
```

### Typography Scale
```css
/* Display Sizes */
.text-6xl { font-size: 3.75rem; line-height: 1.1; }  /* 60px - Hero headings */
.text-5xl { font-size: 3rem; line-height: 1.1; }     /* 48px - Page titles */
.text-4xl { font-size: 2.25rem; line-height: 1.2; }  /* 36px - Section headings */
.text-3xl { font-size: 1.875rem; line-height: 1.3; } /* 30px - Subsection headings */

/* Heading Sizes */
.text-2xl { font-size: 1.5rem; line-height: 1.4; }   /* 24px - Card titles */
.text-xl { font-size: 1.25rem; line-height: 1.5; }   /* 20px - Component headings */
.text-lg { font-size: 1.125rem; line-height: 1.6; }  /* 18px - Emphasized text */

/* Body Sizes */
.text-base { font-size: 1rem; line-height: 1.6; }    /* 16px - Body text */
.text-sm { font-size: 0.875rem; line-height: 1.5; }  /* 14px - Secondary text */
.text-xs { font-size: 0.75rem; line-height: 1.4; }   /* 12px - Captions, labels */
```

## 🎯 Component Design System

### Button Styles

#### Primary Button (Call-to-Action)
```css
.btn-primary {
  background: linear-gradient(135deg, #E53E3E 0%, #DC2626 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(229, 62, 62, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
  background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(229, 62, 62, 0.2);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: var(--gray-400);
  background: var(--gray-50);
  transform: translateY(-1px);
}
```

#### Role-Specific Buttons
```css
/* Estate Agent */
.btn-estate-agent {
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
  color: white;
}

/* Buyer Conveyancer */
.btn-buyer-conveyancer {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  color: white;
}

/* Seller Conveyancer */
.btn-seller-conveyancer {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  color: white;
}
```

### Card Styles

#### Dashboard Card
```css
.dashboard-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--gray-300);
}
```

#### Property Card
```css
.property-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.property-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

#### Interactive Card (Role-based hover)
```css
.interactive-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-width: 2px;
  border-color: transparent;
}

.interactive-card.buyer:hover {
  border-color: var(--blue-300);
  box-shadow: 0 10px 25px rgba(66, 153, 225, 0.15);
}

.interactive-card.estate-agent:hover {
  border-color: var(--green-300);
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.15);
}

.interactive-card.buyer-conveyancer:hover {
  border-color: var(--purple-300);
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.15);
}

.interactive-card.seller-conveyancer:hover {
  border-color: var(--amber-300);
  box-shadow: 0 10px 25px rgba(245, 158, 11, 0.15);
}
```

### Status Indicators

#### Transaction Stage Badges
```css
.stage-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
  letter-spacing: 0.025em;
}

.stage-offer-accepted {
  background: var(--green-100);
  color: var(--green-800);
}

.stage-searches-ordered {
  background: var(--blue-100);
  color: var(--blue-800);
}

.stage-mortgage-approved {
  background: var(--purple-100);
  color: var(--purple-800);
}

.stage-exchange-contracts {
  background: var(--amber-100);
  color: var(--amber-800);
}

.stage-completion {
  background: var(--red-100);
  color: var(--red-800);
}
```

#### Progress Indicators
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--red-500) 0%, var(--red-600) 100%);
  transition: width 0.5s ease;
}

.progress-step {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.progress-step.completed {
  background: var(--green-500);
  color: white;
}

.progress-step.current {
  background: var(--red-500);
  color: white;
  box-shadow: 0 0 0 4px var(--red-100);
}

.progress-step.upcoming {
  background: var(--gray-200);
  color: var(--gray-500);
}
```

## 📐 Layout & Spacing

### Grid System
```css
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { padding: 0 2rem; }
}

@media (min-width: 1024px) {
  .container { padding: 0 3rem; }
}
```

### Spacing Scale (8px grid)
```css
.space-1 { margin: 0.25rem; }    /* 4px */
.space-2 { margin: 0.5rem; }     /* 8px */
.space-3 { margin: 0.75rem; }    /* 12px */
.space-4 { margin: 1rem; }       /* 16px */
.space-5 { margin: 1.25rem; }    /* 20px */
.space-6 { margin: 1.5rem; }     /* 24px */
.space-8 { margin: 2rem; }       /* 32px */
.space-10 { margin: 2.5rem; }    /* 40px */
.space-12 { margin: 3rem; }      /* 48px */
.space-16 { margin: 4rem; }      /* 64px */
.space-20 { margin: 5rem; }      /* 80px */
.space-24 { margin: 6rem; }      /* 96px */
```

### Border Radius
```css
--radius-sm: 4px;    /* Small elements */
--radius-md: 8px;    /* Buttons, inputs */
--radius-lg: 12px;   /* Cards, panels */
--radius-xl: 16px;   /* Large cards */
--radius-2xl: 24px;  /* Hero sections */
--radius-full: 9999px; /* Pills, badges */
```

## 🎭 Role-Based Visual Language

### Color Associations
- **Buyer**: Blue tones - trust, reliability, decision-making
- **Estate Agent**: Green tones - growth, success, facilitation
- **Buyer Conveyancer**: Purple tones - expertise, legal authority
- **Seller Conveyancer**: Orange tones - warmth, guidance, completion

### Navigation States
```css
.nav-item {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-item.active {
  background: var(--red-50);
  color: var(--red-700);
  border-left: 3px solid var(--red-500);
}

.nav-item:hover:not(.active) {
  background: var(--gray-50);
  color: var(--gray-700);
}
```

### Role-Specific Accents
```css
.role-buyer .accent-color { color: var(--blue-600); }
.role-estate-agent .accent-color { color: var(--green-600); }
.role-buyer-conveyancer .accent-color { color: var(--purple-600); }
.role-seller-conveyancer .accent-color { color: var(--amber-600); }
```

## 🎨 Animation & Interactions

### Keyframe Animations
```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse-brand {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(229, 62, 62, 0);
  }
}
```

### Interaction States
```css
.interactive-element {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.interactive-element:hover {
  transform: translateY(-2px);
}

.interactive-element:active {
  transform: translateY(0);
  transition: transform 0.1s ease;
}

.interactive-element:focus {
  outline: 2px solid var(--red-500);
  outline-offset: 2px;
}
```

## 🔍 Brand Application Guidelines

### Logo Usage
✅ **Correct Usage:**
- Maintain minimum clear space (half logo width)
- Use on light backgrounds primarily
- Ensure good contrast
- Keep proportions intact

❌ **Incorrect Usage:**
- Don't stretch or distort
- Don't use on busy backgrounds
- Don't change colors arbitrarily
- Don't use below minimum size

### Color Application
✅ **Primary Red (#E53E3E) for:**
- Primary CTAs and buttons
- Important notifications
- Brand elements
- Active states
- Error states

✅ **Supporting Colors for:**
- Role differentiation
- Status indicators
- Secondary actions
- Information hierarchy

### Typography Guidelines
✅ **Poppins for:**
- All UI text
- Headings and body copy
- Buttons and labels
- Navigation items

✅ **Hierarchy:**
- Use weight to establish importance
- Maintain consistent line heights
- Consider reading comfort
- Ensure mobile readability

## 📱 Responsive Considerations

### Mobile-First Approach
- Touch targets minimum 44px
- Simplified interactions
- Reduced motion for accessibility
- Readable text sizes (minimum 16px)

### Breakpoints
```css
/* Mobile: 0-639px */
/* Tablet: 640-1023px */
/* Desktop: 1024px+ */
/* Large: 1280px+ */
```

### Accessibility
- WCAG 2.1 AA compliance
- Minimum 4.5:1 contrast ratio
- Focus indicators
- Screen reader support
- Color-blind friendly palette

## 🎯 Brand Voice & Messaging

### Tone of Voice
- **Professional**: Serious business tool
- **Confident**: Reliable and trustworthy
- **Clear**: Simple, jargon-free communication
- **Supportive**: Helpful and understanding
- **Efficient**: Direct and to-the-point

### Messaging Pillars
1. **Simplicity**: "Making property transactions straightforward"
2. **Transparency**: "Everyone knows what's happening, when"
3. **Efficiency**: "Faster completions, fewer delays"
4. **Trust**: "Secure platform for your biggest investment"

This brand identity guide ensures consistent visual and experiential standards across all Nutlip touchpoints, building trust and recognition in the competitive property technology market.
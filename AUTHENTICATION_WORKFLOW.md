# HackX Authentication Workflow

## 🚀 Step-by-Step User Journey

### 1. **Initial Landing** (`/`)
- User visits the platform
- Sees public content (hackathons, projects)
- "Connect Wallet" button visible in navigation

### 2. **Wallet Connection** (Anywhere)
- User clicks "Connect Wallet" 
- RainbowKit modal opens with wallet options
- User selects wallet (MetaMask, WalletConnect, etc.)
- Wallet prompts for connection approval
- ✅ **Result: User's wallet address is now available**

### 3. **First-Time Profile Setup** (`/register`)
- After wallet connection, check if user profile exists
- If no profile found → redirect to `/register`
- User fills out profile form:
  - Display name
  - Email (optional)
  - Bio
  - GitHub username
  - Website
  - Skills (comma-separated)
  - Experience level
- ✅ **Result: User profile created in MongoDB**

### 4. **Authenticated Navigation**
- Dashboard, Judge, and Create pages now accessible
- Sidebar shows user's wallet address
- Profile can be edited anytime via `/register`

### 5. **Hackathon Participation**
- User can create hackathons (`/create`)
- User can view hackathons (`/hackathon/[id]`)
- Role assignment happens per-hackathon
- Judging interface available for judges (`/judge`)

## 🔧 Technical Implementation

### Frontend Components:
- `useAuth()` hook - manages wallet state and user profile
- `ProtectedRoute` - basic wallet connection protection
- `HackathonProtectedRoute` - role-specific hackathon access
- `ConnectButton` - RainbowKit wallet connection

### Backend APIs:
- `/api/auth/profile` - GET/PUT user profile data
- `/api/hackathon` - Create hackathons
- `/api/hackathon/[id]` - Manage specific hackathons

### Database Models:
- `User` - wallet address + profile data
- `Hackathon` - hackathon data + role arrays (admins, judges, etc.)

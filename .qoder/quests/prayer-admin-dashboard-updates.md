# Prayer Admin Dashboard Updates Design

## Overview

This design document outlines three critical enhancements to the Torch Fellowship application: fixing prayer request privacy controls, implementing statistics card routing in the admin dashboard, and adding image media support to light communities. These improvements will enhance user experience, streamline administrative workflows, and improve community engagement features.

## Technology Stack

- **Frontend**: React 19.1.1, TypeScript, React Router 7.8.1, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **State Management**: Zustand 5.0.7, React Query 5.85.3
- **Media Storage**: Cloudinary integration
- **Authentication**: JWT-based with role-based access control

## Architecture

### Component Architecture

```mermaid
graph TB
    subgraph "Frontend Components"
        A[PrayerPage] --> B[Prayer Request Form]
        C[ManagePrayers] --> D[Privacy Controls]
        E[AdminDashboard] --> F[Statistics Cards]
        G[LightCampusesPage] --> H[Media Upload]
        
        B --> I[Privacy Toggle]
        D --> J[Make Public/Private Actions]
        F --> K[Clickable Stats Links]
        H --> L[Image Display Grid]
    end
    
    subgraph "Backend Services"
        M[Prayer Request Controller] --> N[Privacy Update API]
        O[Admin Dashboard Controller] --> P[Statistics API]
        Q[Light Campus Controller] --> R[Media Management API]
    end
    
    subgraph "External Services"
        S[Cloudinary] --> T[Image Storage & CDN]
    end
    
    A --> M
    C --> M
    E --> O
    G --> Q
    Q --> S
```

## Feature 1: Prayer Request Privacy Controls Fix

### Current Issues

Based on code analysis, the current implementation has the following issues:
- Privacy toggle functionality exists but may have inconsistent behavior
- UI feedback for privacy state changes needs improvement
- Potential race conditions in state updates

### Data Model Enhancement

```mermaid
classDiagram
    class PrayerRequest {
        +string _id
        +string created_at
        +string name
        +string email
        +string request_text
        +boolean is_private
        +boolean is_answered
        +Date updated_at
        +string updated_by
    }
    
    class PrayerRequestUpdate {
        +string requestId
        +boolean is_private
        +string adminId
        +Date timestamp
        +string action
    }
```

### Frontend Implementation

#### Privacy Control Components

**Enhanced ManagePrayers Component:**
- Improved visual feedback for privacy state
- Confirmation dialogs for privacy changes
- Batch privacy operations
- Audit trail display

**PrayerPage Privacy Toggle:**
- Clear labeling of privacy implications
- Preview of how request appears when public/private
- Enhanced checkbox styling and interaction

#### UI/UX Improvements

```mermaid
stateDiagram-v2
    [*] --> FormInitialized
    FormInitialized --> PublicSelected : User selects "Share Publicly"
    FormInitialized --> PrivateSelected : User unchecks "Share Publicly"
    
    PublicSelected --> PreviewPublic : Show preview
    PrivateSelected --> PreviewPrivate : Show admin-only notice
    
    PreviewPublic --> SubmitPublic
    PreviewPrivate --> SubmitPrivate
    
    SubmitPublic --> [*]
    SubmitPrivate --> [*]
```

### Backend API Enhancements

#### Enhanced Privacy Management Endpoints

**PUT /api/prayer-requests/admin/:id/privacy**
- Dedicated endpoint for privacy changes
- Audit logging
- Validation of privacy state transitions

**GET /api/prayer-requests/admin/audit/:id**
- Retrieve privacy change history
- Admin action tracking

### Privacy Control Workflow

```mermaid
sequenceDiagram
    participant Admin as Admin Interface
    participant API as Privacy API
    participant Controller as Prayer Controller
    participant DB as Database
    participant Audit as Audit Service
    
    Admin->>API: PUT /admin/:id/privacy
    API->>Controller: updatePrivacy(id, is_private, adminId)
    Controller->>DB: Update prayer request privacy
    Controller->>Audit: Log privacy change
    Audit->>DB: Store audit record
    DB-->>Controller: Confirm update
    Controller-->>API: Return success + updated request
    API-->>Admin: Privacy updated confirmation
    
    Note over Admin,DB: Real-time UI update via React Query
```

## Feature 2: Admin Dashboard Statistics Card Routing

### Current Issue Analysis

The AdminDashboard component displays statistics cards but lacks navigation links to corresponding management pages. Cards show metrics but don't provide actionable pathways for administrators.

### Enhanced Statistics Cards Architecture

#### Clickable Statistics Cards

```mermaid
graph TD
    A[Statistics Card] --> B{Card Type}
    B --> C[Users Stats] --> D[Navigate to /admin/users]
    B --> E[Prayer Stats] --> F[Navigate to /admin/prayers]
    B --> G[Event Stats] --> H[Navigate to /admin/events]
    B --> I[Teaching Stats] --> J[Navigate to /admin/teachings]
    B --> K[Leaders Stats] --> L[Navigate to /admin/leaders]
    B --> M[Blog Stats] --> N[Navigate to /admin/blog]
    B --> O[Testimony Stats] --> P[Navigate to /admin/testimonies]
    B --> Q[Ministry Stats] --> R[Navigate to /admin/serve]
```

### Component Architecture Enhancement

#### Enhanced AdminDashboard Structure

**Primary Statistics Cards (Clickable):**
- User Growth → `/admin/users`
- Prayer Requests → `/admin/prayers`
- Upcoming Events → `/admin/events`

**Secondary Statistics Cards (Clickable):**
- Leaders → `/admin/leaders`
- Blog Posts → `/admin/blog`
- Teachings → `/admin/teachings`
- Testimonies → `/admin/testimonies`

#### Rich Data Visualization Cards

**MinistryTeamsOverview Component:**
- Display ministry team statistics with donut chart
- Click-through to ministry management
- Team member count and activity metrics

**PrayerRequestsOverview Component:**
- Prayer request trends with line chart
- Answered vs pending visualization
- Direct link to prayer management

### Interactive Statistics Implementation

```mermaid
classDiagram
    class StatisticsCard {
        +string title
        +number value
        +string trend
        +string routePath
        +ReactNode icon
        +function onClick()
        +boolean isClickable
    }
    
    class StatisticsCardRouter {
        +navigateToManagement(path: string)
        +trackCardClick(cardType: string)
        +getManagementPath(statType: string)
    }
    
    StatisticsCard --> StatisticsCardRouter
```

### Navigation Enhancement Workflow

```mermaid
sequenceDiagram
    participant User as Administrator
    participant Card as Statistics Card
    participant Router as React Router
    participant Page as Management Page
    
    User->>Card: Click statistics card
    Card->>Router: Navigate to management path
    Router->>Page: Load management component
    Page->>User: Display filtered management view
    
    Note over User,Page: Context-aware filtering based on card clicked
```

## Feature 3: Light Communities Media Enhancement

### Current State Analysis

The LightCampusesPage currently displays text-based information without visual elements. Adding image support will improve community engagement and visual appeal.

### Enhanced Data Model

```mermaid
classDiagram
    class LightCampus {
        +string _id
        +string name
        +string leaderName
        +string location
        +string meetingSchedule
        +string contactInfo
        +string description
        +MediaAsset[] images
        +Date created_at
        +Date updated_at
        +boolean isActive
    }
    
    class MediaAsset {
        +string _id
        +string url
        +string publicId
        +string type
        +number size
        +Dimensions dimensions
        +Date uploadDate
        +string uploadedBy
    }
    
    class Dimensions {
        +number width
        +number height
    }
    
    LightCampus "1" --> "*" MediaAsset
    MediaAsset "1" --> "1" Dimensions
```

### Media Upload Architecture

#### Frontend Components

**Enhanced LightCampusesPage:**
- Image grid display for each campus
- Responsive image gallery
- Lazy loading for performance
- Image modal/lightbox for detailed view

**Admin Campus Management:**
- Drag-and-drop image upload
- Multiple image support
- Image cropping and resizing tools
- Bulk image operations

#### Cloudinary Integration

```mermaid
sequenceDiagram
    participant User as Campus Admin
    participant Form as Upload Form
    participant API as Upload API
    participant Cloudinary as Cloudinary Service
    participant DB as Database
    
    User->>Form: Select images for campus
    Form->>API: POST /api/light-campuses/:id/media
    API->>Cloudinary: Upload images with transformations
    Cloudinary-->>API: Return URLs and metadata
    API->>DB: Store media references
    DB-->>API: Confirm storage
    API-->>Form: Return success with URLs
    Form-->>User: Display uploaded images
```

### Media Management Features

#### Image Processing Pipeline

**Automatic Transformations:**
- Thumbnail generation (300x200)
- Medium size (600x400) 
- Large display (1200x800)
- WebP format conversion for performance

**Upload Validation:**
- File type restrictions (JPEG, PNG, WebP)
- Size limits (max 5MB per image)
- Dimension requirements (min 800x600)
- Content moderation via Cloudinary AI

#### Enhanced UI Components

```mermaid
graph TD
    A[Campus Card] --> B[Campus Info]
    A --> C[Image Gallery]
    
    B --> D[Campus Name]
    B --> E[Leader Info]
    B --> F[Schedule]
    B --> G[Contact]
    
    C --> H[Primary Image]
    C --> I[Image Thumbnails]
    C --> J[View Gallery Button]
    
    J --> K[Lightbox Modal]
    K --> L[Full Size Images]
    K --> M[Image Navigation]
    K --> N[Image Details]
```

### Community Page Enhancement Workflow

```mermaid
flowchart TD
    A[User visits Light Campuses page] --> B[Load campus data with images]
    B --> C[Display campus grid with media]
    C --> D{User interaction}
    
    D --> E[Click campus card] --> F[View detailed campus info]
    D --> G[Click image gallery] --> H[Open lightbox modal]
    D --> I[Apply to start campus] --> J[Enhanced application form]
    
    F --> K[Contact campus leader]
    H --> L[Navigate through images]
    J --> M[Submit with optional campus vision images]
```

## Implementation Strategy

### Phase 1: Prayer Privacy Controls (Week 1)

**Frontend Tasks:**
1. Enhance privacy toggle UI in PrayerPage
2. Improve admin privacy controls in ManagePrayers
3. Add confirmation dialogs for privacy changes
4. Implement visual feedback for state changes

**Backend Tasks:**
1. Create dedicated privacy management endpoints
2. Add audit logging for privacy changes
3. Enhance validation and error handling
4. Update API documentation

### Phase 2: Dashboard Statistics Routing (Week 2)

**Frontend Tasks:**
1. Convert statistics cards to clickable components
2. Implement navigation logic with React Router
3. Add hover states and click feedback
4. Create context-aware filtering in management pages

**Backend Tasks:**
1. Ensure all management endpoints support filtering
2. Add analytics tracking for card interactions
3. Optimize statistics queries for performance

### Phase 3: Light Communities Media (Week 3)

**Frontend Tasks:**
1. Design and implement image gallery components
2. Add media upload interface for admin
3. Implement responsive image display
4. Create lightbox modal for image viewing

**Backend Tasks:**
1. Extend LightCampus model with media fields
2. Implement Cloudinary upload endpoints
3. Add image processing and validation
4. Create media management APIs

## Testing Strategy

### Unit Testing

**Prayer Privacy Controls:**
- Privacy toggle state management
- API request/response handling
- Permission validation
- Audit trail functionality

**Dashboard Navigation:**
- Route navigation accuracy
- Card click event handling
- Context preservation across navigation
- Loading state management

**Media Management:**
- File upload validation
- Image processing workflows
- Gallery component interactions
- Responsive image loading

### Integration Testing

**End-to-End Workflows:**
1. Complete prayer request privacy change workflow
2. Admin dashboard navigation to management pages
3. Campus media upload and display workflow

### Performance Testing

**Media Optimization:**
- Image loading performance
- Cloudinary transformation efficiency
- Gallery scroll performance
- Mobile responsiveness

## Security Considerations

### Privacy Controls
- Role-based access validation
- Audit trail integrity
- Data encryption for sensitive requests

### Media Upload Security
- File type validation
- Size limit enforcement
- Content moderation
- Secure URL generation

### Admin Dashboard Security
- Route protection validation
- Statistics data access control
- Session management

## Monitoring and Analytics

### Key Metrics

**Prayer Management:**
- Privacy change frequency
- Admin response times
- User satisfaction with privacy controls

**Dashboard Usage:**
- Statistics card click-through rates
- Navigation pattern analysis
- Admin workflow efficiency

**Media Engagement:**
- Image view rates
- Gallery interaction metrics
- Upload success rates

## Future Enhancements

### Prayer Features
- Bulk privacy operations
- Prayer request categories
- Automated privacy settings

### Dashboard Features
- Customizable dashboard layouts
- Advanced filtering options
- Export capabilities

### Media Features
- Video support for campuses
- 360-degree campus tours
- User-generated content galleries
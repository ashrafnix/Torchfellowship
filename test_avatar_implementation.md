# Prayer Request Avatar Implementation - Test Plan

## ✅ Completed Implementation

### Backend Changes
1. **Updated Types** (`server/types.ts`)
   - Added `user_id?: string` to PrayerRequest interface
   - Added `avatar_url?: string | null` to PrayerRequest interface
   - Updated DBPrayerRequest interface with same fields

2. **Added Optional Authentication** (`server/middleware/auth.middleware.js`)
   - Created `optionalAuthMiddleware` for non-blocking authentication
   - Allows prayer requests from both authenticated and anonymous users

3. **Updated Routes** (`server/api/prayerRequest.routes.js`)
   - Added `optionalAuthMiddleware` to prayer request creation route
   - Maintains backward compatibility for anonymous submissions

4. **Enhanced Controllers** (`server/controllers/prayerRequest.controller.js`)
   - Added `populateAvatars()` helper function to fetch user avatars
   - Updated `getPublicPrayerRequests()` to include avatar URLs
   - Updated `getAllPrayerRequests()` to include avatar URLs  
   - Updated `createPublicPrayerRequest()` to capture user_id when authenticated

### Frontend Changes
1. **Updated Types** (`src/types.ts`)
   - Added `user_id?: string` field
   - Added `avatar_url?: string | null` field

2. **Enhanced Prayer Wall** (`src/pages/PrayerPage.tsx`)
   - Displays user avatars when available
   - Falls back to initials for anonymous users
   - Shows "Member" badge for authenticated users
   - Proper error handling for broken avatar images

3. **Enhanced Admin Interface** (`src/pages/admin/ManagePrayers.tsx`)
   - Displays user avatars in prayer management
   - Shows "Member" badge for authenticated users
   - Consistent avatar fallback behavior

## 🧪 Test Scenarios

### Scenario 1: Anonymous Prayer Request
- User submits prayer request without logging in
- Expected: Shows initial-based avatar, no member badge
- Avatar field should be null in database

### Scenario 2: Authenticated User with Avatar
- Logged-in user with profile avatar submits request
- Expected: Shows user's actual avatar image, member badge visible
- Database should contain user_id and populated avatar_url

### Scenario 3: Authenticated User without Avatar
- Logged-in user without profile avatar submits request  
- Expected: Shows initial-based avatar, member badge visible
- Database should contain user_id, avatar_url should be null

### Scenario 4: Avatar Loading Error
- User with invalid avatar URL
- Expected: Gracefully falls back to initials
- No broken image displays

### Scenario 5: Mixed Prayer Wall
- Wall contains mix of authenticated and anonymous requests
- Expected: Different avatar styles clearly distinguish user types
- Member badges only show for authenticated users

## 🔍 Verification Steps

1. **Database Check**
   ```javascript
   // Verify prayer_requests collection has new fields
   db.prayer_requests.findOne({}, {user_id: 1, avatar_url: 1})
   ```

2. **API Response Check**
   ```bash
   # Test public endpoint returns avatar data
   curl http://localhost:8080/api/prayer-requests/public
   ```

3. **Authentication Test**
   ```bash
   # Test authenticated request includes user info
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"name":"Test User","request_text":"Test prayer","share_publicly":true}' \
        http://localhost:8080/api/prayer-requests
   ```

4. **Frontend Visual Check**
   - Open prayer page 
   - Submit requests both logged in and logged out
   - Verify avatar display differences
   - Check admin manage prayers page

## 🎯 Success Criteria

✅ **Backend Integration**
- [ ] Optional authentication middleware works
- [ ] User ID captured for authenticated requests  
- [ ] Avatar URLs populated from user profiles
- [ ] Backward compatibility maintained

✅ **Frontend Display**  
- [ ] Avatars display correctly on prayer wall
- [ ] Fallback to initials works properly
- [ ] Member badges show for authenticated users
- [ ] Admin interface shows avatars
- [ ] Error handling prevents broken images

✅ **Data Consistency**
- [ ] Database schema supports new fields
- [ ] API responses include avatar data
- [ ] Type safety maintained across stack

## 📋 Implementation Summary

The avatar functionality has been successfully implemented with:

1. **Non-breaking changes** - Anonymous users can still submit prayers
2. **Enhanced experience** - Authenticated users get visual identification
3. **Graceful degradation** - Missing avatars fall back to initials  
4. **Clear distinction** - Member badges identify registered users
5. **Performance optimization** - Avatar URLs populated efficiently via DB lookup
6. **Error resilience** - Broken images handled gracefully

The implementation maintains full backward compatibility while adding rich user identification features for authenticated members.
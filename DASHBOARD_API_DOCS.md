# Enhanced Dashboard API Endpoints

This document outlines the API endpoints required for the enhanced data visualization dashboard.

## User Growth Chart
**Endpoint:** `GET /api/admin/user-growth`

**Expected Response:**
```json
{
  "data": [
    {
      "date": "2025-01-01",
      "count": 150,
      "newUsers": 5
    },
    {
      "date": "2025-01-02", 
      "count": 155,
      "newUsers": 3
    }
  ],
  "totalUsers": 155,
  "growthPercentage": 15.5,
  "newUsersToday": 8
}
```

## Upcoming Events
**Endpoint:** `GET /api/events?limit=3&upcoming=true`

**Expected Response:**
```json
[
  {
    "_id": "event1",
    "title": "Sunday Service",
    "location": "Main Sanctuary",
    "event_date": "2025-01-15",
    "event_time": "10:00",
    "description": "Weekly worship service"
  }
]
```

## Ministry Teams Stats
**Endpoint:** `GET /api/admin/ministry-stats`

**Expected Response:**
```json
{
  "teams": [
    {
      "name": "Worship",
      "volunteers": 12,
      "pending": 2,
      "active": true
    },
    {
      "name": "Youth",
      "volunteers": 8,
      "pending": 1,
      "active": true
    }
  ],
  "totalTeams": 5,
  "totalVolunteers": 45,
  "pendingApplications": 7
}
```

## Prayer Requests Stats
**Endpoint:** `GET /api/admin/prayer-stats`

**Expected Response:**
```json
{
  "trends": [
    {
      "date": "2025-01-01",
      "requests": 15,
      "answered": 8
    },
    {
      "date": "2025-01-02",
      "requests": 12,
      "answered": 10
    }
  ],
  "totalRequests": 150,
  "answeredRequests": 120,
  "pendingRequests": 30,
  "todayRequests": 8
}
```

## Implementation Notes

1. **User Growth Data**: Should aggregate user registrations by date for the last 30 days
2. **Events**: Filter should return only future events, sorted by date
3. **Ministry Stats**: Should include volunteer counts and pending applications per team
4. **Prayer Stats**: Should track prayer requests over time and their answered status

## Backend Implementation Example

```javascript
// Example controller method for user growth
export const getUserGrowth = async (req, res) => {
  try {
    // Get last 30 days of user registration data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const users = await User.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: 1 });
    
    const totalUsers = await User.countDocuments();
    const todayUsers = await User.countDocuments({
      createdAt: { $gte: startOfDay(new Date()) }
    });
    
    // Process data into daily aggregates
    const data = processUserGrowthData(users);
    const growthPercentage = calculateGrowthPercentage(data);
    
    res.json({
      data,
      totalUsers,
      growthPercentage,
      newUsersToday: todayUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```
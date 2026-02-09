# Backend Endpoints Requirement

Based on the frontend implementation, the following API endpoints are required.

## Authentication
- `POST /api/auth/register` - Register a new user (Client or Agency).
- `POST /api/auth/login` - Authenticate user and return token.
- `POST /api/auth/logout` - Invalidate session/token.
- `GET /api/auth/me` - Get current authenticated user details.
- `PUT /api/auth/profile` - Update user profile.

## Users (Clients)
- `GET /api/users/{id}/trips` - Get booking history/upcoming trips.
- `GET /api/users/{id}/favorites` - Get favorite agencies.
- `POST /api/users/{id}/favorites` - Add agency to favorites.
- `DELETE /api/users/{id}/favorites/{agencyId}` - Remove agency from favorites.
- `POST /api/users/{id}/payment-methods` - Add a payment method.
- `GET /api/users/{id}/payment-methods` - List payment methods.
- `PUT /api/users/settings` - Update notification/app settings.

## Agencies
- `GET /api/agencies` - List all agencies (with filters for search).
- `GET /api/agencies/{id}` - Get specific agency details.
- `GET /api/agencies/{id}/stats` - Get agency dashboard statistics (revenue, bookings, etc).
- `GET /api/agencies/{id}/fleet` - Get agency bus fleet.
- `POST /api/agencies/{id}/fleet` - Add a bus to fleet.
- `GET /api/agencies/{id}/routes` - Get agency routes.
- `POST /api/agencies/{id}/routes` - Create a new route.
- `GET /api/agencies/{id}/reviews` - Get agency reviews.

## Trips & Search
- `GET /api/trips/search?from={city}&to={city}&date={date}` - Search for trips.
- `GET /api/trips/{id}` - Get trip details.
- `GET /api/trips/{id}/seats` - Get seat availability for a trip.

## Bookings
- `POST /api/bookings` - Create a new booking.
- `GET /api/bookings/{id}` - Get booking details.
- `POST /api/bookings/{id}/cancel` - Cancel a booking.
- `POST /api/bookings/{id}/verify` - Verify a ticket (QR code scan).

## Pricing & subscriptions
- `GET /api/plans` - Get available subscription plans.
- `POST /api/subscriptions` - Subscribe to a plan.

## Notifications
- `POST /api/notifications/send` - System to send SMS/Email (Backend internal mostly).

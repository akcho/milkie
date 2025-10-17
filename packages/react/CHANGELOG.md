# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-10-17

### Added

#### Subscription Status Route (`createSubscriptionStatusRoute`)
- Comprehensive JSDoc documentation for all exported types and functions
- Email validation with `validateEmail()` utility function
- Configurable `allowedStatuses` option (defaults to `["active", "trialing"]`)
- Structured error codes via `SubscriptionErrorCode` enum:
  - `EMAIL_REQUIRED` - No email provided in query params
  - `INVALID_EMAIL` - Email format validation failed
  - `NO_SUBSCRIPTION` - User has no subscription
  - `DATABASE_ERROR` - Database query failed
- Type-safe response types:
  - `SubscriptionStatusResponse` - Success response interface
  - `SubscriptionErrorResponse` - Error response interface
- Detailed usage examples in JSDoc comments

### Changed
- Replaced hardcoded status checks with configurable `allowedStatuses` array
- Enhanced error responses to include structured error codes
- Improved inline documentation for `SubscriptionDatabaseAdapter` interface methods

### Fixed
- Added email format validation before database queries
- Improved error specificity for better debugging and error handling

---

## Future Releases

For upcoming features and breaking changes, see [GitHub Issues](https://github.com/akcho/milkie/issues).

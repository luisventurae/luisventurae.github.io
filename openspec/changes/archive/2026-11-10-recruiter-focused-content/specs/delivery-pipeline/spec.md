# Spec Delta

## ADDED Requirements

### Requirement: Scheduled yearly rebuild

The production deployment SHALL also run on a yearly schedule in early January from `master`, so that build-time values such as years of experience stay current without a code change.

#### Scenario: New year

- **WHEN** the scheduled run fires on January 2
- **THEN** the web app is rebuilt and published from `master` with the updated years of experience

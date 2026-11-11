# contact-api Specification

## Purpose

Permitir que un visitante solicite el CV dejando su email y empresa, protegido contra abuso, y que el propietario sea notificado.

## Requirements

### Requirement: CV request validation

`POST /contact` SHALL accept a JSON body with `email`, `company`, `locale`, a captcha token and an optional `interests` list of known vacancy requirement identifiers without duplicates, and SHALL reject with status 400 any body with an invalid email, empty company, unsupported locale, missing token or unknown interest.

#### Scenario: Invalid email

- **WHEN** the body has `email: "not-an-email"`
- **THEN** the response is 400 with a machine-readable error code

#### Scenario: Unknown interest

- **WHEN** the body has `interests: ["cobol"]`
- **THEN** the response is 400 with a machine-readable error code

### Requirement: Captcha verification

The API SHALL verify the captcha token with the provider before any other side effect and SHALL respond 403 when verification fails.

#### Scenario: Failed captcha

- **WHEN** the provider rejects the token
- **THEN** the response is 403 and no notification is sent

### Requirement: Rate limiting

The API SHALL allow at most 5 CV requests per client IP within 10 minutes and SHALL respond 429 beyond that.

#### Scenario: Sixth request

- **WHEN** the same IP sends a sixth valid request within 10 minutes
- **THEN** the response is 429

### Requirement: Signed CV download

A successful request SHALL respond 200 with `{ "status": "sent" }` and SHALL NOT include the download URL in the response. The download URL SHALL be valid for 7 days and serve the CV PDF stored in private object storage in the requested locale (falling back to Spanish). Expired or tampered URLs SHALL respond 403.

#### Scenario: Download within validity

- **WHEN** the recipient opens the emailed URL within 7 days
- **THEN** the PDF is served with `Content-Type: application/pdf`

#### Scenario: Tampered token

- **WHEN** any character of the token is changed
- **THEN** the response is 403

#### Scenario: URL not exposed to the browser

- **WHEN** a valid request succeeds
- **THEN** the response body contains no download URL

### Requirement: Owner notification

After a successful request the owner SHALL receive an email with the requester's email, company and selected interests. A notification failure SHALL NOT prevent the CV email from being sent nor change the response.

#### Scenario: Email provider down

- **WHEN** sending the owner notification fails
- **THEN** the response is still 200 and the failure is logged

#### Scenario: Interests listed

- **WHEN** the request includes interests "nodejs" and "aws"
- **THEN** the owner notification lists both interests

### Requirement: CORS and security headers

The API SHALL only allow cross-origin requests from the configured site origin and SHALL include `X-Content-Type-Options: nosniff` and a restrictive referrer policy in every response.

#### Scenario: Foreign origin

- **WHEN** a preflight request comes from an origin other than the configured one
- **THEN** no `Access-Control-Allow-Origin` header for that origin is returned

### Requirement: Request size limits

The API SHALL reject request bodies larger than 4 KB on `/contact` with status 413 and SHALL never echo request content or secrets in error responses.

#### Scenario: Oversized body

- **WHEN** a 5 KB body is posted to `/contact`
- **THEN** the response is 413 with a generic error code

### Requirement: CV delivered by email

After captcha and rate limits pass, the API SHALL email the requester a localized message containing the signed download URL. The message SHALL NOT include any free text supplied by the requester. If the email cannot be sent the API SHALL respond 502 with a machine-readable error code.

#### Scenario: Recipient receives the link

- **WHEN** a valid request in `en` is submitted for `recruiter@acme.com`
- **THEN** `recruiter@acme.com` receives an English email with a download URL valid for 7 days

#### Scenario: No requester text in the email

- **WHEN** the request has `company: "Buy cheap pills at spam.example"`
- **THEN** the email sent to the requester does not contain that text

#### Scenario: Provider failure

- **WHEN** the email provider rejects the CV email
- **THEN** the response is 502 with a machine-readable error code

### Requirement: Per-recipient rate limit

The API SHALL send at most 2 CV emails to the same address within 24 hours and SHALL respond 429 beyond that, independently of the client IP. The address SHALL be keyed by a hash, never stored in clear text.

#### Scenario: Third email to the same address

- **WHEN** three valid requests for the same email arrive from different IPs within 24 hours
- **THEN** the third response is 429 and no email is sent

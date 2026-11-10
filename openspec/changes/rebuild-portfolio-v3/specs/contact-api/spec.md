# Spec Delta

## Purpose

Permitir que un visitante solicite el CV dejando su email y empresa, protegido contra abuso, y que el propietario sea notificado.

## ADDED Requirements

### Requirement: CV request validation

`POST /contact` SHALL accept a JSON body with `email`, `company`, `locale` and a captcha token, and SHALL reject with status 400 any body with an invalid email, empty company, unsupported locale or missing token.

#### Scenario: Invalid email

- **WHEN** the body has `email: "not-an-email"`
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

A successful request SHALL respond 200 with a download URL that is valid for 10 minutes and serves the CV PDF in the requested locale (falling back to Spanish). Expired or tampered URLs SHALL respond 403.

#### Scenario: Download within validity

- **WHEN** the visitor opens the returned URL within 10 minutes
- **THEN** the PDF is served with `Content-Type: application/pdf`

#### Scenario: Tampered token

- **WHEN** any character of the token is changed
- **THEN** the response is 403

### Requirement: Owner notification

After a successful request the owner SHALL receive an email with the requester's email and company. A notification failure SHALL NOT prevent the download.

#### Scenario: Email provider down

- **WHEN** sending the notification fails
- **THEN** the response is still 200 with the download URL and the failure is logged

### Requirement: CORS and security headers

The API SHALL only allow cross-origin requests from the configured site origin and SHALL include `X-Content-Type-Options: nosniff` and a restrictive referrer policy in every response.

#### Scenario: Foreign origin

- **WHEN** a preflight request comes from an origin other than the configured one
- **THEN** no `Access-Control-Allow-Origin` header for that origin is returned

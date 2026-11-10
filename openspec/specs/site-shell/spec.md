# site-shell Specification

## Purpose

Estructura común del sitio: rutas por idioma, tema, navegación, metadatos SEO y accesibilidad base que comparten todas las secciones.

## Requirements

### Requirement: Localized routes

The site SHALL serve Spanish at `/`, English at `/en/` and French at `/fr/`, each as prerendered static HTML with the `lang` attribute set to the page locale.

#### Scenario: Default locale

- **WHEN** a visitor opens `/`
- **THEN** the page is rendered in Spanish with `<html lang="es">`

#### Scenario: Language switch keeps position

- **WHEN** a visitor switches language from the navigation while scrolled to a section
- **THEN** the equivalent page in the chosen language opens at the same section anchor

### Requirement: SEO metadata

Each localized page SHALL include a localized title and description, a canonical URL, `hreflang` alternates for all locales plus `x-default`, a `robots` directive, a sitemap reference and a `robots.txt` at the site root.

#### Scenario: Alternates present

- **WHEN** the `/en/` page HTML is inspected
- **THEN** it contains `hreflang` links for `es`, `en`, `fr` and `x-default`

#### Scenario: Sitemap

- **WHEN** a crawler requests `/sitemap-index.xml`
- **THEN** it lists the three localized pages with their alternates

### Requirement: Open Graph and social cards

Each localized page SHALL include Open Graph tags (`og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`, `og:locale` and `og:locale:alternate`, `og:image` with width, height and alt text) and Twitter card tags (`summary_large_image`). The share image SHALL be a 1200×630 image per locale that does not use a portrait photo.

#### Scenario: Shared link preview

- **WHEN** the `/fr/` URL is shared on a social network
- **THEN** the preview shows the French title, description and the French 1200×630 share image

### Requirement: Structured data for rich results

Each localized page SHALL embed JSON-LD that is valid for Google rich results: a `ProfilePage` whose `mainEntity` is a `Person` (name, alternateName, jobTitle, url, image, sameAs social profiles, knowsAbout, knowsLanguage), a `WebSite`, and an `ItemList` of the listed projects as `CreativeWork` items, all in the page language and linked by `@id`.

#### Scenario: Valid structured data

- **WHEN** the published page is checked with Google's Rich Results Test
- **THEN** a valid Profile page item is detected with no errors

#### Scenario: Data matches visible content

- **WHEN** the JSON-LD of any page is compared with the rendered projects
- **THEN** every project in the `ItemList` is visible on the page with the same name

### Requirement: Web security headers

Each page SHALL declare a Content Security Policy that only allows the site itself, the captcha provider and the configured API, and a strict referrer policy.

#### Scenario: Unexpected script blocked

- **WHEN** a script from a non-allowed origin is injected into the page
- **THEN** the browser blocks it according to the policy

### Requirement: Theme

The site SHALL support light and dark themes, defaulting to the stored preference or, if none, the operating-system preference, and SHALL apply the theme before first paint.

#### Scenario: No flash on load

- **WHEN** a visitor with a stored dark preference loads any page
- **THEN** the first painted frame already uses the dark theme

#### Scenario: Toggle persists

- **WHEN** the visitor toggles the theme and reloads
- **THEN** the chosen theme is preserved

### Requirement: Accessible baseline

The site SHALL be fully operable with a keyboard, show a visible focus indicator, provide a skip link to the main content, meet WCAG AA contrast and honor `prefers-reduced-motion` by removing positional motion.

#### Scenario: Reduced motion

- **WHEN** the operating system requests reduced motion
- **THEN** no element moves or scales during transitions, and only opacity changes remain

# Spec Delta

## Purpose

Estructura común del sitio: rutas por idioma, tema, navegación, metadatos SEO y accesibilidad base que comparten todas las secciones.

## ADDED Requirements

### Requirement: Localized routes

The site SHALL serve Spanish at `/`, English at `/en/` and French at `/fr/`, each as prerendered static HTML with the `lang` attribute set to the page locale.

#### Scenario: Default locale

- **WHEN** a visitor opens `/`
- **THEN** the page is rendered in Spanish with `<html lang="es">`

#### Scenario: Language switch keeps position

- **WHEN** a visitor switches language from the navigation while scrolled to a section
- **THEN** the equivalent page in the chosen language opens at the same section anchor

### Requirement: SEO metadata

Each localized page SHALL include title, description, canonical URL, `hreflang` alternates for all locales plus `x-default`, Open Graph tags and a JSON-LD graph describing the person, website and profile page.

#### Scenario: Alternates present

- **WHEN** the `/en/` page HTML is inspected
- **THEN** it contains `hreflang` links for `es`, `en`, `fr` and `x-default`

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

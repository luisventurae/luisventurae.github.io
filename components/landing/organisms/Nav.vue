<script setup lang="ts">
import ThemeToggle from '~/components/landing/atoms/ThemeToggle.vue'

const { t, locale, setLocale } = useI18n()

interface NavLink {
  labelKey: string
  href: string
}

const links: NavLink[] = [
  { labelKey: 'nav.skills',   href: '#skills' },
  { labelKey: 'nav.projects', href: '#experience' },
  { labelKey: 'nav.contact',  href: '#dinamic-download' },
]

const localeOptions = ['es', 'en', 'fr'] as const
type LocaleCode = typeof localeOptions[number]

const menuOpen = ref<boolean>(false)
const toggleMenu = (): void => { menuOpen.value = !menuOpen.value }
const closeMenu = (): void => { menuOpen.value = false }

const switchLocale = (code: LocaleCode): void => {
  setLocale(code)
  closeMenu()
}
</script>

<template>
  <nav class="nav__wrapper" :aria-label="t('nav.mainNav')">
    <div class="nav__container">
      <a href="#home" class="nav__brand" @click="closeMenu">LVE</a>

      <ul class="nav__links" :class="{ 'nav__links--open': menuOpen }">
        <li v-for="link in links" :key="link.href">
          <a :href="link.href" class="nav__link" @click="closeMenu">
            {{ t(link.labelKey) }}
          </a>
        </li>
      </ul>

      <div class="nav__actions">
        <div class="nav__locale">
          <button
            v-for="code in localeOptions"
            :key="code"
            class="nav__locale__btn"
            :class="{ 'nav__locale__btn--active': locale === code }"
            @click="switchLocale(code)"
          >
            {{ code.toUpperCase() }}
          </button>
        </div>
        <ThemeToggle />
        <button
          class="nav__hamburger"
          :aria-expanded="menuOpen"
          :aria-label="t('nav.openMenu')"
          @click="toggleMenu"
        >
          <span class="nav__hamburger__bar" :class="{ 'nav__hamburger__bar--open': menuOpen }" />
        </button>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@import '~/global/_breakpoints.module.scss';

.nav {
  &__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: var(--color-nav-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(128, 128, 128, 0.15);
    transition: background-color 0.3s ease;
    max-width: unset;
    margin: unset;
  }

  &__container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 24px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  &__brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    color: var(--color-accent);
    text-decoration: none;
    letter-spacing: 2px;
    flex-shrink: 0;
  }

  &__links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 32px;
  }

  &__link {
    color: var(--color-fg);
    text-decoration: none;
    font-size: 16px;
    letter-spacing: 1px;
    position: relative;
    transition: color 0.2s ease;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--color-accent);
      transition: width 0.25s ease;
    }

    &:hover {
      color: var(--color-accent);
      &::after { width: 100%; }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__locale {
    display: flex;
    gap: 4px;

    &__btn {
      background: transparent;
      border: 1px solid transparent;
      color: var(--color-fg);
      cursor: pointer;
      font-size: 12px;
      font-family: Aldrich, sans-serif;
      padding: 3px 6px;
      border-radius: 4px;
      opacity: 0.5;
      transition: opacity 0.15s ease, border-color 0.15s ease;

      &--active {
        opacity: 1;
        border-color: var(--color-accent);
        color: var(--color-accent);
      }

      &:hover:not(&--active) {
        opacity: 0.9;
      }
    }
  }

  &__hamburger {
    display: none;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;
    color: var(--color-fg);

    &__bar {
      display: block;
      width: 24px;
      height: 2px;
      background-color: var(--color-fg);
      position: relative;
      transition: background-color 0.2s ease;

      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 0;
        width: 24px;
        height: 2px;
        background-color: var(--color-fg);
        transition: transform 0.3s ease, top 0.3s ease;
      }

      &::before { top: -7px; }
      &::after  { top:  7px; }

      &--open {
        background-color: transparent;
        &::before { top: 0; transform: rotate(45deg); }
        &::after  { top: 0; transform: rotate(-45deg); }
      }
    }
  }
}

@media (max-width: $BK_DESKTOP) {
  .nav {
    &__links {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      background-color: var(--color-nav-bg);
      backdrop-filter: blur(12px);
      padding: 16px 24px 24px;
      gap: 16px;
      border-bottom: 1px solid rgba(128, 128, 128, 0.15);

      &--open { display: flex; }
    }

    &__hamburger { display: block; }
  }
}
</style>

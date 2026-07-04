type Theme = 'dark' | 'light'

interface ThemeComposable {
  theme: Ref<Theme>
  toggleTheme: () => void
  initTheme: () => void
}

export const useTheme = (): ThemeComposable => {
  const theme = useState<Theme>('theme', () => 'dark')

  const applyTheme = (t: Theme): void => {
    theme.value = t
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', t)
      localStorage.setItem('theme', t)
    }
  }

  const toggleTheme = (): void => {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  const initTheme = (): void => {
    if (!import.meta.client) return
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved)
      return
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(prefersDark ? 'dark' : 'light')
  }

  return { theme, toggleTheme, initTheme }
}

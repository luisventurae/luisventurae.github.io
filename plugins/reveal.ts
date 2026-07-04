import type { DirectiveBinding, ObjectDirective } from 'vue'

interface RevealOptions {
  delay?: number
  threshold?: number
}

const revealDirective: ObjectDirective<HTMLElement, RevealOptions> = {
  // SSR stub — Vue server-renderer needs getSSRProps to exist on directives
  getSSRProps() {
    return {}
  },
  mounted(el: HTMLElement, binding: DirectiveBinding<RevealOptions>) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const delay = binding.value?.delay ?? 0
    const threshold = binding.value?.threshold ?? 0.15

    el.style.opacity = '0'
    el.style.transform = 'translateY(28px)'
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<HTMLElement, RevealOptions>('reveal', revealDirective)
})

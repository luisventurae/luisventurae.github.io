<script setup lang="ts">
const { t, locale } = useI18n()

interface Props {
  cards: ExperiencePropMolecule[]
  initialIndex: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'close'): void }>()

const currentIndex = ref(props.initialIndex)
const slideDir = ref<'next' | 'prev'>('next')

const card = computed(() => props.cards[currentIndex.value])
const total = computed(() => props.cards.length)
const canPrev = computed(() => currentIndex.value > 0)
const canNext = computed(() => currentIndex.value < total.value - 1)

const navigate = (dir: 'next' | 'prev'): void => {
  if (dir === 'next' && !canNext.value) return
  if (dir === 'prev' && !canPrev.value) return
  slideDir.value = dir
  currentIndex.value += dir === 'next' ? 1 : -1
}

const formattedDate = computed<string | null>(() => {
  if (!card.value.date) return null
  const [year, month] = card.value.date.split('-').map(Number)
  return new Intl.DateTimeFormat(locale.value, { year: 'numeric', month: 'long' })
    .format(new Date(year, month - 1))
})

onMounted(() => {
  document.body.style.overflow = 'hidden'

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape')      emit('close')
    if (e.key === 'ArrowRight')  navigate('next')
    if (e.key === 'ArrowLeft')   navigate('prev')
  }
  window.addEventListener('keydown', onKey)

  onUnmounted(() => {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKey)
  })
})
</script>

<template>
  <Teleport to="body">
    <div
      class="project-modal__backdrop"
      role="dialog"
      aria-modal="true"
      :aria-label="t('modal.label')"
      @click.self="emit('close')"
    >
      <div class="project-modal__panel">

        <!-- Left: image -->
        <div class="project-modal__image-section">
          <button
            class="project-modal__nav project-modal__nav--prev"
            :disabled="!canPrev"
            :aria-label="t('modal.previous')"
            @click="navigate('prev')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div class="project-modal__image-wrap">
            <Transition :name="`slide-${slideDir}`">
              <img
                :key="card.order"
                :src="card.image_url"
                :alt="card.title"
                class="project-modal__image"
                loading="lazy"
                decoding="async"
              />
            </Transition>
          </div>

          <button
            class="project-modal__nav project-modal__nav--next"
            :disabled="!canNext"
            :aria-label="t('modal.next')"
            @click="navigate('next')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <!-- Right: details -->
        <div class="project-modal__details">
          <button
            class="project-modal__close"
            :aria-label="t('modal.close')"
            @click="emit('close')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <Transition name="fade-content" mode="out-in">
            <div :key="card.order" class="project-modal__info">
              <div class="project-modal__tags">
                <span v-for="tag in card.tags" :key="tag" class="project-modal__tag">{{ tag }}</span>
              </div>

              <h2 class="project-modal__title">{{ card.title }}</h2>
              <p class="project-modal__company">{{ card.company }}</p>

              <div v-if="formattedDate" class="project-modal__field">
                <span class="project-modal__label">{{ t('modal.period') }}</span>
                <span>{{ formattedDate }}</span>
              </div>

              <div class="project-modal__field">
                <span class="project-modal__label">{{ t('modal.description') }}</span>
                <p class="project-modal__description">{{ card.description }}</p>
              </div>

              <div v-if="card.techs?.length" class="project-modal__field">
                <span class="project-modal__label">{{ t('modal.technologies') }}</span>
                <div class="project-modal__tech-list">
                  <span v-for="tech in card.techs" :key="tech" class="project-modal__tech">{{ tech }}</span>
                </div>
              </div>

              <a
                v-if="card.url"
                :href="card.url"
                target="_blank"
                rel="noopener noreferrer"
                class="project-modal__site-link"
              >
                {{ t('modal.visitSite') }}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                </svg>
              </a>
            </div>
          </Transition>

          <div class="project-modal__counter">
            <button
              class="project-modal__counter-btn"
              :disabled="!canPrev"
              :aria-label="t('modal.previous')"
              @click="navigate('prev')"
            >‹</button>
            <span class="project-modal__counter-text">{{ currentIndex + 1 }} / {{ total }}</span>
            <button
              class="project-modal__counter-btn"
              :disabled="!canNext"
              :aria-label="t('modal.next')"
              @click="navigate('next')"
            >›</button>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
@import '~/global/_breakpoints.module.scss';

.project-modal {
  &__backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.82);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: backdrop-in 0.2s ease forwards;
  }

  &__panel {
    display: flex;
    flex-direction: row;
    width: min(90vw, 1100px);
    height: min(85vh, 700px);
    background-color: var(--color-card-bg);
    border-radius: 16px;
    overflow: hidden;
    animation: panel-in 0.25s cubic-bezier(0.34, 1.36, 0.64, 1) forwards;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  }

  // ── Image section ──────────────────────────────────────────────
  &__image-section {
    position: relative;
    flex: 0 0 60%;
    background-color: #000;
    overflow: hidden;
  }

  &__image-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    display: block;
  }

  &__nav {
    position: absolute;
    z-index: 10;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background-color: rgba(0, 0, 0, 0.55);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.75;
    transition: background-color 0.15s ease, opacity 0.15s ease, transform 0.15s ease;

    svg { width: 20px; height: 20px; }

    &:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.82);
      opacity: 1;
      transform: translateY(-50%) scale(1.1);
    }

    &:disabled { opacity: 0.18; cursor: default; }

    &--prev { left: 12px; }
    &--next { right: 12px; }
  }

  // ── Details section ────────────────────────────────────────────
  &__details {
    flex: 0 0 40%;
    display: flex;
    flex-direction: column;
    padding: 48px 28px 20px;
    overflow-y: auto;
    position: relative;

    // thin scrollbar
    scrollbar-width: thin;
    scrollbar-color: rgba(128, 128, 128, 0.3) transparent;
  }

  &__close {
    position: absolute;
    top: 14px;
    right: 14px;
    background: transparent;
    border: none;
    color: var(--color-fg);
    cursor: pointer;
    opacity: 0.45;
    padding: 6px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.15s ease, transform 0.15s ease, background-color 0.15s ease;

    svg { width: 20px; height: 20px; }

    &:hover {
      opacity: 1;
      transform: scale(1.1);
      background-color: rgba(128, 128, 128, 0.15);
    }
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 14px;
  }

  &__tag {
    background-color: var(--color-accent);
    color: var(--color-bg);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 100px;
  }

  &__title {
    font-size: 36px;
    margin: 0 0 2px;
    line-height: 1.1;
    color: var(--color-fg);
  }

  &__company {
    color: var(--color-accent);
    font-size: 13px;
    margin: 0 0 20px;
    opacity: 0.9;
    letter-spacing: 0.5px;
  }

  &__field {
    margin-bottom: 16px;
  }

  &__label {
    display: block;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    opacity: 0.45;
    margin-bottom: 5px;
    font-family: Aldrich, sans-serif;
  }

  &__description {
    font-size: 14px;
    line-height: 1.65;
    margin: 0;
    opacity: 0.82;
  }

  &__tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 2px;
  }

  &__tech {
    background-color: var(--color-bg);
    color: var(--color-fg);
    border: 1px solid rgba(128, 128, 128, 0.3);
    font-size: 12px;
    font-family: Aldrich, sans-serif;
    padding: 4px 10px;
    border-radius: 6px;
    opacity: 0.8;
    transition: opacity 0.15s ease, border-color 0.15s ease;

    &:hover {
      opacity: 1;
      border-color: var(--color-accent);
    }
  }

  &__site-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--color-accent);
    text-decoration: none;
    font-size: 14px;
    border-bottom: 1px solid transparent;
    padding-bottom: 2px;
    margin-top: 4px;
    margin-bottom: 20px;
    transition: border-color 0.2s ease;
    width: fit-content;

    svg { width: 14px; height: 14px; }

    &:hover { border-color: var(--color-accent); }
  }

  &__counter {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding-top: 14px;
    border-top: 1px solid rgba(128, 128, 128, 0.18);
    margin-top: auto;
  }

  &__counter-text {
    font-size: 13px;
    opacity: 0.5;
    font-family: Aldrich, sans-serif;
    min-width: 40px;
    text-align: center;
  }

  &__counter-btn {
    background: transparent;
    border: none;
    color: var(--color-fg);
    font-size: 28px;
    line-height: 1;
    cursor: pointer;
    padding: 0 6px;
    opacity: 0.5;
    font-family: sans-serif;
    transition: opacity 0.15s ease, transform 0.15s ease;

    &:hover:not(:disabled) {
      opacity: 1;
      transform: scale(1.2);
    }

    &:disabled { opacity: 0.15; cursor: default; }
  }
}

// ── Animations ─────────────────────────────────────────────────
@keyframes backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes panel-in {
  from { opacity: 0; transform: scale(0.94) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

// Image slide transitions (simultaneous enter + leave)
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.slide-next-enter-from { transform: translateX(100%); opacity: 0; }
.slide-next-leave-to   { transform: translateX(-100%); opacity: 0; }
.slide-prev-enter-from { transform: translateX(-100%); opacity: 0; }
.slide-prev-leave-to   { transform: translateX(100%); opacity: 0; }

// Content fade
.fade-content-enter-active,
.fade-content-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-content-enter-from,
.fade-content-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

// ── Responsive ─────────────────────────────────────────────────
@media (max-width: $BK_DESKTOP) {
  .project-modal {
    &__backdrop { padding: 0; }

    &__panel {
      flex-direction: column;
      width: 100vw;
      height: 100dvh;
      max-height: unset;
      border-radius: 0;
    }

    &__image-section {
      flex: 0 0 45%;
      min-height: 200px;
    }

    &__nav {
      width: 38px;
      height: 38px;
      svg { width: 16px; height: 16px; }
    }

    &__details {
      flex: 1;
      padding: 16px 20px 12px;
    }

    &__title { font-size: 26px; }

    &__close {
      top: 10px;
      right: 10px;
    }
  }
}
</style>

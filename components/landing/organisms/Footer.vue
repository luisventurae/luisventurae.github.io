<script setup lang="ts">
interface SvgModule {
  default: Component
}

const title = 'LUISVENTURAE'
const socials: Social[] = [
  { key: 'linkedin', svg: 'linkedin.svg', url: 'http://www.linkedin.com/in/luisventurae' },
  { key: 'github', svg: 'github.svg', url: 'http://www.github.com/luisventurae' },
  { key: 'gitlab', svg: 'gitlab.svg', url: 'http://www.gitlab.com/luisventurae' },
  { key: 'twitter', svg: 'twitter.svg', url: 'http://www.twitter.com/luisventurae' },
  { key: 'facebook', svg: 'facebook.svg', url: 'http://www.facebook.com/luisventurae' },
]

const assets = import.meta.glob<SvgModule>('~/assets/icons/social/*.svg', {
  eager: true,
  import: 'default',
})

const getIcon = (path: string): Component => {
  const key = `/assets/icons/social/${path}`
  const mod = assets[key] as SvgModule | undefined
  if (!mod) throw new Error(`Icon not found: ${key}`)
  return mod.default
}
</script>

<template>
  <footer id="contact" class="footer__container">
    <div class="footer__content">
      <div class="footer__content__head">
        <h2>{{ title }}</h2>
      </div>
      <div class="footer__content__body">
        <ul>
          <li v-for="social in socials" :key="social.key">
            <a
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :title="social.key"
            >
              <component :is="getIcon(social.svg)" />
            </a>
          </li>
        </ul>
      </div>
      <div class="footer__content__foot">
        <p>© Copyright 2024 - Todos los derechos reservados</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@import '~/global/_variables.module';
@import '~/global/_breakpoints.module';

.footer {
  &__container {
    background-color: var(--color-card-bg);
    padding: 70px 0 20px 0;
  }

  &__content {
    text-align: center;

    &__head {
      h2 {
        margin-top: 0;
      }
    }

    &__body {
      ul {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 64px;
        padding: 0;

        li {
          list-style: none;
          margin: 4px;
          transition: scale 0.1s ease;

          a {
            border: 2px solid var(--color-border);
            border-radius: 50%;
            padding: 22px 18px;
            display: inline-flex;

            svg {
              color: var(--color-fg);
              width: 32px;
              height: auto;
            }
          }

          &:hover {
            scale: 1.1;
          }
        }
      }
    }

    &__foot {
      font-size: 14px;
    }
  }
}

@media (max-width: $BK_DESKTOP) {
  .footer {
    &__content {
      &__body {
        ul {
          li {
            a {
              padding: 16px 15px;

              svg {
                width: 22px;
                height: auto;
              }
            }
          }
        }
      }
    }
  }
}
</style>

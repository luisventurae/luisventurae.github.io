<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "Footer",
  setup() {
    const title = "LUISVENTURAE"
    const socials = <Social[]>[
      {
        key: "linkedin",
        svg: "linkedin.svg",
        url: "http://www.linkedin.com/in/luisventurae",
      },
      {
        key: "github",
        svg: "github.svg",
        url: "http://www.github.com/luisventurae",
      },
      {
        key: "gitlab",
        svg: "gitlab.svg",
        url: "http://www.gitlab.com/luisventurae",
      },
      {
        key: "twitter",
        svg: "twitter.svg",
        url: "http://www.twitter.com/luisventurae",
      },
      {
        key: "facebook",
        svg: "facebook.svg",
        url: "http://www.facebook.com/luisventurae",
      },
    ]
    function getIcon(path: string): Component {
      const assets = import.meta.glob("~/assets/icons/social/*.svg", {
        eager: true,
        import: "default",
      })
      // @ts-expect-error: wrong type info
      return assets["/assets/icons/social/" + path]
    }

    return { title, socials, getIcon }
  },
})
</script>

<template>
  <footer class="footer__container">
    <div class="footer__content">
      <div class="footer__content__head">
        <h2>{{ title }}</h2>
      </div>
      <div class="footer__content__body">
        <ul>
          <li v-for="social in socials">
            <a
              :href="social.url"
              target="_blank"
              rel="noopenner noreferrer"
              :title="social.key"
            >
              <component :is="getIcon(social.svg)" />
            </a>
          </li>
        </ul>
      </div>
      <div class="footer__content__foot">
        <p>© Copyright 2024 Todos los derechos reservados</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@import "~/global/_variables.module";
@import "~/global/_breakpoints.module";

.footer {
  &__container {
    background-color: $SECONDARY_DARK;
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
          a {
            border: 2px solid #fff;
            border-radius: 50%;
            padding: 22px 18px;
            svg {
              color: #fff;
              width: 32px;
              height: auto;
            }
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

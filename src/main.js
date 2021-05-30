// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from "~/layouts/Default.vue"
import "/static/assets/web/assets/mobirise-icons/mobirise-icons.css"
import "/static/assets/web/assets/mobirise-icons2/mobirise2.css"
import "/static/assets/tether/tether.min.css"
import "/static/assets/bootstrap/css/bootstrap.min.css"
import "/static/assets/bootstrap/css/bootstrap-grid.min.css"
import "/static/assets/bootstrap/css/bootstrap-reboot.min.css"
import "/static/assets/dropdown/css/style.css"
import "/static/assets/socicon/css/styles.css"
import "/static/assets/theme/css/style.css"
import "/static/assets/styles/css/mbr-additional.css"

export default function(Vue, { isServer, router, head, isClient }) {
  /* head.htmlAttrs = { lang: '' } */
  // Statics scripts
  head.script.push({ src: '/assets/web/assets/jquery/jquery.min.js', body: true, async: true })
  head.script.push({ src: '/assets/popper/popper.min.js', body: true, async: true })
  head.script.push({ src: '/assets/tether/tether.min.js', body: true, async: true })
  head.script.push({ src: '/assets/bootstrap/js/bootstrap.min.js', body: true, async: true })
  head.script.push({ src: '/assets/smoothscroll/smooth-scroll.js', body: true, async: true })
  head.script.push({ src: '/assets/dropdown/js/nav-dropdown.js', body: true, async: true })
  head.script.push({ src: '/assets/dropdown/js/navbar-dropdown.js', body: true, async: true })
  head.script.push({ src: '/assets/touchswipe/jquery.touch-swipe.min.js', body: true, async: true })
  head.script.push({ src: '/assets/bootstrapcarouselswipe/bootstrap-carousel-swipe.js', body: true, async: true })
  head.script.push({ src: '/assets/mbr-testimonials-slider/mbr-testimonials-slider.js', body: true, async: true })
  head.script.push({ src: '/assets/viewportchecker/jquery.viewportchecker.js', body: true, async: true })
  head.script.push({ src: '/assets/sociallikes/social-likes.js', body: true, async: true })
  head.script.push({ src: '/assets/theme/js/script.js', body: true, async: true, defer: true })

  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout)
}

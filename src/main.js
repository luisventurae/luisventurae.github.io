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

// import Jquery from "/static/assets/web/assets/jquery/jquery.min.js"
// import Popper from "/static/assets/popper/popper.min.js"
// import Tether from "/static/assets/tether/tether.min.js"
// import Bootstrap from "/static/assets/bootstrap/js/bootstrap.min.js"
import SmothScroll from "/static/assets/smoothscroll/smooth-scroll.js"
// import NavDropDown from "/static/assets/dropdown/js/nav-dropdown.js"
// import NavbarDropdown from "/static/assets/dropdown/js/navbar-dropdown.js"
// import JqueryTouchSwipe from "/static/assets/touchswipe/jquery.touch-swipe.min.js"
// import BootstrapCarousel from "/static/assets/bootstrapcarouselswipe/bootstrap-carousel-swipe.js"
// import MbrTestimonialsSlide from "/static/assets/mbr-testimonials-slider/mbr-testimonials-slider.js"
// import ViewportChecker from "/static/assets/viewportchecker/jquery.viewportchecker.js"
// import SocialLikes from "/static/assets/sociallikes/social-likes.js"
// import Script from "/static/assets/theme/js/script.js"

export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout)
  // Vue.use(Jquery)
  // Vue.use(Popper)
  // Vue.use(Tether)
  // Vue.use(Bootstrap)
  Vue.use(SmothScroll)
  // Vue.use(NavDropDown)
  // Vue.use(NavbarDropdown)
  // Vue.use(JqueryTouchSwipe)
  // Vue.use(BootstrapCarousel)
  // Vue.use(MbrTestimonialsSlide)
  // Vue.use(ViewportChecker)
  // Vue.use(SocialLikes)
  // Vue.use(Script)
}

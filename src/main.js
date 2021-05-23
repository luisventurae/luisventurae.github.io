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
import "/static/assets/styles/css/mbr-additional.css"

export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout)
}

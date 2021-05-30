<template>
  <!-- Whois? -->
  <section
    class="carousel slide testimonials-slider cid-sbF1IXXjdp"
    data-interval="false"
    id="testimonials1-4"
  >
    <div
      class="mbr-overlay"
      style="opacity: 0.7; background-color: rgb(35, 35, 35);"
    ></div>
    <div class="container text-center">
      <h2 class="mbr-section-title mbr-fonts-style mbr-white display-2">
        {{ data.title }}
      </h2>
      <div class="underline align-center">
        <div class="line"></div>
      </div>

      <div class="row justify-content-center carousel-row">
        <div class="col-md-10">
          <div
            class="carousel slide pt-5"
            role="listbox"
            data-pause="true"
            data-keyboard="false"
            data-ride="carousel"
            :data-interval="delay"
          >
            <div class="slider-testimonials">
              <div class="carousel-inner">
                <!-- Slider -->
                <div
                  class="carousel-item"
                  v-for="slide in data.slider"
                  :key="slide.key"
                >
                  <div class="user col-md-8">
                    <div class="user_image">
                      <img loading="lazy" :src="slide.image" :alt="slide.image_alt" />
                    </div>
                    <div class="user_text">
                      <p class="mbr-fonts-style display-7">
                        {{ slide.text }}
                      </p>
                    </div>
                  </div>
                </div>
                <!-- End Slider -->
              </div>
            </div>
          </div>
          <div class="carousel-controls">
            <a
              class="carousel-control-prev carousel-control"
              role="button"
              data-slide="prev"
            >
              <span
                aria-hidden="true"
                class="mbri-arrow-prev mbr-iconfont"
              ></span>
              <span class="sr-only">Previous</span>
            </a>

            <a
              class="carousel-control-next carousel-control"
              role="button"
              data-slide="next"
            >
              <span
                aria-hidden="true"
                class="mbri-arrow-next mbr-iconfont"
              ></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Whois",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    delay: 15000,
  })
};
</script>

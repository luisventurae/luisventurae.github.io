<template>
  <!-- Skills Front -->
  <section class="cid-rzMr7rM4hq" id="features1-1">
    <div class="container">
      <h2 class="mbr-fonts-style mbr-section-title align-center display-2">
        {{ data.title }}
      </h2>
      <div class="underline align-center">
        <div class="line"></div>
      </div>

      <h3
        class="mbr-fonts-style mbr-section-subtitle align-center mbr-light pt-3 display-5"
      >
        {{ data.subtitle }}
      </h3>

      <div class="row justify-content-center pt-5">

        <div v-for="tech in data.techs" :key="tech.key" class="col-md-6 row-item col-lg-3">
          <div class="card-img pb-3 align-left">
            <span :class="tech.icon" class="mbr-iconfont mobi-mbri"></span>
          </div>
          <h4 class="mbr-fonts-style display-5">{{tech.tech}}</h4>

          <p class="mbr-text mbr-fonts-style display-7">
            {{ tech.description }}
          </p>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Front",
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
}
</script>

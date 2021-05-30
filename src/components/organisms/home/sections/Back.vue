<template>
  <div>
    <!-- Skills Back -->
    <section class="cid-sbFueFKZy0" id="features1-5">
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
        <div class="row justify-content-center pt-5"></div>
      </div>
    </section>
    <section class="counters cid-rzMr96oZs2" id="features3-2">
      <div class="container-fluid">
        <div class="row justify-content-center align-center">
          <div v-for="tech in data.techs" :key="tech.key" class="col-md-3 col-sm-6 stats-item">
            <span :class="tech.icon" class="mbr-iconfont mobi-mbri-code mobi-mbri"></span>
            <h2 class="heading mbr-fonts-style display-5">
              {{ tech.level }}
            </h2>
            <h3 class="counter mbr-fonts-style mbr-bold display-2">{{ tech.tech }}</h3>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Back",
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
}
</script>

<template>
  <!-- More Skills -->
  <section class="cid-sbFvUlRY7E" id="progress1-6">
    <div class="container">
      <h2
        class="mbr-section-title pb-3 align-left mbr-bold mbr-fonts-style mbr-white display-2"
      >
        {{ data.title.primary }}&nbsp;<span class="orange">{{ data.title.secondary }}</span>
      </h2>
      <h3 class="mbr-section-subtitle mbr-fonts-style align-left display-7">
        {{ data.subtitle }}
      </h3>
      <div class="row pt-4">
        <div class="progress_elements col-md-12">
          <!-- Skills -->
          <div v-for="tech in data.techs" :key="tech.key" class="progress1 pb-3">
            <div class="title-wrap">
              <div class="progressbar-title mbr-fonts-style display-7">
                <p>{{ tech.name }}</p>
              </div>
              <div class="progress_value mbr-fonts-style display-7">
                <div class="progressbar-number">{{ tech.percent }}</div>
                <span>%</span>
              </div>
            </div>
            <div class="progress">
              <div
                :style="`width: ${tech.percent}%`"
                class="progress-bar"
                role="progressbar"
                aria-valuenow="100"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
          <!-- End Skills -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "OtherSkills",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
}
</script>

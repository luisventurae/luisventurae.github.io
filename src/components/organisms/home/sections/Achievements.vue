<template>
  <div>
    <!-- Achievements -->
    <section class="mbr-section content2 cid-sbFKPF5AfD" id="content2-d">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-sm-12 text-section">
            <h2 class="mbr-fonts-style mbr-title align-left pb-3 display-2">
              {{ data.title }}<br />
            </h2>
            <p class="mbr-fonts-style mbr-text align-left display-7">
              {{ data.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="cid-sbFFKPs2wo" id="image1-9">
      <!-- Block parameters controls (Blue "Gear" panel) -->

      <!-- End block parameters -->
      <div class="container images-container">
        <div class="media-container-row" style="width: 66%;">
          <div class="img-item item1" style="width: 225%;">
            <img
              :src="data.images[0].image"
              :alt="data.images[0].image_alt"
            />
            <div class="img-caption">
              <p
                class="mbr-fonts-style align-left mbr-white mbr-bold display-7"
              >
                {{ data.images[0].title }}
              </p>
            </div>
          </div>
          <div class="img-item">
            <img :src="data.images[1].image" :alt="data.images[1].image_alt" />
            <div class="img-caption">
              <p
                class="mbr-fonts-style align-left mbr-white mbr-bold display-7"
              >
                {{ data.images[1].title }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Achievements",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
}
</script>

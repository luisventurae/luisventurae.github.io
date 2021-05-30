<template>
  <section class="menu cid-rzMrgNeUFf" once="menu" id="menu2-7">
    <nav class="navbar navbar-dropdown navbar-fixed-top navbar-expand-lg">
      <!-- Logo -->
      <div class="navbar-brand">
        <span class="navbar-caption-wrap"
          ><a class="navbar-caption text-warning display-2" href="/"
            >luisventurae</a
          ></span
        >
      </div>
      <!-- Hamburger -->
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <div class="hamburger">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      <!-- Nav -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav nav-dropdown" data-app-modern-menu="true">
          <li v-for="nav in data.navs" :key="nav.key" class="nav-item">
            <a class="nav-link link text-warning display-4" :href="nav.href">{{
              nav.text
            }}</a>
          </li>
        </ul>
        <div class="navbar-buttons mbr-section-btn">
          <a
            class="btn btn-md btn-primary display-4"
            :href="data.contact.href"
            target="_blank"
            >{{ data.contact.text }}</a
          >
        </div>
      </div>
    </nav>
  </section>
</template>

<script>
export default {
  name: "Header",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

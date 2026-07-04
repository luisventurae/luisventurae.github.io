<script setup lang="ts">
const { initTheme } = useTheme()

useHead({
  // Inline script runs before first paint to apply saved theme and avoid flash
  script: [
    {
      innerHTML: `(function(){var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)})()`,
      tagPriority: 'critical',
    },
  ],
})

onMounted(() => {
  initTheme()
})
</script>

<template>
  <NuxtPage />
</template>

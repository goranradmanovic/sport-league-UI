<script setup>
import { RouterView } from 'vue-router'
import TheHeader from '@/components/TheHeader'
import TheFooter from '@/components/TheFooter'
</script>

<template lang="html">
  <Suspense>
    <div class="container">
      <TheHeader />
      <RouterView />
      <TheFooter />
    </div>
  </Suspense>
</template>

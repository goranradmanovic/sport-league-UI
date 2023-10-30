<template lang="html">
  <header class="header">
    <RouterLink to="/">
      <img :src="getImgPath('logo')" alt="Logo svg" class="header__logo">
    </RouterLink>

    <nav class="header__nav">
      <RouterLink to="/schedule" class="header__nav__link">
        <img :src="getImgPath('schedule')" alt="schedule svg">
        Schedule
      </RouterLink>
      <RouterLink to="/leaderboard" class="header__nav__link">
        <img :src="getImgPath('leaderboard')" alt="leaderboard svg">
        Leaderboard
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
  import { RouterLink } from 'vue-router'

  const getImgPath = name => require(`@/assets/images/icons/${name}.svg`)
</script>

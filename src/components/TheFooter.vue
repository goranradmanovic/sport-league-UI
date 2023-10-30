<template lang="html">
  <footer class="footer">API Version: {{ apiVersionNum }}</footer>
</template>

<script setup>
  import { ref } from 'vue'

  const apiVersionNum = ref('')
  let res = null;

  res = await fetch(`${process.env.VUE_APP_BASE_URL}/api/version`).then(response => response.json())

  if (res.success) apiVersionNum.value = res.version
</script>

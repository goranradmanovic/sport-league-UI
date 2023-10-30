<template lang="html">
  <div class="spinner">
    <svg viewBox="0 0 200 200">
      <radialGradient id="a" cx=".66" cy=".313" fx=".66" fy=".313" gradientTransform="scale(1.5)">
        <stop offset="0" stop-color="#182C62"/>
        <stop offset=".3" stop-color="#182C62" stop-opacity=".9"/>
        <stop offset=".6" stop-color="#182C62" stop-opacity=".6"/>
        <stop offset=".8" stop-color="#182C62" stop-opacity=".3"/>
        <stop offset="1" stop-color="#182C62" stop-opacity="0"/>
      </radialGradient>
      <circle cx="100" cy="100" r="70" fill="none" stroke="url(#a)" stroke-dasharray="200 1000" stroke-linecap="round" stroke-width="15" transform-origin="center">
        <animateTransform attributeName="transform" calcMode="spline" dur="2" keySplines="0 0 1 1" keyTimes="0;1" repeatCount="indefinite" type="rotate" values="360;0"/>
      </circle>
      <circle cx="100" cy="100" r="70" fill="none" stroke="#182C62" stroke-linecap="round" stroke-width="15" opacity=".2" transform-origin="center"/>
    </svg>
  </div>
</template>

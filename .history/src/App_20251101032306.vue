<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
body {
  margin: 0 auto;
  padding: 0;
  font-family: 'Montserrat', sans-serif;
}

html,
body {
  overflow-x: hidden;
  background: #081b29;
}

h1,
h2,
h3 {
  font-family: 'Montserrat', sans-serif;
}

p,
span,
li {
  font-family: 'Public Sans', sans-serif; /* paragraphs */
}
</style>

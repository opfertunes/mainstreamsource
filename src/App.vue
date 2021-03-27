<template>
  <div id="app">
    <router-view :key="$route.path"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {}
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Nunito+Sans:200,300,400,700,900|Oswald:400,700");
</style>

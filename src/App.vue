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
@import "./assets/fonts/icomoon/style.css";
@import "./assets/css/bootstrap.min.css";
@import "./assets/css/animate.css";
@import "./assets/fonts/flaticon/font/flaticon.css";
@import "./assets/css/fl-bigmug-line.css";
@import "./assets/css/MusicPlayer.css";
@import "./assets/fonts/fa/css/font-awesome.min.css";
@import "./assets/css/style.css";
@import "./assets/css/custom.css";

</style>

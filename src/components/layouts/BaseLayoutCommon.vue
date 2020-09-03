<template>
  <div>
    <div class="site-wrap">
      <Header></Header>
      <div
        class="site-blocks-cover inner-page-cover overlay"
        :style="{
          backgroundImage: `url(${require(`@/assets/images/hero_bg_1.jpg`)})`,
        }"
        data-stellar-background-ratio="0.5"
        data-aos="fade"
      >
        <div class="container">
          <slot name="page-header"></slot>
        </div>
      </div>

      <slot name="page-content"></slot>

      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import Header from "./Header";
import Footer from "./Footer";

export default {
  name: "BaseLayoutCommon",
  components: {
    Header,
    Footer,
  },
  props: {},
  data() {
    return {};
  },
};
</script>

<style scoped></style>

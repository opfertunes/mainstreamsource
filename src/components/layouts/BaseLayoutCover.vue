<template>
  <div class="hello">
    <div class="site-wrap">
      <Header></Header>

      <div
        class="site-blocks-cover overlay"
        :style="{
          backgroundImage: `url(${require(`@/assets/images/hero_bg_1.jpg`)})`,
        }"
        data-aos="fade"
        data-stellar-background-ratio="0.5"
      >
        <div class="container">
          <div class="row align-items-center justify-content-center">
            <div
              class="col-md-7 text-center css-typing"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <h1 class="mb-4 home slogan">
                Mainstream Source is dedicated to
              </h1>
              <h1 class="mb-4 home slogan">providing the finest production</h1>
              <h1 class="mb-4 home slogan">music to the worldwide film,</h1>
              <h1 class="mb-4 home slogan">
                television and advertising industries.
              </h1>
              <div class="input-group mb-4 search-box">
                <v-select
                  class="form-control"
                  label="title"
                  placeholder="Search for any Genre"
                  :options="genres"
                  @input="setSelected"
                ></v-select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <slot></slot>

      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import Header from "./Header";
import Footer from "./Footer";
import genres from "./../../data/genre.json";

export default {
  name: "BaseLayoutCover",
  components: {
    Header,
    Footer,
  },
  props: {},
  data() {
    return {
      genres,
    };
  },
  methods: {
    setSelected() {
      this.$router.push("/genres/1/tracks");
    },
  },
};
</script>

<style scoped></style>

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
        <div class="container-fluid">
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
                  class="form-control mr-2"
                  placeholder="Search for any Genre"
                  :options="genres"
                  label="description"
                  v-model="selectedGenre"
                  @input="setSelectedGenre"
                  :disabled="loadingSearch"
                ></v-select>
                 <div v-if="loadingSearch" class="d-flex justify-content-center mt-2 mb-3">
                    <em>Loading...</em>
                 </div>

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

import {mapActions, mapState} from "vuex";

export default {
  name: "BaseLayoutCover",
  components: {
    Header,
    Footer,
  },
  props: {},
  data() {
    return { 
      selectedGenre: null
    };
  },
  created() {
    this.clearSearch()
    this.loadSearchLookups()
    .catch((error) => {
      // show a proper error message!
      console.error(error);
    })
    .finally(() => {
      this.loading = false;
    })
  },
  methods: {
    setSelectedGenre() {

      if (this.loadingSearch) {
        return;
      }

      if (!this.selectedGenre) {
        return;
      }

      this.$router.push(`/tracks?genre=${this.selectedGenre.genre_id}`);

    },
    ...mapActions("search", ["clearSearch", "loadSearchLookups"]),
  },
  computed: {
     ...mapState("search", ["genres", "loadingSearch"]),
  }
};
</script>

<style scoped></style>

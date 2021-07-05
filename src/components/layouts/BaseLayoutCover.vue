<template>
  <div class="hello">
    <div class="site-wrap">
      <Header></Header>
      <div
        class="site-blocks-cover overlay"
        :style="{
          backgroundImage: `url(${require(`@/assets/images/bobby-johnson-swCOXlxmr5U-unsplash.jpg`)})`,
        }"
      >
        <div class="container-fluid">
          <div class="row align-items-center justify-content-center">
            <div
              class="col-md-7 text-center css-typing"
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
                  :placeholder="loadingSearch ? 'Loading genres...' : 'Search for any genre'"
                  :options="genres"
                  label="description"
                  v-model="selectedGenre"
                  @input="setSelectedGenre"
                  :disabled="loadingSearch"
                ></v-select>

          
                 <b-button variant="primary" @click="showSearchDialog">Advanced search...</b-button>

                 
              </div>
              
            </div>
          </div>
        </div>
      </div>

      <div 
        v-if="featuredCds.length"
        class="row pl-5 pr-5 justify-center" 
        style="min-height:300px;"
        >
        <div class="col-12 pt-3 pb-2 text-center">
             <h2>Featured Playlists</h2>
        </div>
        <div class="col-12 pb-4">
          <featured-c-ds :cdList="featuredCds"/>
        </div>
      </div>

      <slot></slot>

      <Footer></Footer>
    </div>
    <search-dialog ref="searchDialog"/>
  </div>
</template>

<script>
import Header from "./Header";
import Footer from "./Footer";
import SearchDialog from "@/components/SearchDialog";
import FeaturedCDs from "@/components/FeaturedCDs";

import {mapActions, mapState} from "vuex";

export default {
  name: "BaseLayoutCover",
  components: {
    Header,
    Footer,
    SearchDialog,
    FeaturedCDs
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
    showSearchDialog() {

      this.$nextTick(function () {
        this.$refs["searchDialog"].$children[0].show();
      });
    },

    ...mapActions("search", ["clearSearch", "loadSearchLookups"]),
  },
  computed: {
     ...mapState("search", ["genres", "featuredCds", "loadingSearch"]),
  }
};
</script>

<style scoped></style>

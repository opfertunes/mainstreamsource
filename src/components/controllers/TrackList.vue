<template>

  <BaseLayoutCommon>
    <template v-slot:page-header>
      <div class="row align-items-center justify-content-center">
        <div class="col-md-7 text-center">
          <div  v-for="(item, index) in searchDescription" :key="index" >
  
            <h2 v-if="item.title !== 'CD'">
              {{item.title}}
            </h2>
            <h2 class="ml-4 text-white" v-for="(searchItem, itemIndex) in item.searchItems" :key="itemIndex">
            {{searchItem}}
            </h2> 

          </div>
  
          <div v-if="loadingSearch" class="d-flex justify-content-center mt-2 mb-3">
            <em>Loading...</em>
          </div>
          <div v-if="searchErrorMessage" class="d-flex justify-content-center mt-2 mb-3">
            {{searchErrorMessage}}
          </div>

          <p v-if="!loadingSearch && !searchErrorMessage && searchResults">
            <span v-if="searchResults.length">Browse and listen to music from the list below.</span>
            <span v-else>No tracks found for your search.</span>
          </p>
          
        </div>
      </div>
    </template>
    <template v-slot:page-content>
      <div class="site-section">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-3 pb-3 text-center" v-if="currentCd">
              <a
                href="#"
                class="col1 unit-9 no-height"
                v-if="!loadingSearch"
              >

                <img
                  class="image"
                  :src="coverArtUrl"/>              
              </a>
                <div class="unit-9 mt-3"> 
              <div class="unit-9-content pl-2 pr-2">    
                  <span>{{currentCd.description}}</span>
              </div>
                </div>

            </div>
            <div class="col-md-9" v-if="searchResults">
              <song-list :songs="searchResults" :coverArtUrl="coverArtUrl" :userProjects="userProjects"/>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseLayoutCommon>
</template>

<script>
import ApiService from "@/api/ApiService"
import BaseLayoutCommon from "./../layouts/BaseLayoutCommon";
import SongList from "@/components/SongList";
import {mapState, mapGetters, mapActions} from "vuex";
//import $ from "jquery";

export default {
  name: "TrackList",
  components: {
    BaseLayoutCommon,
    SongList,
  },
  props: {},
  data() {
    return {userProjects: []};
  },
  created() {
    // TODO: this page should be able to handle any search type (genre/keyword etc)
    // for now, if a hard load, we'll assume genre. 

    // if we have not called this page from BaseLayoutCover, then
    // this is a full page load and we need to initialize the search data here: 
    this.searchFromQueryParams(this.$route.query);

    if (process.env.VUE_APP_FAKE_PROJECT_CALLS !== "true") {
      ApiService.getProjects().then((result) => {
        this.userProjects = result;
      }).catch((err) => {
        this.userProjects = [];
        this.$toastr.e(
          `Error loading Projects: ${err.message}`
        );
      })
    } else {
      this.userProjects = [
        {"project_id":"23","name":"Filmy Cue 1","description":"dark, brooding","song_count":"7"},
        {"project_id":"31","name":"foo proj","description":"desc","song_count":"0"},
        {"project_id":"30","name":"Reboot","description":"Next Level","song_count":"0"}
      ];
    }

  },
  methods: {
    ...mapActions("search", ["searchFromQueryParams", "loadSearchLookups", "setSearchData"]),
  },
  computed: {
    coverArtUrl: function() {
      return this.searchData.cds && this.searchData.cds.length ?
        `https://mainstreamsource.com/${this.searchData.cds[0].image_loc}` : null;
    },
    currentCd: function() {
      return this.searchData.cds && this.searchData.cds.length ?
        this.searchData.cds[0] : null; 
    },

    ...mapState("search", ["searchResults", 
                           "genres", 
                           "cdCategories",
                           "cds", 
                           "loadingSearch", "searchData", "searchErrorMessage"]),
    ...mapGetters("search", ["searchDescription", "hasSearched" ]),
    ...mapGetters("user", ["isAuthenticated" ]),
  },
  destroyed() {}
};
</script>

<style scoped>

            
</style>

<template>
  <div>
    <BaseLayoutCommon>
      <template v-slot:page-header>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-7 text-center" data-aos="fade-up" data-aos-delay="400">
            <div  v-for="(item, index) in searchDescription" :key="index" >
    
              <h2 class="text-white">
                {{item.title}}
              </h2>
              <div class="ml-4" v-for="(searchItem, itemIndex) in item.searchItems" :key="itemIndex">
                {{searchItem}}
              </div>  
            </div>
            <div v-if="loadingSearch" class="d-flex justify-content-center mt-2 mb-3">
              <em>Loading...</em>
            </div>

            <p>Browse and listen to music from the list below.</p>
          </div>
        </div>
      </template>
      <template v-slot:page-content>
        <div class="site-section">
          <div class="container">
            <div class="row">
              <div class="col-md-3">
                <a
                  href="#"
                  class="col1 unit-9 no-height aos-init aos-animate"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div
                    class="image"
                    :style="{
                      backgroundImage: `url(${require(`@/assets/images/img_2.jpg`)})`,
                    }"
                  ></div>
                  <div class="unit-9-content">
                    <h2>Album Title</h2>
                    <span>Other Info</span>
                  </div>
                </a>
              </div>
              <div class="col-md-9">
                <div
                  class="d-block d-md-flex podcast-entry bg-white mb-5 main-song-container"
                  v-for="(song, index) in searchResults"
                  :key="index"
                >
                  <div class="text" style="padding: 0px;">
                    <div class="row">
                      <div class="col-sm-12">
                        <h3 class="font-weight-light" style>
                          <span style="margin-left: 12px; position: relative; top: 2px;">
                            <i
                              class="fa fa-play-circle"
                              aria-hidden="true"
                              v-on:click="playMusic(index)"
                              v-if="playIndex != index || (playIndex == index && pause)"
                            ></i>
                            <i
                              class="fa fa-pause"
                              aria-hidden="true"
                              v-on:click="stopMusic()"
                              v-if="playIndex == index && !pause"
                            ></i>
                          </span>
                          <span style="margin-left: 12px; position: relative; top: 2px;">
                            <i class="fa fa-info-circle" aria-hidden="true"></i>
                          </span>
                          <span style="margin-left: 12px; position: relative; top: 2px;">
                            <i class="fa fa-download" aria-hidden="true"></i>
                          </span>

                          <a
                            style="font-size: 16px; color: #e3207b; margin-left: 10px; position: relative; top: -1px; left: 0px;"
                          >{{ song.title }}{{ index + 1 }}</a>

                          <span
                            style="float: right;
position: relative;
font-size: 17px;
right: 10px;
top: 10px;"
                          >1:15</span>
                        </h3>
                      </div>

                      <div class="col-sm" v-if="playIndex == index">
                        <div class="waveform_container">
                          <div :id="`waveform_${index}`"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </BaseLayoutCommon>
  </div>
</template>

<script>
import BaseLayoutCommon from "./../layouts/BaseLayoutCommon";
import WaveSurfer from "wavesurfer.js";
import { HomePageJs } from "./../libs/HomePageJs";
import {mapState, mapGetters, mapActions} from "vuex";

export default {
  name: "TrackList",
  components: {
    BaseLayoutCommon
  },
  props: {
    msg: String,
  },
  data() {
    return {
      playIndex: -1,
      player: null,
      componentKey: 0,
      pause: false
    };
  },
  created() {
    // TODO: this page should be able to handle any search type (genre/keyword etc)
    // for now, if a hard load, we'll assume genre. 

    // if we have not called this page from BaseLayoutCover, then
    // this is a full page load and we need to initialize the search data here:

    if (!this.hasSearched) {

      this.loadSearchLookups().then(() => {
        const genreId = this.$route.params.genreId;
        const genre = this.genres.find(genre => String(genre.genre_id) === String(genreId));
        if (genre) {
            // will trigger the search, see store/search.js
            this.setSearchData(
              {"genres":[genre]}
            )
        } else {
          // cheesey, use toastr:
          alert(`Genre not found for id ${genreId}`);
        }
      });
    }
  },
  mounted() {
    // this is wonky:
    setTimeout(() => {
      HomePageJs();
    }, 1000);
  },
  methods: {
    playMusic: function(i) {
      if (this.player && this.pause) {
        this.player.playPause();
        this.pause = false;
        return;
      }
      if (this.player) {
        this.player.stop();
        this.player = null;
      }
      this.pause = false;
      this.playIndex = i;
      setTimeout(() => {
        let wavesurfer = WaveSurfer.create({
          container: "#waveform_" + i,
          waveColor: "white",
          progressColor: "#e3207b",
          barHeight: 1,
          height: 40
        });
        this.player = wavesurfer;
        wavesurfer.on("ready", function() {
          wavesurfer.play();
        });
        
        wavesurfer.on("finish", () => {
          this.pause = false;
          this.player.stop();
          if (this.playIndex < this.searchResults.length - 1) {
            this.playMusic(this.playIndex + 1);
          } else if (this.playIndex == this.players.length - 1) {
            this.playIndex = -1;
          }
        });

        wavesurfer.load(this.searchResults[i].trackUrl);
        
      }, 500);
    },
    stopMusic: function() {
      this.player.playPause();
      this.pause = true;
      //this.playIndex = -1;
    },
    ...mapActions("search", ["loadSearchLookups", "setSearchData"]),
  },
  computed: {
    ...mapState("search", ["searchResults", "genres", "loadingSearch"]),
    ...mapGetters("search", ["searchDescription", "hasSearched" ]),
  },
  destroyed() {
    if (this.player) {
      this.player.stop();
    }
  }
};
</script>

<style scoped></style>

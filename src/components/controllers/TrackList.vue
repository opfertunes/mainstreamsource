<template>
  <div>
    <BaseLayoutCommon>
      <template v-slot:page-header>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-7 text-center">
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
            <div v-if="errorMessage" class="d-flex justify-content-center mt-2 mb-3">
              {{errorMessage}}
            </div>

            <p v-if="!loadingSearch && !errorMessage && searchResults">
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
              <div class="col-md-3 pb-3" v-if="coverArtUrl">
                <a
                  href="#"
                  class="col1 unit-9 no-height"
                  v-if="!loadingSearch"
                >

                  <img
                    class="image"
                    :src="coverArtUrl"/>              

                  <div class="unit-9-content" v-if="false">
                    <h2>Album Title</h2>
                    <span>Other Info</span>
                  </div>
                </a>
              </div>
              <div class="col-md-9" v-if="searchResults">
                <div
                  class="d-block d-md-flex podcast-entry bg-white mb-5 main-song-container"
                  v-for="(song, index) in searchResults"
                  :key="index"
                >
                  <div class="text" style="padding: 0px;">
                    <div class="row">
                      <div class="col-sm-12">
                        <h3 class="font-weight-light" style>
                          <span class="action-icon">
                            <a><i
                              class="fa fa-play-circle"
                              aria-hidden="true"
                              v-on:click="playMusic(index)"
                              v-if="playIndex != index || (playIndex == index && pause)"
                            ></i></a>
                            <i
                              class="fa fa-pause"
                              aria-hidden="true"
                              v-on:click="stopMusic()"
                              v-if="playIndex == index && !pause"
                            ></i>
                          </span>
                          <span class="action-icon">
                            <i class="fa fa-info-circle" aria-hidden="true"
                               v-on:click="showSongInfo(song)"></i>
                          </span>

                          <span v-if="isAuthenticated" class="action-icon">
                            <i class="fa fa-download" aria-hidden="true"></i>
                          </span>

                          <span class="song-index-title">{{ index + 1 }}: {{ song.title }}</span>

                          <span
                            style="float: right;
                                  position: relative;
                                  font-size: 17px;
                                  right: 10px;
                                  top: 10px;"
                          >{{song.duration}}</span>
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

    <!-- Modal -->
    <div class="modal fade" id="trackInfo" tabindex="-1" role="dialog" aria-labelledby="trackInfoLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content track-info" v-if="songDialogData">
          <div class="modal-header">
            <h5 class="modal-title" id="trackInfoLabel">{{songDialogData.song.title}} </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p class="description">
              {{songDialogData.song.description}} 
            </p>
            <div class="row"> 
              <div class="col">
                <table>
                  <tr>
                    <td class="left-row-header"> <strong>Composer(s)</strong> </td>
                    <td> 
                      <ul> 
                        <li v-for="composer in songDialogData.details.composer" :key="composer.composer_id">  
                          {{composer.name}} ({{composer.publisher}}) {{composer.percent}}%
                        </li>
                      </ul>

                    </td>
                  </tr>
                  <tr>
                    <td class="left-row-header"> <strong>Publisher(s)</strong> </td>
                    <td> 
                      <ul> 
                        <li v-for="publisher in songDialogData.details.publisher" :key="publisher.publisher_id">  
                          {{publisher.publisher}} {{publisher.percent}}%
                        </li>
                      </ul>

                    </td>
                  </tr>

                </table>
              </div>    
            </div>

            <div class="row pt-4">
              <div class="col-12">
                length: {{songDialogData.song.duration}} &mdash; tempo: {{songDialogData.song.tempo}} bpm
              </div>  
            </div>  
            <div class="row">
              <div class="col-12">
                Key: {{songDialogData.song.song_key}}
              </div>  
            </div>  
            <div class="row">
              <div class="col-12">
                Meter: {{songDialogData.song.meter}}
              </div>  
            </div>  
            
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseLayoutCommon from "./../layouts/BaseLayoutCommon";
import WaveSurfer from "wavesurfer.js";
import { HomePageJs } from "./../libs/HomePageJs";
import ApiService from "@/api/ApiService";
import {mapState, mapGetters, mapActions} from "vuex";
import $ from "jquery";

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
      pause: false,
      queryParams: {},
      errorMessage: null,
      songDialogData: null,
    };
  },
  created() {
    // TODO: this page should be able to handle any search type (genre/keyword etc)
    // for now, if a hard load, we'll assume genre. 

    // if we have not called this page from BaseLayoutCover, then
    // this is a full page load and we need to initialize the search data here: 
    this.queryParams = this.$route.query;

    if (!Object.keys(this.queryParams).length) {
      this.errorMessage = "No search criteria were entered"
      return;
    }
    
    this.loadSearchLookups().then(() => {
      const searchData = {}
      let lookupList, pkName, pk, storeKey, description;

      if (this.queryParams.genre) {
        pk = this.queryParams.genre;
        lookupList = this.genres;
        pkName = "genre_id";
        storeKey = "genres";
        description = "Genre"

      }
      else if (this.queryParams.cd_category) {
        pk = this.queryParams.cd_category;
        lookupList = this.cdCategories;
        pkName = "category_id";
        storeKey = "cdCategories";
        description = "CD Category"

      }
      else if (this.queryParams.cd) {
        pk = this.queryParams.cd;
        lookupList = this.cds;
        pkName = "cd_id";
        storeKey = "cds";
        description = "CD"
      }

      if (!pk || !lookupList || !pkName || !storeKey || !description) {

        this.errorMessage = "Please enter a valid search"

        return;
      }



      const searchObj = lookupList.find(obj => String(obj[pkName]) === String(pk));
      if (!searchObj) {
        this.errorMessage = `${description} not found for id ${pk}`
        return;
      }

      searchData[storeKey] = [searchObj];

      this.setSearchData(searchData);
      
    });
  
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

        const trackUrl = `${process.env.VUE_APP_SNIPPET_URL}/${this.searchResults[i].snippet_file}`;
        
        wavesurfer.load(trackUrl);
        
      }, 500);
    },
    stopMusic: function() {
      this.player.playPause();
      this.pause = true;
      //this.playIndex = -1;
    },
    showSongInfo: function(song) {
      this.songDialogData = null;

      ApiService.getSongDetails(song.song_id).then(data => {

        this.songDialogData = {
          song,
          details: data.data
        }
        $('#trackInfo').modal().on('hide.bs.modal', function(){
           this.songDialogData = null;
        })

      })


    },
    onModalClosed: function() {
      this.songDialogData = null;
    },
    ...mapActions("search", ["loadSearchLookups", "setSearchData"]),
  },
  computed: {
    coverArtUrl: function() {
      return this.searchData.cds && this.searchData.cds.length ?
        `https://mainstreamsource.com/${this.searchData.cds[0].image_loc}` : null;
    },
    ...mapState("search", ["searchResults", 
                           "genres", 
                           "cdCategories",
                           "cds", 
                           "loadingSearch", "searchData"]),
    ...mapGetters("search", ["searchDescription", "hasSearched" ]),
    ...mapGetters("user", ["isAuthenticated" ]),
  },
  destroyed() {
    if (this.player) {
      this.player.stop();
    }
  }
};
</script>

<style scoped>

.left-row-header {
  vertical-align: top;
}

i.fa {
  cursor:pointer;
}

.action-icon {
  margin-left: 12px; 
  position: relative; 
  top: 2px;
}

.song-index-title {
   font-size: 16px; 
   color: #e3207b; 
   margin-left: 20px; 
   position: relative; 
   top: -1px; left: 0px;
}
            
</style>

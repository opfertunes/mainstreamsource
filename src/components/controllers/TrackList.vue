<template>
  <div>
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
                <div
                  class="d-block d-md-flex podcast-entry bg-white mb-5 main-song-container"
                  v-for="(song, index) in searchResults"
                  :key="index"
                >
                  <div class="text" style="padding: 0px;">
                    <div class="row">
                      <div class="col-md-6 pr-0 text-nowrap">
                        <h3 class="font-weight-light">
                          <span class="action-icon left text-nowrap">
                            <a><i
                              class="fa fa-play-circle"
                              aria-hidden="true"
                              v-on:click="playMusic(index)"
                              v-if="playIndex != index || (playIndex == index && pause)"
                            ></i>
                            </a>
                            <i
                              class="fa fa-pause"
                              aria-hidden="true"
                              v-on:click="stopMusic()"
                              v-if="playIndex == index && !pause"
                            ></i>
                          </span>
                          <span class="action-icon song-index-title text-nowrap">{{ index + 1 }}: {{ song.title }}</span>
                         </h3>
                      </div>
                      <div class="col-md-6">
                        <h3 class="font-weight-light track-info-column">                 
                          <span v-if="isAuthenticated" class="action-icon info-icons">
                            <i class="fa fa-download" aria-hidden="true"></i>
                          </span>
                          <span class="action-icon info-icons bpm-outer">
                            <span class="track-bpm">{{song.tempo}}</span>
                          </span>
                          <span class="action-icon info-icons song-duration">{{song.duration}}</span>

                          <span class="action-icon info-icons">
                            <i class="fa fa-info-circle" aria-hidden="true"
                               v-on:click="showSongInfo(song)"></i>
                          </span>

                                      
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

    <b-modal 
      id="trackInfo" 
      ref="trackInfo" 
      ok-only
      centered
      variant="dark"
      header-class="track-detail-header"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"> 

      <template #modal-header="{cancel }">
          <img class="header-album-cover"
            :src="coverArtUrl"/> 
 
          <h5 class="modal-title">{{songDialogData.song.title}}</h5>
          <button @click="cancel()" type="button" aria-label="Close" class="close text-light">×</button>
      
       
      </template>
      
      <div class="track-info" v-if="songDialogData">          
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
    </b-modal>  



  </div>
</template>

<script>
import BaseLayoutCommon from "./../layouts/BaseLayoutCommon";
import WaveSurfer from "wavesurfer.js";
import ApiService from "@/api/ApiService";
import {mapState, mapGetters, mapActions} from "vuex";
//import $ from "jquery";

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
      songDialogData: null,
    };
  },
  created() {
    // TODO: this page should be able to handle any search type (genre/keyword etc)
    // for now, if a hard load, we'll assume genre. 

    // if we have not called this page from BaseLayoutCover, then
    // this is a full page load and we need to initialize the search data here: 
    this.searchFromQueryParams(this.$route.query);

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

        this.$bvModal.show("trackInfo")

        //$('#trackInfo').modal().on('hide.bs.modal', function(){
        //   this.songDialogData = null;
        //})

      })


    },
    onModalClosed: function() {
      this.songDialogData = null;
    },
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

.song-index-title {
   font-size: 16px; 
   color: #e3207b; 
   margin-left: 0px; 
   position: relative; 
   top: -1px; left: 0px;
}

.action-icon {
  margin-right: 12px; 
  margin-top: 4px;
  margin-bottom: 8px;

}
.action-icon.left {
  margin-left: 12px;
  float: left;
}

.action-icon.info-icons {
  position: relative;
  top: -2px
}

.action-icon.info-icons.song-duration {
  top: -4px;
  font-size: 17px;
}

.action-icon.info-icons.bpm-outer{
  top: -4px; 
  margin-right: 0px;
  margin-left: 24px;
}

.track-bpm {
  display: inline-block; 
  white-space: nowrap;
  font-size: .825rem;
  line-height: inherit;
  -webkit-transform: translate(-50%,0);
  -ms-transform: translate(-50%,0);
  transform: translate(-50%,0);
  border-width: thin;
  border-style: solid;
  border-color: inherit;
  border-radius: .9rem;
  font-weight: bolder;
  padding: .125rem .1875rem .1875rem;
  height: 1.45rem;
  width: 2.1875rem;
  color: inherit;
  text-align: center;
}

.track-info-column{
  margin-left: 12px;
  text-align: left !important;
}

.header-album-cover {
  max-width: 85px;
  margin-right: 20px;
}

@media (min-width:768px) { /*576*/
  .track-info-column{
    text-align: right !important;
  }

  .action-icon.info-icons {
    top: 5px
  }

  .action-icon.info-icons.song-duration {
    top: 2px;
  }
  .action-icon.info-icons.bpm-outer{
    top: 1px; 
  }

}
            
</style>

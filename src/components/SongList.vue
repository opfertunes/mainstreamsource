<template>
  <div>
    <div
        class="d-block d-md-flex podcast-entry bg-white mb-5 main-song-container"
        v-for="(song, index) in songs"
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


                <span class="action-icon info-icons" v-if="project">
                <i class="fa fa-times-circle" aria-hidden="true"
                    v-on:click="deleteSongFromProject(song)"></i>
                </span>

                <span class="action-icon info-icons" v-if="!project && isAuthenticated">
                <i class="fa fa-plus-square" aria-hidden="true"
                    v-on:click="addSongToProject(song)"></i>
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
            v-if="coverArtUrl"
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
    
    <b-modal 
      id="addToProjectDialog" 
      ref="addToProjectDialog" 
      centered
      variant="dark"
      header-class="track-detail-header"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      :ok-disabled="!selectedProjectId"
      @ok="onAddSongToProject"> 
      <template #modal-header="{cancel }">
          <h5 class="modal-title">Add {{selectedSong.title}} to a Project</h5>
          <button @click="cancel()" type="button" aria-label="Close" class="close text-light">×</button>
      </template>
      <div class="row">
        <div class="col">
          <div>{{selectedProjectId}}</div>
          <b-form-select v-model="selectedProjectId" :options="selectProjectOptions"></b-form-select>
        </div>

      </div>  

    </b-modal>  

  </div>            
</template>

<script>
import WaveSurfer from "wavesurfer.js";
import ApiService from "@/api/ApiService";
import {mapState, mapGetters} from "vuex";
//import $ from "jquery";

export default {
  name: "SongList",
  components: {},
  props: {
    songs: Array,
    coverArtUrl: String,
    project: {type: Object, default: null},
    userProjects: {type: Array, default: () => []}
  },
  data() {
    return {
      playIndex: -1,
      player: null,
      pause: false,
      songDialogData: null,
      // for "add to project":
      selectedSong: null,
      selectedProjectId: null,
    };
  },
  created() {
      console.debug({playIndex: this.playIndex,
                     project: this.project,
                     userProjects: this.userProjects})
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
          if (this.playIndex < this.songs.length - 1) {
            this.playMusic(this.playIndex + 1);
          } else if (this.playIndex == this.players.length - 1) {
            this.playIndex = -1;
          }
        });

        const trackUrl = `${process.env.VUE_APP_SNIPPET_URL}/${this.songs[i].snippet_file}`;
        
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
    deleteSongFromProject: function(song) {
        this.$bvModal.msgBoxConfirm(`Remove song "${song.title}" from your project?`, {
        title: 'Please Confirm',
        size: 'lg',
        buttonSize: 'md',
        okVariant: 'danger',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true,
        variant:"dark",
        headerClass:"track-detail-header",
        headerBgVariant:"dark",
        headerTextVariant:"light",
        bodyBgVariant:"dark",
        bodyTextVariant:"light",
        footerBgVariant:"dark",
        footerTextVariant:"light",
      }).then((value) => {
          if (!value) {
            return;
          }    
          if (process.env.VUE_APP_FAKE_PROJECT_CALLS !== "true") {  
            ApiService.deleteSongFromProject(song.project_song_id, this.project.project_id)
            .then(() => {
              this.$emit("songDeleted", song);
            })
          } else {
            this.$emit("songDeleted", song);
          }  
      })
      .catch(() => {
            // An error occurred
      })
    },
    addSongToProject: function(song) {
      this.selectedSong = song;
      this.selectedProjectId = null;

      this.$bvModal.show("addToProjectDialog")
    },
    onAddSongToProject: function() {
      if (!this.selectedSong || !this.selectedProjectId) {
        return; 
      } 
      if (process.env.VUE_APP_FAKE_PROJECT_CALLS !== "true") {  
        ApiService.AddSongToProject(this.selectedSong.song_id, this.selectedProjectId)
          .then(() => {
            //this.$emit("songDeleted", song);
          })
        } else {
          console.debug("AddSongToProject: ", {songId: this.selectedSong.song_id, projectId: this.selectedProjectId})
          //this.$emit("songDeleted", song);
          // You are able to access plugin from everywhere via this.$toastr

          this.$toastr.s(
            `Song "${this.selectedSong.title}" added to project "${this.selectedProjectName}"`
          );
        }  


    }
    //...mapActions("search", ["loadSearchLookups", "setSearchData"]),
  },
  computed: {
    selectProjectOptions: function() {
      const result = [
        {
          value: null,
          text: "** Select project **",
        }  
      ]
      this.userProjects.forEach(p => {
        result.push( {
          value: p.project_id,
          text: p.name,
        });
      })
      return result;
    },
    selectedProjectName: function() {
      if (!this.selectedProjectId){
        return null;
      }
      const theProject = this.userProjects.find(p => p.project_id === this.selectedProjectId);
      return theProject ? theProject.name : null;

    },
    ...mapState("search", [ "genres", 
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
  text-overflow: ellipsis;
  overflow: hidden;
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

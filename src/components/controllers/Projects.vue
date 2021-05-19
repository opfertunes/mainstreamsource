<template>
  <div>
    <BaseLayoutCommon>
      <template v-slot:page-header>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-7 text-center">
            <h2>
              My Projects
            </h2>
            
            <div v-if="loading" class="d-flex justify-content-center mt-2 mb-3">
              <em>Loading...</em>
            </div>
            <div v-if="errorMessage" class="d-flex justify-content-center mt-2 mb-3">
              {{errorMessage}}
            </div>
            
          </div>
        </div>
      </template>
      <template v-slot:page-content>
        <div class="site-section">
          <div class="container-fluid">
            <div class="row">
              <div class="col text-center">
                <table style="width:75%">
                  <thead>
                    <th>Name</th>
                    <th>Description</th>
                    <th># Songs</th>
                    <th></th>
                  </thead>
                  <tbody>
                    <tr v-for="project in projectsList" :key="project.project_id">
                      <td><a @click="setSelectedProject(project)" href="javascript:void(0)"> {{project.name}}</a></td>
                      <td>{{project.description}}</td>
                      <td>{{project.song_count}}</td>
                      <td>
                        <span class="action-icon info-icons">
                          <i class="fa fa-times-circle" aria-hidden="true"
                              v-on:click="deleteProject(project)"></i>
                        </span>


                      </td>
                    </tr>
                  </tbody>
                </table> 
              </div>  

            </div>

            <div class="row project-row">

              <div class="col" v-if="selectedProject">
                <div class="row">
                  <div class="col text-center">
                    <h1>{{selectedProject.name}}</h1>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <song-list :songs="selectedProject.songs" :coverArtUrl="null" :showDeleteIcon="true" />
                      
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
//import ApiService from "@/api/ApiService";
import SongList from "@/components/SongList";
import {mapState, mapGetters, mapActions} from "vuex";
//import $ from "jquery";

export default {
  name: "Projects",
  components: {
    BaseLayoutCommon,
    SongList,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      loading: false,
      errorMessage: null,
      projectsList: [],
      selectedProject: null,
    };
  },
  created() {
    //ApiService.getProjects().then(data => {
    //  console.debug(data);
    //})

    this.projectsList = [
      {"project_id":"23","name":"Filmy Cue 1","description":"dark, brooding","song_count":"7"},
      {"project_id":"31","name":"foo proj","description":"desc","song_count":"0"},
      {"project_id":"30","name":"Reboot","description":"Next Level","song_count":"0"}
    ];
  },
  methods: {
    setSelectedProject(project) {
      console.debug(project);
      this.selectedProject = {
        "project_id":"23",
        "customer_id":"14",
        "name":"Filmy Cue 1",
        "description":"dark, brooding",
        "songs":[ 
          {"song_id":"126", "snippet_file": "3OR4TIMESSNIP.mp3", "part_number":"50517001","title":"3 Or 4 Times_Full","mix_id":"12","remix_capable":"1","duration":"00:03:59","tempo":"Legato","description":"Solo Piano concerto, elegant, emotional","tempo_type_id":"3","song_key":"N/A","meter":"4/4","copyright_number":"Phillip T. Moody","is_public_domain":"0","time_period_id":"1","isrc_no":null,"pro_song_reg_no":null,"is_exclusive":"1","project_song_id":"267","project_id":"23","comments":"cool"},
          {"song_id":"3296", "snippet_file": "3OR4TIMESSNIP.mp3", "part_number":"60615001","title":"A Nest In The Family Tree_Full","mix_id":"1","remix_capable":"1","duration":"00:00:59","tempo":"95","description":"Poignant downtempo orchestral instrumental, sentimental and bittersweet","tempo_type_id":"3","song_key":"DM","meter":"4/4","copyright_number":"Chris Fuller","is_public_domain":"0","time_period_id":"12","isrc_no":null,"pro_song_reg_no":null,"is_exclusive":null,"project_song_id":"177","project_id":"23","comments":"This one is dark!"},
          {"song_id":"3560","snippet_file": "3OR4TIMESSNIP.mp3", "part_number":"61201001","title":"Aarons Fantastic Fandango_Full","mix_id":"1","remix_capable":"0","duration":"00:03:08","tempo":"100","description":"Easy acoustic guitar strumming and congas, mellow feel, piano adds flavor","tempo_type_id":"2","song_key":"DM","meter":"4/4","copyright_number":"David Graham","is_public_domain":"0","time_period_id":"1","isrc_no":null,"pro_song_reg_no":null,"is_exclusive":null,"project_song_id":"272","project_id":"23","comments":""},
          {"song_id":"20","snippet_file": "3OR4TIMESSNIP.mp3","part_number":"50108001","title":"Be A Lover_Full","mix_id":"1","remix_capable":"1","duration":"00:03:06","tempo":"95","description":"Male lead vocal, soft rock in the style of Bruce Hornsby","tempo_type_id":"2","song_key":"Dm","meter":"4/4","copyright_number":"PAu2-015-180","is_public_domain":"0","time_period_id":"1","isrc_no":null,"pro_song_reg_no":null,"is_exclusive":"1","project_song_id":"269","project_id":"23","comments":"Good for the middle."},
          {"song_id":"6516","snippet_file": "3OR4TIMESSNIP.mp3", "part_number":"67407002","title":"MSO Fixing It_Alt","mix_id":"4","remix_capable":"0","duration":"00:02:52","tempo":"98","description":"Modern pop rock which sounds like Coldplay's 'Fix You'. Also sounds like Adele, U2, Keane, Radiohead & Nickelback. Long version.","tempo_type_id":"3","song_key":"EM","meter":"4/4","copyright_number":"Dean James Wagg","is_public_domain":"0","time_period_id":"1","isrc_no":"","pro_song_reg_no":"","is_exclusive":"0","project_song_id":"271","project_id":"23","comments":""},
          {"song_id":"6517","snippet_file": "3OR4TIMESSNIP.mp3", "part_number":"67408001","title":"MSO Fly To The Stars_Full","mix_id":"1","remix_capable":"0","duration":"00:02:15","tempo":"110","description":"Beautiful delicate & calm composition for Piano & strings.","tempo_type_id":"2","song_key":"CM","meter":"4/4","copyright_number":"Dean James Wagg","is_public_domain":"0","time_period_id":"1","isrc_no":"","pro_song_reg_no":"","is_exclusive":"0","project_song_id":"270","project_id":"23","comments":"flying is good"},
          {"song_id":"6","snippet_file": "3OR4TIMESSNIP.mp3", "part_number":"50103001","title":"Now I Lay Me Down_Full","mix_id":"1","remix_capable":"1","duration":"00:03:17","tempo":"80","description":"Female lead vocal, a prayer, hip beat with guitar & synth pad","tempo_type_id":"2","song_key":"AbM","meter":"4/4","copyright_number":"SRu559-370","is_public_domain":"0","time_period_id":"1","isrc_no":null,"pro_song_reg_no":null,"is_exclusive":"1","project_song_id":"268","project_id":"23","comments":"Good for the first song."}]
        }

    },
    deleteProject(project) {
      
      this.$bvModal.msgBoxConfirm(`Delete project "${project.name}"?`, {
        title: 'Please Confirm',
        size: 'sm',
        buttonSize: 'sm',
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
            console.debug(value);
            //this.boxOne = value
          })
          .catch(() => {
            // An error occurred
          })

    },
    ...mapActions("search", ["searchFromQueryParams", "loadSearchLookups", "setSearchData"]),
  },
  computed: {
    
    ...mapState("search", ["searchResults", 
                           "genres", 
                           "cdCategories",
                           "cds", 
                           "loadingSearch", "searchData", "searchErrorMessage"]),
    ...mapGetters("search", ["searchDescription", "hasSearched" ]),
    ...mapGetters("user", ["isAuthenticated" ]),
  },
  destroyed() {
   
  }
};
</script>

<style scoped>

.project-row {
  min-height:300px;
}

            
</style>

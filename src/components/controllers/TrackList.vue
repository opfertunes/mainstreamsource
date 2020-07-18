<template>
  <div>
    <BaseLayoutCommon>
      <template v-slot:page-header>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-7 text-center" data-aos="fade-up" data-aos-delay="400">
            <h1 class="text-white">{{ genre.title }}&nbsp;{{ id }}</h1>
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
                  v-for="(song, index) in songs"
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
import songs from "./../../data/songList";
import genres from "./../../data/genre";
import { HomePageJs } from "./../libs/HomePageJs";

export default {
  name: "TrackList",
  components: {
    BaseLayoutCommon
  },
  props: {
    msg: String
  },
  data() {
    return {
      songs: [],
      genre: genres[this.$route.params.id - 1],
      id: this.$route.params.id,
      playIndex: -1,
      loading: [],
      player: null,
      componentKey: 0,
      pause: false
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      HomePageJs();
    }, 1000);
    this.songs = songs;
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
        wavesurfer.on("ready", function() {
          wavesurfer.play();
        });
        let _self = this;
        wavesurfer.on("finish", function() {
          _self.pause = false;
          _self.player.stop();
          if (_self.playIndex < _self.songs.length - 1) {
            _self.playMusic(_self.playIndex + 1);
          } else if (_self.playIndex == _self.players.length - 1) {
            _self.playIndex = -1;
          }
        });
        wavesurfer.load(songs[i].trackUrl);
        this.player = wavesurfer;
      }, 500);
    },
    stopMusic: function() {
      this.player.playPause();
      this.pause = true;
      //this.playIndex = -1;
    }
  },
  destroyed() {}
};
</script>

<style scoped></style>

<template>
  <div>
    <BaseLayoutCommon>
      <template v-slot:page-header>
        <div class="row align-items-center justify-content-center">
          <div
            class="col-md-7 text-center"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <h1 class="text-white">{{ genre.title }}&nbsp;{{ id }}</h1>
            <p>Browse and listen to music from the list below.</p>
          </div>
        </div>
      </template>
      <template v-slot:page-content>
        <div class="site-section">
          <div class="container">
            <div
              class="d-block d-md-flex podcast-entry bg-white mb-5 main-song-container"
              data-aos="fade-up"
              v-for="(song, index) in songs"
              :key="index"
            >
              <div class="text" style="padding: 22px;">
                <div class="row">
                  <div class="col-sm-12">
                    <h3 class="font-weight-light" style="margin-top: -28px;">
                      <a style="font-size: 16px; color: #e3207b;"
                        >{{ song.title }}{{ index + 1 }}</a
                      >
                    </h3>
                  </div>
                  <div class="cntrl-container">
                    <i
                      class="fa fa-play-circle play-btn"
                      aria-hidden="true"
                      v-on:click="playMusic(index)"
                      v-if="!loading[index] && playIndex != index"
                      :key="componentKey"
                    ></i>
                    <i
                      class="fa fa-pause play-btn"
                      aria-hidden="true"
                      v-on:click="stopMusic(index)"
                      v-if="!loading[index] && playIndex == index"
                      :key="componentKey"
                    ></i>
                    <i
                      class="fa fa-spinner fa-spin fa-fw play-btn"
                      v-if="loading[index] === true"
                      :key="componentKey"
                    ></i>
                  </div>
                  <div class="col-sm">
                    <div class="waveform_container">
                      <div :id="`waveform_${index}`"></div>
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
    BaseLayoutCommon,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      songs: [],
      genre: genres[this.$route.params.id - 1],
      id: this.$route.params.id,
      playIndex: -1,
      loading: [],
      players: [],
      componentKey: 0,
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      HomePageJs();
    }, 1000);
    let promises = [];
    let _self = this;
    songs.forEach((song) => {
      promises.push(
        new Promise((resolve) => {
          this.loading.push(true);
          return resolve(song);
        })
      );
    });
    Promise.all(promises).then((songs) => {
      this.songs = songs;
      _self = this;
      setTimeout(() => {
        for (let index = 0; index < songs.length; index++) {
          let song = _self.songs[index];
          let wavesurfer = WaveSurfer.create({
            container: "#waveform_" + index,
            waveColor: "white",
            progressColor: "#e3207b",
            barHeight: 1,
            height: 40,
          });
          wavesurfer.on("ready", function() {
            _self.loading[index] = false;
            setTimeout(() => {
              _self.loading[index] = false;
              _self.componentKey++;
            }, 3000);
          });
          wavesurfer.on("finish", function() {
            _self.songs.forEach((song, index) => {
              _self.players[index].stop();
            });
            if (index < _self.players.length - 1) {
              _self.players[index + 1].play();
              _self.playIndex = index + 1;
            } else if (index == _self.players.length - 1) {
              _self.playIndex = -1;
            }
          });
          wavesurfer.load(song.trackUrl);
          _self.players.push(wavesurfer);
        }
      }, 1000);
    });
  },
  methods: {
    playMusic: function(i) {
      this.songs.forEach((song, index) => {
        if (i != index) {
          this.players[index].stop();
        }
      });
      this.players[i].play();
      this.playIndex = i;
    },
    stopMusic: function(i) {
      this.players[i].playPause();
      this.playIndex = -1;
    },
  },
  destroyed() {
    this.songs.forEach((song, index) => {
      this.players[index].stop();
    });
  },
};
</script>

<style scoped></style>

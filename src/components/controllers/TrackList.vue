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
            <p>Brwowse and listen to music from the list below.</p>
          </div>
        </div>
      </template>
      <template v-slot:page-content>
        <div class="site-section">
          <div class="container">
            <div
              class="d-block d-md-flex podcast-entry bg-white mb-5"
              data-aos="fade-up"
              v-for="(song, index) in songs"
              :key="index"
            >
              <div
                class="image"
                :style="{
                  backgroundImage: `url(${require(`@/assets/images/img_1.jpg`)})`,
                }"
              ></div>
              <div class="text">
                <h3 class="font-weight-light" style="margin-top: -28px;">
                  <a href="#">{{ song.title }}{{ index + 1 }}</a>
                </h3>
                <div class="mb-4 text-black">
                  <div class="row">
                    <div class="col-md-2">
                      <div class="controlsOuter">
                        <div class="controlsInner">
                          <div :id="`loading${index}`" class="loading"></div>
                          <div
                            class="btn playBtn"
                            :id="`playBtn${index}`"
                          ></div>
                          <div
                            class="btn pauseBtn"
                            :id="`pauseBtn${index}`"
                          ></div>
                          <div
                            class="btn prevBtn"
                            style="display:none"
                            :id="`prevBtn${index}`"
                          ></div>
                          <div
                            class="btn nextBtn"
                            style="display:none"
                            :id="`nextBtn${index}`"
                          ></div>
                        </div>
                        <div
                          class="btn playlistBtn"
                          style="display:none"
                          :id="`playlistBtn${index}`"
                        ></div>
                        <div
                          class="btn volumeBtn"
                          :id="`volumeBtn${index}`"
                        ></div>
                      </div>
                    </div>
                    <div class="col-md-10">
                      <div :id="`waveform${index}`" class="waveform"></div>
                      <div :id="`bar${index}`" class="bar"></div>
                      <div :id="`progress${index}`" class="progress"></div>
                    </div>
                  </div>
                  <div :id="`title${index}`" class="">
                    <span
                      :id="`track${index}`"
                      style="display:none"
                      class="track"
                    ></span>
                    <div :id="`timer${index}`" class="timer">0:00</div>
                    <div :id="`duration${index}`" class="duration">0:00</div>
                  </div>

                  <!-- Controls -->

                  <!-- Progress -->

                  <!-- Playlist -->
                  <div
                    style="display:none"
                    :id="`playlist${index}`"
                    class="playlist"
                  >
                    <div :id="`list${index}`" class="list"></div>
                  </div>

                  <!-- Volume -->
                  <div :id="`volume${index}`" class="fadeout volume">
                    <div :id="`barFull${index}`" class="barFull"></div>
                    <div :id="`barEmpty${index}`" class="barEmpty"></div>
                    <div :id="`sliderBtn${index}`" class="sliderBtn"></div>
                  </div>
                </div>

                <!-- <div class="player">
                <audio
                  id="player2"
                  preload="none"
                  controls
                  style="max-width: 100%"
                >
                  <source
                    src="http://www.largesound.com/ashborytour/sound/AshboryBYU.mp3"
                    type="audio/mp3"
                  />
                </audio>
              </div> -->
              </div>
            </div>
          </div>
          <!-- <div class="container" data-aos="fade-up">
          <div class="row">
            <div class="col-md-12 text-center">
              <div class="site-block-27">
                <ul>
                  <li>
                    <a href="#">&lt;</a>
                  </li>
                  <li class="active">
                    <span>1</span>
                  </li>
                  <li>
                    <a href="#">2</a>
                  </li>
                  <li>
                    <a href="#">3</a>
                  </li>
                  <li>
                    <a href="#">4</a>
                  </li>
                  <li>
                    <a href="#">5</a>
                  </li>
                  <li>
                    <a href="#">&gt;</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div> -->
        </div>
      </template>
    </BaseLayoutCommon>
  </div>
</template>

<script>
import BaseLayoutCommon from "./../layouts/BaseLayoutCommon";
import { MusicPlayer } from "./../libs/MusicPlayer";
import { SiriWave } from "./../libs/SiriWave";
import songs from "./../../data/songList";
import genres from "./../../data/genre";

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
      songs,
      genre: genres[this.$route.params.id - 1],
      id: this.$route.params.id,
    };
  },
  mounted() {
    let songEnd = (id) => {
      if (id <= songs.length - 1) {
        document.getElementById("pauseBtn" + id).click();
        setTimeout(() => {
          window["$"]("#pauseBtn" + id).css("display", "none");
        }, 100);
        document.getElementById("playBtn" + (id * 1 + 1)).click();
      } else {
        document.getElementById("pauseBtn" + id).click();
        setTimeout(() => {
          window["$"]("#pauseBtn" + id).css("display", "none");
        }, 100);
      }
      console.log("songend", id);
    };
    let promises = [];
    songs.forEach((song, index) => {
      promises.push(
        new Promise((resolve) => {
          MusicPlayer(index, songEnd);
          console.log(index, "index");
          resolve({});
        })
      );
    });
    Promise.all(promises).then(() => {
      SiriWave();
    });

    setTimeout(() => {
      //   const sound = new Howl({
      //     src: ["http://www.largesound.com/ashborytour/sound/AshboryBYU.mp3", ""],
      //   });
    }, 1200);

    // Play the sound.
    //sound.play();

    // Change global volume.
    //Howler.volume(0.5);
  },
};
</script>

<style scoped></style>

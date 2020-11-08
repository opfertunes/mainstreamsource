<template>
  <div>
    <BaseLayoutCover>
      <div class="site-section bg-dark block-13" v-click-outside="outsideClick">
        <div class="container" data-aos="fade-up">
          <div class="row">
            <div class="site-section-heading text-center mb-5 w-border col-md-6 mx-auto">
              <h2 class="mb-5">Upcoming</h2>
            </div>
          </div>
          <div class="nonloop-block-13 owl-carousel">
            <div
              v-for="(genre, index) in genres"
              :key="index"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <router-link :to="`/genres/${index + 1}/tracks`" class="unit-9">
                <!-- <a class="unit-9"> -->
                <div
                  class="image"
                  :style="{
                    backgroundImage: `url(${genre.image}/${index + 1}.jpg)`,
                  }"
                ></div>
                <div class="unit-9-content">
                  <h2>{{ genre.title }}&nbsp;{{ index + 1 }}</h2>
                </div>
                <!-- </a> -->
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="site-section">
        <div class="container">
          <div class="row">
            <div class="site-section-heading text-center mb-5 w-border col-md-6 mx-auto">
              <h2 class="mb-5">Browse Genre</h2>
              <p>
                Mainstream Source provides thousands of tracks composed and
                performed by consummate professionals, Grammy winners and
                legendary artists. Browse through the genre's below or select
                from the dropdown above.
              </p>
            </div>
          </div>
          <div class="row">
            <div
              v-for="(genre, index) in genres"
              :key="index"
              class="col-md-6 col-lg-3 home genre box genre-box"
              :class="{'selected-box':index == selected}"
            >
              <!-- <router-link :to="`/genres/${index + 1}/tracks`" class="unit-9"> -->
              <a
                class="unit-9"
                :class="{'inner-selected-box':index == selected}"
                v-on:click="openBox(index)"
              >
                <div
                  class="image"
                  :style="{
                    backgroundImage: `url(${genre.image}/${index + 1}.jpg)`,
                  }"
                ></div>
                <div class="unit-9-content">
                  <router-link :to="`/genres/${index + 1}/tracks`">
                    <h2>{{ genre.title }}&nbsp;{{ index + 1 }}</h2>
                  </router-link>
                </div>
              </a>
              <!-- </router-link> -->
              <div class="hidden-box" :class="{'not-hidden-box':index == selected}">
                <div data-v-198874de class="row mb-5">
                  <div data-v-198874de class="col-md-12">
                    <h3 data-v-198874de class="footer-heading mb-4">Acoustic Genre</h3>
                  </div>
                  <div data-v-198874de class="col-md-6 col-lg-6">
                    <ul data-v-198874de class="list-unstyled">
                      <li data-v-198874de>
                        <router-link
                          :to="`/genres/${index + 1}/tracks`"
                          class="router-link-exact-active router-link-active"
                        >Sub Acoustic 1</router-link>
                      </li>
                      <li data-v-198874de>
                        <router-link
                          :to="`/genres/${index + 1}/tracks`"
                          class="router-link-exact-active router-link-active"
                        >Sub Acoustic 2</router-link>
                      </li>
                      <li data-v-198874de>
                        <router-link
                          :to="`/genres/${index + 1}/tracks`"
                          class="router-link-exact-active router-link-active"
                        >Sub Acoustic 3</router-link>
                      </li>
                      <li data-v-198874de>
                        <router-link
                          :to="`/genres/${index + 1}/tracks`"
                          class="router-link-exact-active router-link-active"
                        >Sub Acoustic 3</router-link>
                      </li>
                      <li data-v-198874de>
                        <router-link
                          :to="`/genres/${index + 1}/tracks`"
                          class="router-link-exact-active router-link-active"
                        >Sub Acoustic 3</router-link>
                      </li>
                      <li data-v-198874de>
                        <router-link
                          :to="`/genres/${index + 1}/tracks`"
                          class="router-link-exact-active router-link-active"
                        >Sub Acoustic 3</router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayoutCover>
  </div>
</template>

<script>
import BaseLayoutCover from "./../layouts/BaseLayoutCover";
import genres from "./../../data/genre.json";
import { HomePageJs } from "./../libs/HomePageJs";

export default {
  name: "HomePage",
  components: {
    BaseLayoutCover
  },
  props: {
    msg: String
  },
  data() {
    return { genres, selected: -1 };
  },
  mounted() {
    setTimeout(() => {
      HomePageJs();
    }, 1000);
  },
  methods: {
    openBox: function(index) {
      setTimeout(() => {
        this.selected = index;
      }, 100);
    },
    // eslint-disable-next-line no-unused-vars
    outsideClick: function(event) {
      if (this.selected != -1) this.selected = -1;
    }
  }
};
</script>

<style scoped></style>

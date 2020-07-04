<template>
  <div>
    <BaseLayoutCover>
      <div class="site-section bg-dark block-13">
        <div class="container" data-aos="fade-up">
          <div class="row">
            <div
              class="site-section-heading text-center mb-5 w-border col-md-6 mx-auto"
            >
              <h2 class="mb-5">Upcoming</h2>
            </div>
          </div>
          <div class="nonloop-block-13 owl-carousel">
            <div
              v-for="(genre, index) in genres"
              :key="index"
              class=""
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
            <div
              class="site-section-heading text-center mb-5 w-border col-md-6 mx-auto"
            >
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
              class="col-md-6 col-lg-3 home genre box"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <!-- <router-link :to="`/genres/${index + 1}/tracks`" class="unit-9"> -->
              <a class="unit-9">
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
              <div
                style="width: 443px;
position: absolute;
height: 330px;
background: white;
z-index: 999999999999999;
top: 0;
left: 270px; display: none;"
              ></div>
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
    BaseLayoutCover,
  },
  props: {
    msg: String,
  },
  data() {
    return { genres };
  },
  mounted() {
    setTimeout(() => {
      HomePageJs();
    }, 1000);
  },
};
</script>

<style scoped></style>

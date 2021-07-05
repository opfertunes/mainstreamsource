<template>
  <div>
    <VueSlickCarousel v-bind="carouselSettings" ref="carousel">
      <div v-for="cd in cdList" :key="cd.cd_id">
        <div class="d-block text-center image-container">
          <img
            class="image d-inline-block image-link"
            :src="`https://mainstreamsource.com/${cd.image_loc}`"
            :width="250"
            :height="250"
            @click="gotoCd(cd)"
            @dragstart="preventImageDrag"
            @dragend="preventImageDrag"
          />
        </div>
      </div>
    </VueSlickCarousel>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";

export default {
  components: {
    VueSlickCarousel,
  },
  props: {
    cdList: { type: Array, required: true, default: () => [] },
  },
  data() {
    return {
      carouselSettings: {
        dots: true,
        infinite: false,
        //speed: 500,
        swipeToSlide: true,
        draggable: true,
        slidesToShow: 6,
        slidesToScroll: 6,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1660,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 5,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 1400,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 1100,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 856,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2,
            },
          },
          {
            breakpoint: 604,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      },
    };
  },
  methods: {
    preventImageDrag(e) {
      e.preventDefault();
    },

    gotoCd: function (cd) {
      if (!this.$refs["carousel"].$children[0].clickable) {
        return;
      }
      this.$router.push(`/tracks?cd=${cd.cd_id}`);
    },
  },
};
</script>

<style scoped>
.image-container {
  width: 250px;
  height: 250px;
}
.image-overlay {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 250px;
  height: 250px;
}

.image-link {
  cursor: pointer;
}
</style>
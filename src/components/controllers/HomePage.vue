<template>
  <div>
    <BaseLayoutCover/>
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

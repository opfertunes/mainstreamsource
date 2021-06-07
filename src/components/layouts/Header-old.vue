<template>
  
  <div class="site-navbar">
      <div class="container-fluid py-1">
        <div class="row">
          <left-side-bar :props-is-collapsed="collapse" @toggle-sidebar="toggleSidebar"></left-side-bar>
          <div class="col-8 col-md-8 col-lg-5">
            <h1 class="mb-0">
              <router-link to="/" class="text-white h2 mb-0">
                <strong>
                  <span class="icon-menu" @click="switchToggle"></span> Mainstream
                  <span class="text-primary">
                    <i class="fa fa-headphones" aria-hidden="true"></i>
                  </span>&nbsp;Source
                </strong>
              </router-link>
            </h1>
          </div>
          <div class="col-4 col-md-4 col-lg-7">
            <nav class="site-navigation text-right text-md-right" role="navigation">
              <div class="d-inline-block d-lg-none ml-md-0 mr-auto py-3">
                <a href="#" class="site-menu-toggle js-menu-toggle text-white">
                  <span class="icon-menu h3"></span>
                </a>
              </div>

              <ul class="site-menu js-clone-nav d-none d-lg-block">
                <li class="active">
                  <router-link to="/">Homer</router-link>
                </li>
                <li>
                  <router-link to="/">Main</router-link>
                </li>
                <li>
                  <router-link to="/">Contact Us</router-link>
                </li>
                <li>
                  <router-link to="/">License Trademark</router-link>
                </li>
                <li>
                  <router-link to="/">Search Catalogue</router-link>
                </li>
                <li>
                  <a v-if="!isAuthenticated" 
                     href="https://mainstreamsource.com/login.php?redirect_to=/newvue/">Loginn</a>

                  <a v-if="isAuthenticated" 
                     href="https://mainstreamsource.com/login.php?Action=logout&redirect_to=/newvue/">Logout</a>   
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
  </div>
  
</template>

<script>

import LeftSideBar from "@/components/layouts/LeftSideBar";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Header",
  components: {LeftSideBar},
  props: {},
  data() {
    return {
      collapse: true
    };
  },
  created() {
    this.loadAuthUserData();
  },
  methods: {
    toggleSidebar(isCollapsed) {
      this.collapse = isCollapsed;
    },
    switchToggle() {
      this.collapse = !this.collapse;
    },
    ...mapActions("user", ["loadAuthUserData" ]),
  },
  computed: {
     ...mapGetters("user", ["isAuthenticated" ]),
  }
};
</script>

<style scoped></style>

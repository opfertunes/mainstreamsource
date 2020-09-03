<template>
  <div>
    <div class="site-navbar mt-4">
      <div class="container py-1">
        <div class="row align-items-center">
          <left-side-bar :props-is-collapsed="collapse" @toggle-sidebar="toggleSidebar"></left-side-bar>
          <div class="col-8 col-md-8 col-lg-4">
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
          <div class="col-4 col-md-4 col-lg-8">
            <nav class="site-navigation text-right text-md-right" role="navigation">
              <div class="d-inline-block d-lg-none ml-md-0 mr-auto py-3">
                <a href="#" class="site-menu-toggle js-menu-toggle text-white">
                  <span class="icon-menu h3"></span>
                </a>
              </div>

              <ul class="site-menu js-clone-nav d-none d-lg-block">
                <li class="active">
                  <router-link to="/">Home</router-link>
                </li>
                <li>
                  <router-link to="/">Main</router-link>
                </li>
                <!-- <li class="has-children">
                  <a href="shows.html">Shows</a>
                  <ul class="dropdown arrow-top">
                    <li>
                      <a href="#">Top 20 of The Week</a>
                    </li>
                    <li>
                      <a href="#">Featured Artist</a>
                    </li>
                    <li>
                      <a href="#">Interviews</a>
                    </li>
                    <li class="has-children">
                      <a href="#">Sub Menu</a>
                      <ul class="dropdown">
                        <li>
                          <a href="#">Menu One</a>
                        </li>
                        <li>
                          <a href="#">Menu Two</a>
                        </li>
                        <li>
                          <a href="#">Menu Three</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>-->
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
                  <router-link to="/">Login</router-link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div class="site-mobile-menu">
      <div class="site-mobile-menu-header">
        <div class="site-mobile-menu-close mt-3">
          <span class="icon-close2 js-menu-toggle"></span>
        </div>
      </div>
      <div class="site-mobile-menu-body"></div>
    </div>
    <!-- .site-mobile-menu -->
  </div>
</template>

<script>

import LeftSideBar from "@/components/layouts/LeftSideBar";

export default {
  name: "Header",
  components: {LeftSideBar},
  props: {},
  data() {
    return {
      collapse: true
    };
  },
  methods: {
    toggleSidebar(isCollapsed) {
      this.collapse = isCollapsed;
    },
    switchToggle() {
      this.collapse = !this.collapse;
    }
  }
};
</script>

<style scoped></style>

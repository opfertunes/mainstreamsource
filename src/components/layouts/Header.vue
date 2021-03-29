<template>

<div>
  <b-navbar toggleable="lg" type="dark" >
    <div id="left-sidebar-logo">
    <!--  
    <div id="left-sidebar-toggler" v-b-toggle.sidebar-right>
      <span data-v-146e2983="" class="icon-menu"></span>
    </div>
    -->
    <!--
    <button  v-b-toggle.sidebar-right 
         type="button" 
         aria-label="Toggle sidebar" 
         class="navbar-toggler collapsed" 
         style="overflow-anchor: none;">
         <span class="navbar-toggler-icon"></span>
    </button>
    <b-sidebar id="sidebar-left" title="Sidebar" left shadow>
      
    </b-sidebar>
    -->

    <left-side-bar 
        :props-is-collapsed="collapse" 
        @toggle-sidebar="toggleSidebar">
    </left-side-bar>

    <b-navbar-brand href="#">
      <h1 class="mb-0">
              <router-link to="/" class="text-white h2 mb-0">
                <strong>
                  <!-- <span class="icon-menu" v-b-toggle.sidebar-left></span> -->
                  
                  <span class="icon-menu" @click="switchToggle"></span>  Mainstream


                  <span class="text-primary">
                    <i class="fa fa-headphones" aria-hidden="true"></i>
                  </span>&nbsp;Source
                </strong>
              </router-link>
            </h1>
    </b-navbar-brand>
    </div>


    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">Link</b-nav-item>
        <b-nav-item href="#" disabled>Disabled</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>

        <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
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

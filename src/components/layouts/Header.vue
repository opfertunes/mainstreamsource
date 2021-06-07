<template>


  <b-navbar toggleable="lg" type="dark" fixed="top" variant="dark" :sticky="true">
   
<img id="header-logo" src="@/assets/images/mss-logo.png" alt="mainstream source logo" />
    <left-side-bar 
        :props-is-collapsed="collapse" 
        @toggle-sidebar="toggleSidebar">
    </left-side-bar>

    <b-navbar-brand href="#">
      <div class="d-inline-block pr-2" @click="switchToggle">
         <div id="left-menu-toggler" class="icon-menu"/>
      </div> 
                   
            
              
            
    </b-navbar-brand>
   
    
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav right>

      <b-navbar-nav class="ml-auto">
        <b-nav-item href="https://mainstreamsource.com/">Main</b-nav-item> 
        <b-nav-item href="#">License Trademark</b-nav-item> 
        <b-nav-item href="https://mainstreamsource.com/news/">News</b-nav-item> 
        <b-nav-item href="#">Contact</b-nav-item> 
        <b-nav-item v-if="!isAuthenticated" 
            href="https://mainstreamsource.com/login.php?redirect_to=/newvue/">Login</b-nav-item>
        
        <b-nav-item v-if="isAuthenticated" 
            to="/projects">My Projects</b-nav-item>     

        <b-nav-item v-if="isAuthenticated" 
            to="https://mainstreamsource.com/login.php?Action=logout&amp;redirect_to=/newvue/">Logout</b-nav-item>     

       
      </b-navbar-nav>
    </b-collapse>
    
  </b-navbar>

  
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

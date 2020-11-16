<template>
  <sidebar-menu
      :menu="propsIsCollapsed ? blank : menu"
      :width-collapsed="'0px'"
      :hideToggle="propsIsCollapsed"
      :collapsed="propsIsCollapsed"
      @toggle-collapse="toggleSidebar">

     <div slot="toggle-icon">
       <i class="fa fa-arrow-circle-left fa-2x"></i>
     </div>
     
  </sidebar-menu>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  name: "LeftSideBar",
  data() {
    return {
      blank: []
    }
  },
  props: ['propsIsCollapsed'],
  methods: {
    toggleSidebar(isCollapsed) {
      this.$emit('toggle-sidebar', isCollapsed);
    }
  },
  computed: {
    menu() {

      const result = [
        {
          header: true,
          title: 'Mainstream Source',
          hiddenOnCollapse: true
        },
        {
          href: '/',
          title: 'Dashboard',
          icon: 'fa fa-user'
        }, 
        ...this.leftMenuTree.map(menuItem => {
          return {
            href: '/',
            title: menuItem.cdCategory.description,
            icon: 'fa fa-music',
            child: menuItem.cds.map(cd => {
              return {
                href: '/',
                title: cd.title,
                icon: 'fa fa-play-circle-o',
              }
            })
          }
        })
      ]

      return result;
    },
    ...mapGetters("search", ["leftMenuTree"])
  }
}
</script>

<style scoped>

</style>
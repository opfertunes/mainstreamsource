<template>
  <sidebar-menu
      :menu="propsIsCollapsed ? blank : menu"
      :width-collapsed="'0px'"
      :hideToggle="propsIsCollapsed"
      :collapsed="propsIsCollapsed"
      @toggle-collapse="toggleSidebar">

  <template v-slot:toggle-icon>
    <i class="fa fa-arrow-circle-left fa-2x"></i>
  </template>
  </sidebar-menu>
</template>

<script>
export default {
  name: "LeftSideBar",
  data() {
    return {
      menu: [
        {
          header: true,
          title: 'Main Navigation',
          hiddenOnCollapse: true
        },
        {
          href: '/',
          title: 'Dashboard',
          icon: 'fa fa-user'
        },
        {
          href: '/charts',
          title: 'Charts',
          icon: 'fa fa-chart-area',
          child: [
            {
              href: '/charts/sublink',
              title: 'Sub Link'
            }
          ]
        }
      ],
      blank: []
    }
  },
  props: ['propsIsCollapsed'],
  methods: {
    toggleSidebar(isCollapsed) {
      this.$emit('toggle-sidebar', isCollapsed);
    }
  }
}
</script>

<style scoped>

</style>
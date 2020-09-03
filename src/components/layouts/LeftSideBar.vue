<template>
  <sidebar-menu :menu="menu" :collapsed="propsIsCollapsed" @toggle-collapse="toggleSidebar"/>
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
      ]
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
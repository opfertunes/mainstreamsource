<template>
  <span>
  <sidebar-menu
      :menu="propsIsCollapsed ? blank : menu"
      :width-collapsed="'0px'"
      :hideToggle="propsIsCollapsed"
      :collapsed="propsIsCollapsed"
      @toggle-collapse="toggleSidebar">

   
     <div slot="toggle-icon">
       {{propsIsCollapsed}} {{usePopoverMenu}}
       <i class="fa fa-arrow-circle-left fa-2x"></i>
     </div>

  </sidebar-menu>
  <div id="sidebar-popover" 
       v-if="popoverData && showPopover"
       @mouseout="onPopoverMouseOut"
       @mouseover="onPopoverMouseOver"
       :style="{top: `${popoverData.offsetTop}px`}">
       
       POPOVER THING!  {{popoverData}}

  </div>      
       
  </span>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  name: "LeftSideBar",
  data() {
    return {
      blank: [],
      usePopoverMenu: null,
      popoverData: null,
      showPopover: false,
      popoverTimeout: null,
      mouseInSidebar: false,
      mouseInPopover: false,
    }
  },
  created: function() {
    window.$(window).on("resize", this.handleWindowResize);
    this.handleWindowResize();
  },
  mounted: function() {
    this.updateMouseOverEvents();
  },
  beforeUnmount: function() {
    
    window.$(".vsm--link.vsm--link_level-1.vsm--link_disabled").off("mouseenter mouseleave");
    window.$(".v-sidebar-menu").off("mouseenter mouseleave");

    window.$(window).off("resize", this.handleWindowResize)

  },
  props: ['propsIsCollapsed'],
  methods: {
    toggleSidebar(isCollapsed) {
      this.$emit('toggle-sidebar', isCollapsed);
    },

    doShowPopup(categoryId, offsetTop) {
      
      //console.debug("DOSHOW POPUP: ", categoryId, offsetTop);

      const parentLink = this.menu.find(menuItem => {
        return menuItem.attributes && menuItem.attributes["data-id"] === categoryId;
      })

      if (parentLink) {
        //console.debug("Set popover data! ", parentLink);
        this.popoverData = {category: parentLink,
                            offsetTop}; 
        this.showPopover = true;
      } 

      this.popoverTimeout = null;
    },

    parentLinkOnMouseEnter(event) {
        
        const $el = window.$(event.currentTarget);
        const categoryId = $el.attr("data-id");

        //console.debug(`>>>>> parentLinkOnMouseEnter ${categoryId}`);
        if (this.popoverTimeout) {
          //console.debug("popoverTimeout not null, LEAVE")
          clearTimeout(this.popoverTimeout);
         this.popoverTimeout = null;
          return;  
        } else if (this.popoverData && this.popoverData.category.categoryId === categoryId) {
          //console.debug("SAME CATEGORYID, LEAVE")
          return;  
        }
        else {
          //console.warn("SET TIMEOUT!", categoryId);
          this.popoverTimeout = setTimeout(this.doShowPopup, 125, categoryId, $el.offset().top); 

        }

        
       
    },
    parentLinkOnMouseLeave() {
       //console.debug("<<<<<< parentLinkOnMouseLEAVE");
       if (this.popoverTimeout) {
         //console.debug("CLEAR THE TIMEOUT!")
         clearTimeout(this.popoverTimeout);
         this.popoverTimeout = null;
       }
    },  
    onSidebarMouseOver() {
      console.debug("sidebar IN");
      this.mouseInSidebar = true;
      this.mouseInPopover = false;
    },
    onSidebarMouseOut() {
      console.debug("sidebar OUT");
      setTimeout(() => {
         this.mouseInSidebar = false;
      }, 50);   
    },
    onPopoverMouseOver() {
      this.mouseInSidebar = false;
      this.mouseInPopover = true;
    },
    onPopoverMouseOut() {
      setTimeout(() => {
         this.mouseInPopover = false;
      }, 50);   
    },
    handleWindowResize() {
      this.usePopoverMenu = window.$(window).width() >= 992;
    },
    updateMouseOverEvents() {
      
      this.mouseInSidebar = false;
      this.mouseInPopover = false;

      window.$(".vsm--link.vsm--link_level-1.vsm--link_disabled").off("mouseenter mouseleave"); 

      window.$(".v-sidebar-menu").off("mouseenter mouseleave");

      if (!this.propsIsCollapsed && this.usePopoverMenu) {
         this.$nextTick(() => {
          window.$(".vsm--link.vsm--link_level-1.vsm--link_disabled").hover(this.parentLinkOnMouseEnter, this.onMouseoutParentLink);

          window.$(".v-sidebar-menu").hover(this.onSidebarMouseOver, this.onSidebarMouseOut);

        })
      }
      else  {
        this.popoverData = null;
        this.showPopover = false;
      }
    },
    checkMouseOutOfAll() {
      console.debug({
        sidebar: this.mouseInSidebar,
        popover: this.mouseInPopover,
      })

      this.$nextTick(() => {
        if (
         !this.mouseInSidebar && 
         !this.mouseInPopover ) {
           //console.warn("CLOSE");
        this.popoverData = null;
      }

      })
      
    } 
  },
  computed: {
    menu() {
      console.debug("MENU!")
      const result = [
        {
          header: true,
          title: 'Mainstream Source',
          hiddenOnCollapse: true
        }, 
        ...this.leftMenuTree.map(menuItem => {
          //console.debug(this.usePopoverMenu, JSON.parse(JSON.stringify(menuItem)))
          return {
            //href: `/tracks?cd_category=${menuItem.cdCategory.category_id}`,
            title: menuItem.cdCategory.description,
            icon: 'fa fa-music',
            attributes: {"data-id": menuItem.cdCategory.category_id},
            categoryId: menuItem.cdCategory.category_id,
            disabled: this.usePopoverMenu,
            child: menuItem.cds.map(cd => {
              return {
                href: `/tracks?cd=${cd.cd_id}`,
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
  },
  watch: {
    usePopoverMenu() {
        //console.debug({usePopoverMenu: this.usePopoverMenu})
        //if (!this.usePopoverMenu)
        //{
          if (!this.propsIsCollapsed) {
            this.toggleSidebar(true);
          }
        //}
        this.updateMouseOverEvents();
    },
    propsIsCollapsed(){
      this.updateMouseOverEvents();
    },

    mouseInSidebar() {
      this.checkMouseOutOfAll();
    },
    mouseInPopover() {
      this.checkMouseOutOfAll();
    },

  }
}
</script>

<style scoped>

#sidebar-popover {
  position: absolute;
  z-index: 2000;
  left: 350px;
  background-color: #fff;
  width: 400px;
  border: 1px solid;
  color: #000;
}

</style>
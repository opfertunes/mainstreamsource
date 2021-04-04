<template>
  <span>
  <sidebar-menu
      :menu="propsIsCollapsed ? blank : menu"
      :width-collapsed="'0px'"
      :hideToggle="propsIsCollapsed"
      :collapsed="propsIsCollapsed"
      @toggle-collapse="toggleSidebar"
      @item-click="onItemClick">

   
     <div slot="toggle-icon">
       <i class="fa fa-arrow-circle-left fa-2x"></i>
     </div>

  </sidebar-menu>
  <div id="sidebar-popover" 
       v-if="popoverData && showPopover"
       @mouseleave="onPopoverMouseOut"
       @mouseenter="onPopoverMouseOver"
       :style="{top: `${popoverData.offsetTop}px`}">
      <div v-for="album in popoverData.category.child" 
           :key="album.id"
           class="popover-item ml-2 pt-2 pb-2">
       
        <a href="#"
          class="popover-link"
          @click="onItemClick(null, album, null)">
         <i class="vsm--icon fa fa-play-circle-o pr-2"></i>
          {{album.title}}
          
        </a>
      
      </div>   
       
  </div>      
       
  </span>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import $ from "jquery";

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
    $(window).on("resize", this.handleWindowResize);
    this.handleWindowResize();
  },
  mounted: function() {
    this.updateMouseOverEvents();
  },
  beforeUnmount: function() {
    
    $(".vsm--link.vsm--link_level-1.vsm--link_disabled").off("mouseenter mouseleave");
    $(".v-sidebar-menu").off("mouseenter mouseleave");

    $(window).off("resize", this.handleWindowResize)

  },
  props: ['propsIsCollapsed'],
  methods: {
    toggleSidebar(isCollapsed) {
      this.$emit('toggle-sidebar', isCollapsed);
    },
    onItemClick(event, item) {
      
      if (item.attributes && item.attributes["data-params"] && item.attributes["data-url"]) {
        
        this.$router.push(item.attributes["data-url"]).catch(() => {});
        this.searchFromQueryParams(item.attributes["data-params"])
          .then(() => {
            this.$emit('toggle-sidebar', true);
          });  
      }
    },

    doShowPopup(categoryId, offsetTop) {
      
      const parentLink = this.menu.find(menuItem => {
        return menuItem.attributes && menuItem.attributes["data-id"] === categoryId;
      })

      if (parentLink) {

        this.popoverData = {category: parentLink,
                            offsetTop}; 
        this.showPopover = true;
      } 

      this.popoverTimeout = null;
    },

    parentLinkOnMouseEnter(event) {
        
        const $el = $(event.currentTarget);
        const categoryId = $el.attr("data-id");

        if (this.popoverTimeout) {
          clearTimeout(this.popoverTimeout);
          this.popoverTimeout = null;
          
          return;  
        } else if (this.popoverData && this.popoverData.category.categoryId === categoryId) {
          return;  
        }
        else {
          this.popoverTimeout = setTimeout(this.doShowPopup, 60, categoryId, $el.offset().top); 

        }

        
       
    },
    parentLinkOnMouseLeave() {
       if (this.popoverTimeout) {
         clearTimeout(this.popoverTimeout);
         this.popoverTimeout = null;
       }
    },  
    onSidebarMouseOver() {
      this.mouseInSidebar = true;
      this.mouseInPopover = false;
    },
    onSidebarMouseOut() {
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
      this.usePopoverMenu = $(window).width() >= 992;
    },
    updateMouseOverEvents() {
      
      this.mouseInSidebar = false;
      this.mouseInPopover = false;

      $(".vsm--link.vsm--link_level-1.vsm--link_disabled").off("mouseenter mouseleave"); 

      $(".v-sidebar-menu").off("mouseenter mouseleave");

      if (!this.propsIsCollapsed && this.usePopoverMenu) {
         this.$nextTick(() => {
          $(".vsm--link.vsm--link_level-1.vsm--link_disabled").hover(this.parentLinkOnMouseEnter, this.onMouseoutParentLink);

          $(".v-sidebar-menu").hover(this.onSidebarMouseOver, this.onSidebarMouseOut);

        })
      }
      else  {
        this.popoverData = null;
        this.showPopover = false;
      }
    },
    checkMouseOutOfAll() {
      //console.debug({
      //  sidebar: this.mouseInSidebar,
      //  popover: this.mouseInPopover,
      //})

      this.$nextTick(() => {
        if (
         !this.mouseInSidebar && 
         !this.mouseInPopover ) {
           //console.warn("CLOSE");
        this.popoverData = null;
      }

      })
      
    },
    ...mapActions("search", ["searchFromQueryParams"]), 
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
          title: 'Home',
          icon: 'fa fa-user'
        }, 
        ...this.leftMenuTree.map(menuItem => {
          
          return {
            //href: `/tracks?cd_category=${menuItem.cdCategory.category_id}`,
            title: menuItem.cdCategory.description,
            icon: 'fa fa-music',
            attributes: {"data-id": menuItem.cdCategory.category_id},
            categoryId: menuItem.cdCategory.category_id,
            disabled: this.usePopoverMenu,
            child: menuItem.cds.map(cd => {
              return {
                id: cd.cd_id,
                href: this.usePopoverMenu ? null: `/tracks?cd=${cd.cd_id}`,
                title: cd.title,
                exactPath: false,
                icon: 'fa fa-play-circle-o',
                attributes: {"data-params": {cd: cd.cd_id}, "data-url": `/tracks?cd=${cd.cd_id}`}
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
  background-color: #2a2a2e;
  position: absolute;
  z-index: 2000;
  left: 350px;
  
  border: 1px solid;
  color: #000;
  /*min-height: 150px; */
  min-width: 300px;
}
.popover-item {
  background-color: #2a2a2e;
}
.popover-item:hover {
    background-color: rgba(30,30,33,0.5);
}
.popover-link {
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  padding: 10px;
  line-height: 30px;
  text-decoration: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  z-index: 20;
  -webkit-transition: 0.3s all ease;
  transition: 0.3s all ease;
}



</style>
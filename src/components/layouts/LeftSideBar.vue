<template>
  <span>
  <sidebar-menu
      :menu="propsIsCollapsed ? blank : menu"
      :width-collapsed="'0px'"
      :hideToggle="true"
      :collapsed="propsIsCollapsed"
      @toggle-collapse="toggleSidebar"
      @item-click="onItemClick">

     <div slot="header">
       <div class="vsm--header pr-2">Mainstream Source
         <button 
            type="button" 
            aria-label="Close" 
            class="close text-light"
            @click="closeSidebar">×</button>
     
       </div>

     </div>
     <!--
     <div slot="toggle-icon">
       <i class="fa fa-arrow-circle-left fa-2x"></i>
     </div>
     -->

  </sidebar-menu>
  <div id="sidebar-popover" 
       v-if="popoverData && showPopover"
       @mouseleave="onPopoverMouseOut"
       @mouseenter="onPopoverMouseOver"
       :style="{top: `${popoverData.offsetTop}px`}"> 
      <div class="header pt-2 pb-2 text-center text-nowrap">
        <b>{{popoverData.category.title}}</b>
      </div> 
      <div class="sidebar-popover-scroller text-nowrap">     
      <div v-for="album in popoverData.category.child" 
           :key="album.id"
           class="popover-item pt-2 pb-2">
        
        <a href="#"
          class="popover-link"
          @click="onItemClick(null, album, null)">
         <i class="vsm--icon fa fa-play-circle-o pr-2"></i>
          {{album.title}}
          
        </a>
        
      
      </div>   
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
    closeSidebar() {
      this.popoverData = null;
      this.$emit('toggle-sidebar', true);
      

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

    doShowPopup(category, offsetTop) {
            
      this.popoverData = {category,
                            offsetTop}; 
                   
      this.showPopover = true;
  
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
          const parentLink = this.menu.find(menuItem => {
            return menuItem.attributes && menuItem.attributes["data-id"] === categoryId;
          });

          if (parentLink) {
            const itemCount = parentLink.child.length;
            const requiredHeight = (itemCount * 53) + 46;
            let offsetTop = $el.offset().top - $(window).scrollTop();
            
            if (offsetTop + requiredHeight > $(window).height()) {
              offsetTop -= (offsetTop + requiredHeight) - $(window).height();
              if (offsetTop < 10) {
                offsetTop = 10;
              }
            } 
        
            this.popoverTimeout = setTimeout(this.doShowPopup, 60, parentLink, offsetTop); 
   
         }
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

      this.$nextTick(() => {
        if (
         !this.mouseInSidebar && 
         !this.mouseInPopover ) {
        this.popoverData = null;
      }

      })
      
    },
    ...mapActions("search", ["searchFromQueryParams"]), 
  },

  computed: {
    menu() {

      const result = [
        //{
        //  header: true,
        //  title: 'Mainstream Source',
        //  hiddenOnCollapse: true
        //}, 
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
        if (!this.propsIsCollapsed) {
          this.toggleSidebar(true);
        }
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
  min-width: 450px; 
}

#sidebar-popover .header {
  background: #181a1e;
  color: rgba(255,255,255,0.7);
}

#sidebar-popover .sidebar-popover-scroller {
  max-height: calc(100vh - 20px - 75px);
  width: auto;    
  /*padding-right: 20px;*/
  overflow-y: auto;
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
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 0px;
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

.v-sidebar-menu.vsm_collapsed .vsm--header {
  display: none;
}
.v-sidebar-menu .vsm--header {
  background: #181a1e;  
  padding-left: 85px;
}

</style>
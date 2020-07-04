import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import HomePage from "./components/controllers/HomePage";
import TrackList from "./components/controllers/TrackList";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

Vue.config.productionTip = false;

Vue.component("v-select", vSelect);
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: HomePage,
    meta: {
      title: "MainstreamSource | Home",
      metaTags: [
        {
          name: "description",
          content: "MainstreamSource Home page",
        },
        {
          property: "og:description",
          content: "MainstreamSource Home page",
        },
      ],
    },
  },
  {
    path: "/genres/:id/tracks",
    component: TrackList,
    meta: {
      title: "MainstreamSource | Genre {Name} |Track List",
      metaTags: [
        {
          name: "description",
          content: "MainstreamSource Genra Track List page",
        },
        {
          property: "og:description",
          content: "MainstreamSource Genra Track List page",
        },
      ],
    },
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

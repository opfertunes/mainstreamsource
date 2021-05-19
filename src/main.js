import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import HomePage from "./components/controllers/HomePage";
import TrackList from "./components/controllers/TrackList";
import Projects from "./components/controllers/Projects";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import VueSidebarMenu from 'vue-sidebar-menu';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';
import store from '@/store';
import { publicPath } from '../vue.config'
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import "./assets/fonts/icomoon/style.css";
import "./assets/css/animate.css";

import "./assets/css/MusicPlayer.css";
import "./assets/fonts/fa/css/font-awesome.min.css";

import './assets/css/style.css'
import "./assets/css/custom.css";

Vue.config.productionTip = false;

Vue.component("v-select", vSelect);
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(VueSidebarMenu);

Vue.directive("click-outside", {
    bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
            // here I check that click was outside the el and his childrens
            if (!(el == event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
    },
    unbind: function (el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
    },
});

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
        path: "/tracks",
        component: TrackList,
        meta: {
            title: "MainstreamSource | Genre | Track List",
            metaTags: [
                {
                    name: "description",
                    content: "MainstreamSource Genre Track List page",
                },
                {
                    property: "og:description",
                    content: "MainstreamSource Genre Track List page",
                },
            ],
        },
    },
    {
        path: "/projects",
        component: Projects,
        meta: {
            title: "MainstreamSource | My Projects",
        },
    },
    {
        path: '*',
        name: 'catchAll',
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
    }
];

const router = new VueRouter({
    base: publicPath,
    routes,
    mode: "history",
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {x: 0, y: 0};
        }
    },
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});

new Vue({
    store,
    router,
    render: (h) => h(App),
}).$mount("#app");

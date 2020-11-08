/**
 * Namespaced Vuex store for the application
 */

import Vue from "vue";
import Vuex from "vuex";

import search from "@/store/search";
import user from "@/store/user";

Vue.use(Vuex);

export default new Vuex.Store({
   modules: {
      search,
      user,
   },
});

/**
 *  Vuex store for the storing authenticated user information.
 *  Stub for future use....
 */

import Vue from "vue";


export function defaultState() {
   return {
      userType: null,
      userId: null,
      userRights: {
      },
   };
}

// eslint-disable-next-line func-style
export const getters = {
   userType: (state) => state.userType,
   userId: (state) => state.userId,
   userRights: (state) => state.userRights,
};

export const mutations = {

   setUserType(state, userType) {
      Vue.set(
         state,
         "userType",
         userType,
      );
   },
   setUserId(state, userId) {
      Vue.set(
         state,
         "userId",
         userId,
      );
   },
   setUserRights(state, value) {
      Vue.set(
         state,
         "userRights",
         value,
      );
   },
};

export const actions = {};

export default {
   namespaced: true,
   state: defaultState(),
   getters,
   mutations,
   actions,
}
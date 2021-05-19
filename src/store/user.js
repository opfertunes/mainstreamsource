/**
 *  Vuex store for the storing authenticated user information.
 *  Stub for future use....
 */

export function defaultState() {
   return {
      authData: {},
   };
}

// eslint-disable-next-line func-style
export const getters = {
   authData: (state) => state.authData,
   isAuthenticated: (/*state*/) => {
      return true;
      //return state.authData && state.authData.customer_id;
   }   
};

export const mutations = {

   setAuthData(state, value) {
      state.authData = value;
   }
};

export const actions = {
   loadAuthUserData: ({commit}) => {
      fetch(`${process.env.VUE_APP_MAINSTREAM_API_URL}/login.php?Action=me`)
      .then(response => response.json())
      .then(data => commit("setAuthData", data))
   },
};

export default {
   namespaced: true,
   state: defaultState(),
   getters,
   mutations,
   actions,
}
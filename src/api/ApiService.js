import axios from "axios";
const http = require("http");
const https = require("https");

//The data service now provides a search capability through the URL
//https://mainstreamsource.com/cgi-bin/services/mss_data_service.pl?service=get_search_results&cond=JSON

const apiClient = axios.create({
   baseURL: process.env.VUE_APP_MAINSTREAM_API_URL,
   withCredentials: false, //default
   headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
   },
   timeout: 60000, // a bit long but...

   //keepAlive pools and reuses TCP connections, so it's faster
   httpAgent: new http.Agent({
      keepAlive: true
   }),
   httpsAgent: new https.Agent({
      keepAlive: true
   }),

   //follow up to 10 HTTP 3xx redirects
   maxRedirects: 10,

   //cap the maximum content length we'll accept to 50MBs, just in case
   maxContentLength: 50 * 1000 * 1000
});

// Sets the AUTH token for any request. Unused, but here for reference

/*
apiClient.interceptors.request.use(function(config) {
   const token = store.getters["auth/authenticated"]
      ? store.getters["auth/authUser"].token
      : null;
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   } else {
      delete config.headers.common["Authorization"];
   }
   config.headers["X-CSRFToken"] = Cookie.get("csrftoken");
   return config;
});
*/

export default {
    /**
    * loads basically the entire database... 
    * we'll use just the lookup tables like genre/keywords etc.
    */
    getSearchableItems() {
        return apiClient.get("/", {
                params: {service: 'get_searchable_items'},
                crossdomain: true}
            );
    },
   /**
    * search endpoint
    *
    * @param {Object} searchData - object of key/value search params
    *
    */
   getSearchResults(searchData) {
        
       return apiClient.get("/", {params:{service: 'get_search_results',
                                          cond: JSON.stringify(searchData || {})}});
   },
   /**
    * song details endpoint
    *
    * @param {Object} songDetails - object of key/value search params
    *
    */
   getSongDetails(songId) {
        
      return apiClient.get("/", {params:{service: 'get_song_detail',
                                         song_id: songId }});
  },

};

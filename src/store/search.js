/**
 *  Vuex store for the storing authenticated user information.
 *  Stub for future use....
 */

import Vue from "vue";

import ApiService from "@/api/ApiService";

export function defaultState() {
    return {
        //lookups:
        genres: [],
        keywords: [],
        tempoTypes: [],
        songCategories: [],
        cds: [],
        cdCategories: [],
        cdCategoryAssoc: [],
        timePeriods: [],
        artists: [],
        composers: [],
        // search data, as Vue objects...
        searchData: {},
        // search results: 
        searchResults: null,
        hasSearched: false,
        loadingSearch: false,
        searchErrorMessage: null, 
   };
}

// eslint-disable-next-line func-style
export const getters = {
    // returns structured search description
    searchDescription: (state) => {
        if (!state.searchData)
        {
            return "";
        }
        const titleKeys = {'genres': {
                               title: 'Genre',
                               titlePlural: 'Genres',
                               titleField: 'description'},
                           'keywords': {
                               title: 'Keyword',
                               titlePlural: 'Keywords',
                               titleField: 'description'},
                           'tempoTypes': {
                               title: 'Tempo Type',
                               titlePlural: 'Tempo Types',
                               titleField: 'description'},
                           'songCategories': {
                               title: 'Song Category',
                               titlePlural: 'Song Categories',
                               titleField: 'description'},
                           'cdCategories': {
                                title: 'CD Category',
                                titlePlural: 'CD Categories',
                                titleField: 'description'},    
                           'timePeriods': {
                                title: 'Time Period',
                                titlePlural: 'Time Periods',
                                titleField: 'description'},
                           'artists': {
                                title: 'Artist',
                                titlePlural: 'Artists',
                                titleField: 'name'},
                           'composers': {
                                title: 'Composer',
                                titlePlural: 'Composers',
                                titleField: 'name'},
                           'cds': {
                                title: 'CD',
                                titlePlural: 'CDs',
                                titleField: 'title'},      
                    }

        const result = [];
         
        Object.keys(state.searchData).forEach(searchKey => {

            const subSearch = state.searchData[searchKey];

            const title = titleKeys[searchKey][subSearch.length === 1 ? 'title' : 'titlePlural'];
            const searchItems = subSearch.map(item => item[titleKeys[searchKey].titleField]);

            result.push({title, searchItems} );

        });

        return result;
    },
    hasSearched: (state) => {
        return state.searchResults !== null;
    },
    leftMenuTree: (state) => {
        return state.cdCategories.map(cdCategory => {
            const cdCatAssociations = state.cdCategoryAssoc.filter(
                cdCatAssoc => cdCatAssoc.category_id === cdCategory.category_id
            )
            const cds = cdCatAssociations.map(cdca => 
                state.cds.find(cd => cd.cd_id === cdca.cd_id)
            )

            cds.sort((cd1, cd2) => {
                return cd1.title === cd2.title ? 0 :
                  cd1.title < cd2.title ? -1 : 1;
            })

            return {cdCategory, cds}
        })
    }          
};

export const mutations = {
    setSearchData(state, value) {
        state.searchData = value;
    },
    setSearchResults(state, value) {
        state.searchResults = value;
    },
    setLoadingSearch(state, value) {
        state.loadingSearch = value;
    },
    clearSearch(state) {
        // clear search results and params:

        state.searchData = {}
        state.searchResults =  null
        state.hasSearched =  false;
        state.loadingSearch = false;
        state.searchErrorMessage = null;

    },

    // set all our lookup lists in one shot from response data:
    setLookups(state, data) {

        const keys = {'genres': 'genre',
                      'keywords': 'keyword',
                      'tempoTypes': 'tempo_type',
                      'songCategories': 'song_category',
                      'cdCategories': 'cd_category',
                      'timePeriods': 'time_periods',
                      'artists': 'artist',
                      'composers': 'composer',
                      'cdCategoryAssoc': 'cd_category_assoc',
                      'cds': 'cd'}
 
        Object.keys(keys).forEach(key => {
            Vue.set(state, key, data[keys[key]]);
        });  
    },

    setSearchErrorMessage(state, value) {
        state.searchErrorMessage = value;
    }
    
};

export const actions = {
    setSearchData({commit}, data) {
        if (!data || ! Object.keys(data).length) {
            return Promise.reject("Please select a search parameter")
        }
        commit("setSearchData", data);
        // convert search data to JSON structure the endpoint expects:
        const keys = {'genres': 'genre_id',
                      'keywords': 'keyword_id',
                      'tempoTypes': 'tempo_type_id',
                      'songCategories': 'category_id',
                      'cdCategories': 'category_id',
                      'timePeriods': 'time_period_id',
                      'artists': 'artist_id',
                      'composers': 'composer_id',
                      'cds': 'cd_id',
                     }
        const dataKeys = Object.keys(data);
        const jsonParams = {}
        dataKeys.forEach(dataKey => {
            const jsonParamKey = keys[dataKey];
            const vueObjectList = data[dataKey];
            if (vueObjectList && vueObjectList.length) {
                jsonParams[jsonParamKey] = vueObjectList.map(vueObj => {
                    return vueObj[jsonParamKey];
                });
            }
        })     
  
        if (!Object.keys(jsonParams).length) {
            return Promise.reject("Please select a search parameter")
        }

        commit("setLoadingSearch", true);
        
        return ApiService.getSearchResults(jsonParams).then((response) => {
            commit("setSearchResults", response.data);
        })
        .finally(() => {
            commit("setLoadingSearch", false);
        })

    },
    loadSearchLookups({state, commit}) {
        
        if (state.genres.length) {
            return Promise.resolve();
        }
        commit("setLoadingSearch", true);

        return ApiService.getSearchableItems().then((response) => {
            commit("setLookups", response.data);
        })
        .finally(() => {
            commit("setLoadingSearch", false);
        });
    },
    async searchFromQueryParams({state, dispatch, commit}, queryParams) {
        await dispatch("loadSearchLookups");

        if (!Object.keys(queryParams).length) {
            commit("setSearchErrorMessage", "No search criteria were entered")
            return;
        }
    
        let lookupList, pkName, pk, storeKey, description;

        if (queryParams.genre) {
            pk = queryParams.genre;
            lookupList = state.genres;
            pkName = "genre_id";
            storeKey = "genres";
            description = "Genre"

        }
        else if (queryParams.cd_category) {
            pk = queryParams.cd_category;
            lookupList = state.cdCategories;
            pkName = "category_id";
            storeKey = "cdCategories";
            description = "CD Category"

        }
        else if (queryParams.cd) {
            pk = queryParams.cd;
            lookupList = state.cds;
            pkName = "cd_id";
            storeKey = "cds";
            description = "CD"
        }
        else if (queryParams.keywords) {
            pk = queryParams.keywords;
            lookupList = state.keywords;
            pkName = "keyword_id";
            storeKey = "keywords";
            description = "Keywords"
        }

        if (!pk || !lookupList || !pkName || !storeKey || !description) {
            commit("setSearchErrorMessage", "Please enter a valid search");

            return;
        }

        const pks = pk.split(",")

        const idsNotFound = []    
        const searchObjs = [];
        pks.forEach((thePk) => {
            const searchObj = lookupList.find(obj => String(obj[pkName]) === String(thePk));
            if (searchObj) {
                searchObjs.push(searchObj);
            } else {
                idsNotFound.push(thePk);
            } 
        })    
           
        if (idsNotFound.length) {
            commit("setSearchErrorMessage", `${description} not found for id(s) ${idsNotFound}`);
            return;
        }
        
        const searchData = {};
        searchData[storeKey] = searchObjs;

        console.debug(JSON.parse(JSON.stringify({
                pk,
                pks,
                lookupList,
                pkName,
                storeKey,
                description,
                searchData
            }))
        )

        await dispatch("setSearchData", searchData);

    },
    clearSearch({commit}) {
        commit("clearSearch");
    }
};

export default {
   namespaced: true,
   state: defaultState(),
   getters,
   mutations,
   actions,
}
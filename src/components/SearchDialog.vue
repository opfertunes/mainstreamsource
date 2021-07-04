 <template>
 <b-modal 
      scrollable
      size="xl"
      id="searchDialog" 
      ref="searchDialog" 
      centered
      variant="dark"
      header-class="track-detail-header"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      :ok-disabled="!selectedKeywords.length"
      @ok="doSearch"
      @show="showSearch"> 
      <template #modal-header="{cancel }">
          <h5 class="modal-title">Search the Catalog</h5>
          <button @click="cancel()" type="button" aria-label="Close" class="close text-light">×</button>
      </template>
      <b-container fluid>
      <div class="row">
        <div class="col">
          <small tabindex="-1" class="form-text text-muted mt-0 mb-2">Select keyword(s)</small>
        </div>
      </div>    
      <div class="row">
        <div class="col">

          <b-form-group
            id="fieldset-keywords"
          >
             <b-form-checkbox-group
              id="checkbox-group-keywords"
              v-model="selectedKeywords"
              :options="keywordOptions"
              :aria-describedby="keywords"
              name="keywords"
              style="column-count: 4;"
              stacked
            ></b-form-checkbox-group>
          </b-form-group>

         
        </div>

      </div>  
      </b-container>

</b-modal> 
</template>

<script>

import {mapState, mapGetters} from "vuex";


export default {
  name: "SearchDialog",
  components: {},
  props: {},
  data() {
    return {
      selectedKeywords: [],
    };
  },
  created() {
  },
  methods: {
    showSearch() {

      return true; 
    },
    doSearch(bvModalEvent) {

        bvModalEvent.preventDefault();

        this.$nextTick(() => {
          this.$refs['searchDialog'].hide();
          this.$router.push(`/tracks?keywords=${this.selectedKeywords.join(",")}`);
        });

        
    }
  },
  computed: {
    keywordOptions: function() {
      return this.keywords.map((kw) => {
          return {
            value: kw.keyword_id,
            text: kw.description,
          }
      });
    },

    ...mapState("search", [ "genres", 
                           "cdCategories",
                           "cds", 
                           "keywords",
                           "loadingSearch", "searchData", "searchErrorMessage"]),
    ...mapGetters("search", ["searchDescription", "hasSearched" ]),
    ...mapGetters("user", ["isAuthenticated" ]),
  },
  destroyed() {
   
  }
};
</script>

<style scoped>

</style>
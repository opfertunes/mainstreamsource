 <template>
 <b-modal 
      id="editProjectDialog" 
      ref="editProjectDialog" 
      centered
      variant="dark"
      header-class="track-detail-header"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      :ok-disabled="!editedProject.name || !editedProject.description"
      @ok="saveProject"
      @show="showProject"> 
      <template #modal-header="{cancel }">
          <h5 class="modal-title">{{dialogTitle}}</h5>
          <button @click="cancel()" type="button" aria-label="Close" class="close text-light">×</button>
      </template>
      <div class="row">
        <div class="col">
          <b-form-group
            id="fieldset-1"
            description="Enter project name."
            label="Name"
            label-for="input-1"
            invalid-feedback="Name required"
            :state="nameState"
          >
            <b-form-input id="input-1" v-model="editedProject.name" :state="nameState" trim></b-form-input>
          </b-form-group>
          <b-form-group
            id="fieldset-2"
            description="Enter project description."
            label="Description"
            label-for="input-2"
            invalid-feedback="Description required"
            :state="descriptionState"
          >
          <b-form-input id="input-2" v-model="editedProject.description" :state="descriptionState" trim></b-form-input>
          </b-form-group>
         
        </div>

      </div>  

</b-modal> 
</template>

<script>
import ApiService from "@/api/ApiService";
import {mapState, mapGetters} from "vuex";


export default {
  name: "ProjectDialog",
  components: {},
  props: {
    project: {type: Object, default: null},
  },
  data() {
    return {
      editedProject: {name: null, description: null},
    };
  },
  created() {
    if (this.project) {
        this.editedProject = JSON.parse(JSON.stringify(this.project));
    }
  },
  methods: {
    showProject() {
      if (this.project) {
        this.editedProject = JSON.parse(JSON.stringify(this.project));
      } else {
        this.editedProject = {name: null, description: null}
      }
      return true; 
    },
    saveProject(bvModalEvent) {

        bvModalEvent.preventDefault();

        if (process.env.VUE_APP_FAKE_PROJECT_CALLS !== "true") {  
            ApiService.createOrUpdateProject(this.editedProject)
            .then((data) => {
              this.$emit("projectSaved", data); 
              this.$nextTick(() => {
                this.$refs['editProjectDialog'].hide();
              });
            }).catch((err) => {
              this.$toastr.e(
                `Error saving project: ${err}`
              );
            })
          } else {
            this.$nextTick(() => {
              this.$refs['editProjectDialog'].hide();
            });
            this.$emit("projectSaved", this.editedProject);
          }  
    }
  },
  computed: {
    dialogTitle: function() {
        if (this.editedProject.project_id) {
            return `Edit Project ${this.editedProject.name}`;
        } else {
            return "Create new Project";
        }
    },
    nameState() {
      return this.editedProject.name && this.editedProject.name.length ? true : false;
    },
    descriptionState() {
      return this.editedProject.description && this.editedProject.description.length ? true : false;
    },
    ...mapState("search", [ "genres", 
                           "cdCategories",
                           "cds", 
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
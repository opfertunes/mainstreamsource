<template>
  <footer class="site-footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-4">
          <div class="mb-1">
            <h3 class="footer-heading mb-4">
              About Mainstream Source
            </h3>
            <p>
              Mainstream Source is dedicated to providing the finest production
              music to the worldwide film, television and advertising
              industries. With many years of experience, innovation and quality,
              and a commitment to excellence, Mainstream Source provides
              thousands of tracks composed and performed by consummate
              professionals, Grammy winners and legendary artists.
            </p>
          </div>
        </div>

        <div class="col-lg-4 mb-1 mb-lg-0">
          <div class="mb-1">
            <h3 class="footer-heading mb-4">Sign Up</h3>
            <form action="#" method="post" class="site-block-subscribe">
              <div class="input-group mb-3">
                <input
                  type="text"
                  class="form-control border-secondary text-white bg-transparent"
                  placeholder="Enter your email"
                  aria-label="Enter Email"
                  aria-describedby="button-addon2"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-primary rounded-top-right-0"
                    type="button"
                    id="button-addon2"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </form>
          </div>
          <br />
          <div class="row">
            <div class="col-md-12">
              <h3 class="footer-heading mb-4">Follow Us</h3>

              <div>
                <a href="#" class="pl-0 pr-3">
                  <span class="icon-facebook"></span>
                </a>
                <a href="#" class="pl-3 pr-3">
                  <span class="icon-twitter"></span>
                </a>
                <a href="#" class="pl-3 pr-3">
                  <span class="icon-instagram"></span>
                </a>
                <a href="#" class="pl-3 pr-3">
                  <span class="icon-linkedin"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4 mb-1 mb-lg-0">
          <div class="row mb-5">
            <div class="col-md-12">
              <h3 class="footer-heading mb-4">Navigations</h3>
            </div>
            <div class="col-md-6 col-lg-6">
              <ul class="list-unstyled">
                <li>
                  <router-link to="/">Home</router-link>
                </li>
                <li>
                  <router-link to="/">Main</router-link>
                </li>
                <li>
                  <router-link to="/">Contact Us</router-link>
                </li>
              </ul>
            </div>
            <div class="col-md-6 col-lg-6">
              <ul class="list-unstyled">
                <li>
                  <router-link to="/">License Trademark</router-link>
                </li>
                <li>
                  <router-link to="/">Search Catalogue</router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
      <div class="row pt-1 mt-1 text-center">
        <div class="col-md-12">
          <p>
            Copyright &copy; 2021 All rights reserved | Mainstream Source
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  props: {},
  data() {
    return {};
  },
};
</script>

<style scoped></style>

<!-- eslint-disable -->

<template>
  <div id="app">
    <!-- Navbar with a clean white background and dark text -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
      <div class="container d-flex justify-content-between">
        <router-link
            class="nav-header"
            to="/"
            @click="collapseAndNavigate()"
        >
          Home
        </router-link>
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link
                  class="nav-link"
                  to="/videos"
                  @click="collapseAndNavigate()"
              >
                Videos
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Route Content -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    collapseAndNavigate() {
      document.querySelector('.navbar-collapse').classList.remove('show');
    }
  }
};
</script>

<style>
body {
  padding-top: 70px;
  background-color: #f7f7f8;
  color: #2c2c2e; /* Dark gray text */
}

.navbar {
  background-color: #ffffff;
}

.nav-link {
  color: #2c2c2e;
}

.nav-link:hover {
  color: #10a37f;
}

.nav-header {
  font-weight: bold;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  margin-right: 20px;
}

</style>

<template>
  <div>
    <!-- Full-width Hero Section with a light gray background and dark text -->
    <section id="hero" class="d-flex align-items-center justify-content-center vh-100 text-dark">
      <div class="container text-center">
        <h1 class="display-1 fw-bold mb-4">Welcome to Gilli Lab</h1>
        <p class="lead mb-5">Insert lab summary</p>
        <a href="/videos" class="btn btn-green btn-lg">Explore Videos</a>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>

<style scoped>
#hero {
  height: 100vh;
  background-color: #f7f7f8; /* Light gray background */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

h1 {
  font-size: 72px;
  color: #2c2c2e; /* Dark gray text */
}

p {
  font-size: 24px;
  color: #2c2c2e; /* Dark gray text */
}

.btn-green {
  background-color: #10a37f; /* Green button */
  color: #ffffff; /* White text on button */
  border: none;
}

.btn-green:hover {
  background-color: #0d8769; /* Darker green on hover */
}
</style>

<template>
  <div class="container mt-5">
    <h2 class="text-center mb-5">Video Gallery</h2>

    <!-- Bootstrap Grid Layout for Video Cards -->
    <div class="row">
      <div class="col-lg-4 col-md-6 mb-4" v-for="video in videos" :key="video.id">
        <div class="card shadow-sm h-100">
          <video controls class="w-100">
            <source :src="video.url" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          <div class="card-body text-center">
            <h5 class="card-title">{{ video.title }}</h5>
            <a href="#" class="btn btn-green">Process Video</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoGallery',
  data() {
    return {
      videos: [
        {
          id: 1,
          title: 'Sample Video 1',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        },
        {
          id: 2,
          title: 'Sample Video 2',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        },
        {
          id: 3,
          title: 'Sample Video 3',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        },
      ],
    };
  },
};
</script>

<style scoped>
.card {
  background-color: #ffffff; /* White cards */
}

.card-body {
  background-color: #f7f7f8; /* Light gray for the card body */
}

h5 {
  color: #2c2c2e; /* Dark gray text */
}

.btn-green {
  background-color: #10a37f; /* Green button */
  color: #ffffff; /* White text */
  border: none;
}

.btn-green:hover {
  background-color: #0d8769; /* Darker green on hover */
}
</style>

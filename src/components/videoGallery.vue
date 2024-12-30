<template>
  <div class="container mt-5">
    <h2 class="gallery-header text-center">Video Gallery</h2>

    <!-- Filters Section inside a medium gray card -->
    <div class="card bg-medium text-light p-4 mb-5 shadow-lg">

      <!-- Show loading indicator when videos are being fetched -->
      <div v-if="loading" class="text-center text-secondary">
        <p>Loading videos...</p>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div class="d-flex justify-content-center align-items-center">

        <!-- Video Search Bar -->
        <div class="me-3">
          <input
              type="text"
              v-model="videoSearchQuery"
              class="form-control"
              placeholder="Search videos..."
          />
        </div>

        <div class="me-3">
          <button class="btn btn-info" @click="triggerFileInput">Upload videos</button>
          <input
              type="file"
              style="display: none"
              ref="fileInput"
              accept="video/"
              multiple
              @change = "handleFileUpload"
          />
        </div>

      </div>
    </div>

    <!-- Video Gallery Section with Background Card -->
    <div class="video-gallery">
      <div v-for="video in videos" :key="video.id" class="video-container text-center">
        <a :href="video.url" class="lightbox" data-lg-size="1280-720" data-gallery="gallery1">
          <img
              :src="video.thumbnail || 'default-thumbnail.jpg'"
              :alt="`Thumbnail for ${video.name}`"
              class="video-thumbnail"
          />
          <span class="caption">{{ video.name }}</span>
        </a>
      </div>
    </div>
    <div v-if="videos.length === 0" class="text-center text-secondary mt-4">
      <p>No videos found. Please upload files.</p>
    </div>
  </div>
</template>

<script>
import "glightbox/dist/css/glightbox.css";
import "glightbox/dist/js/glightbox.js";
import GLightbox from 'glightbox';

export default {
  name: 'VideoGallery',
  data() {
    return {
      videos: [],               // Videos to display
      selectedFolders: [],       // Array holding user-selected folders for filtering
      allFolders: [],            // List of all folder names
      filteredFolderNames: [],   // Filtered folder names based on search query
      searchQuery: '',           // Search query for filtering folders
      videoSearchQuery: '',      // Search query for filtering videos by name
      nextPageToken: null,       // Token for next page of videos
      prevPageTokens: [],        // Stack of previous page tokens for navigation
      pageSize: 8,               // Number of videos per page
      loading: false,
      fileUpload: false,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.fileUpload = true;
      this.duplicateFiles = [];
      this.nonVideoFiles = [];

      const files = Array.from(event.target.files);

      const videoFiles = files.filter(file => {
        if (!file.type.startsWith('video/')) {
          this.nonVideoFiles.push(file.name); // Track non-video files
          return false; // Exclude non-video files
        }
        return true;
      });

      videoFiles.forEach(file => {

        if (this.videos.some(video => video.name === file.name)) {
          this.duplicateFiles.push(file.name)
          return;
        }

        const video = document.createElement('video');

        video.src = URL.createObjectURL(file);

        video.currentTime = 1; // Capture the frame at the 1-second mark

        video.addEventListener('loadeddata', () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const targetWidth = 320;
          const targetHeight = 180;

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const scale = Math.min(
              targetWidth / video.videoWidth,
              targetHeight / video.videoHeight
          );
          const x = (targetWidth - video.videoWidth * scale) / 2;
          const y = (targetHeight - video.videoHeight * scale) / 2;

          ctx.drawImage(
              video,
              0,
              0,
              video.videoWidth,
              video.videoHeight,
              x,
              y,
              video.videoWidth * scale,
              video.videoHeight * scale
          );

          const thumbnail = canvas.toDataURL('image/png'); // Generate thumbnail as Base64 URL

          this.videos.push({
            name: file.name,
            url: video.src,
            thumbnail,
          });

          // Clean up resources
          video.remove();
          canvas.remove();

          this.$nextTick(() => {
            if (this.lightbox) {
              this.lightbox.reload(); // Destroy existing lightbox instance
            }
            this.lightbox = GLightbox({
              selector: ".lightbox",
              touchNavigation: true,
              loop: true,
              videos: {
                controls: true,
                autoplay: true,
              },
            });
          });
        });
      });

      if (this.duplicateFiles.length > 0 || this.nonVideoFiles.length > 0) {
        let alertMessage = "Some files were not uploaded:\n";

        if (this.duplicateFiles.length > 0) {
          alertMessage += `\nDuplicate files: ${this.duplicateFiles.join(', ')}`;
        }

        if (this.nonVideoFiles.length > 0) {
          alertMessage += `\nNon-video files: ${this.nonVideoFiles.join(', ')}`;
        }

        alert(alertMessage);
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },
  },
  mounted() {
    this.lightbox = GLightbox({
      selector: ".lightbox",
      touchNavigation: true,
      loop: true,
      videos: {
        controls: true,
        autoplay: false,
      },
    });
  },
};
</script>

<style scoped>
body {
  background-color: #202123; /* Dark gray background */
}

.gallery-header {
  color: #404040; /* Light gray text */
  margin-bottom: 20px;
  text-align: center;
}

button {
  background-color: #10a37f; /* ChatGPT green */
  color: #fff; /* White text */
  border: none;
}

.card {
  border-radius: 12px;
  background-color: #f8f9fa; /* Lighter background for video gallery */
}

.card p {
  font-size: 1.1rem;
}

.card {
  border-color: #fff;
  color: #fff;
}

.card :hover {
  background-color: #fff;
  color: #6c757d;
}
.video-gallery {
  display: grid; /* Use CSS Grid for consistent layout */
  grid-template-columns: repeat(4, 1fr); /* Create 4 columns of equal width */
  gap: 20px; /* Add spacing between video containers */
  justify-content: center; /* Center the grid */
}

.video-container {
  width: 320px; /* Set a consistent width for video thumbnails */
  height: auto;
  margin-bottom: 20px; /* Add spacing below each container */
  text-align: center; /* Center-align captions and content */
}

.video-thumbnail {
  width: 100%; /* Make thumbnails fill the container width */
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* Add shadow for depth */
}

.caption {
  position: relative;
  width: 100%;
  color: black;
  font-size: 16px;
  font-weight: bold;
  padding: 3px;
  box-sizing: border-box;
  border-radius: 4px; /* Optional: Rounded corners for the caption */
}

</style>

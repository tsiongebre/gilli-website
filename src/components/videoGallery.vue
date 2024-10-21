<template>
  <div class="container mt-5">
    <h2>Video Gallery</h2>
    <div v-if="videos.length > 0" class="row">
      <!-- Loop through the videos and display them in a grid (gallery) -->
      <div v-for="video in videos" :key="video.id" class="col-lg-4 col-md-6 mb-4">
        <div class="card">
          <!-- Embed video using Google Drive's preview link in iframe -->
          <iframe :src="`https://drive.google.com/file/d/${video.id}/preview`" width="100%" height="240" allow="autoplay"></iframe>
          <div class="card-body">
            <p class="card-text">{{ video.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No videos found in the folder.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoGallery',
  data() {
    return {
      videos: [],
      testFolderID: '1_RfChKHDGXhayShOvxtKOeYpDgt-EZ5x',
      apiKey: 'AIzaSyA-hzNH7cDMbsBG_97fhO3JpCK1UFfkKfs',
      targetDate: '2024-10-20',
    };
  },
  methods: {
    async listSubfolders() {
      const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${this.testFolderID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${this.apiKey}&fields=files(id,name)`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.files;
      } catch (error) {
        console.error('Error fetching subfolders:', error);
      }
    },
    async findClosestSubfolder(targetDate) {
      const folders = await this.listSubfolders();
      const target = new Date(targetDate);
      let closestFolder = null;
      let smallestDifference = Infinity;

      folders.forEach((folder) => {
        const folderDate = new Date(folder.name);
        const difference = Math.abs(folderDate - target);

        if (difference < smallestDifference) {
          smallestDifference = difference;
          closestFolder = folder;
        }
      });

      return closestFolder;
    },
    async listVideosInFolder(folderId) {
      const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'video/'&key=${this.apiKey}&fields=files(id,name)`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.files;
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    },
    async loadVideosFromClosestFolder() {
      const closestFolder = await this.findClosestSubfolder(this.targetDate);
      if (closestFolder) {
        this.videos = await this.listVideosInFolder(closestFolder.id);
      } else {
        console.log('No folder found with a close date.');
      }
    },
  },
  mounted() {
    this.loadVideosFromClosestFolder();
  },
};
</script>

<style scoped>
.card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-body {
  background-color: #f7f7f8;
}

.card-text {
  color: #2c2c2e;
  font-weight: 500;
  text-align: center;
}

h2 {
  color: #2c2c2e;
  margin-bottom: 20px;
}

.container {
  max-width: 1200px;
}

.col-lg-4, .col-md-6 {
  padding: 10px;
}
</style>

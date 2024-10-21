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
              @input="filterVideosByName"
          />
        </div>

      </div>
    </div>

    <!-- Video Gallery Section with Background Card -->
    <div class="card p-4 bg-light shadow-lg">
      <div v-if="videos.length > 0" class="row">
        <div v-for="video in videos" :key="video.id" class="col-lg-3 col-md-4 mb-3">
          <div class="card video-card" style="padding: 0.3rem; width: 100%;">
            <iframe
                :src="`https://drive.google.com/file/d/${video.id}/preview`"
                style="width: auto; height: auto; border-radius: 10px;"
                allow="autoplay"
                loading="lazy"
            ></iframe>
            <div class="card-body">
              <p class="card-text">{{ video.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="videos.length === 0">
        <p style="color: #404040;">No videos found in the folder. Please select a folder.</p>
      </div>
    </div>
  </div>
</template>

<script>
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
      testFolderID: '1Rbf5g2hpxd-nN3cBF-L1BYqkemAgMC-b',
      apiKey: 'AIzaSyA-hzNH7cDMbsBG_97fhO3JpCK1UFfkKfs',
      nextPageToken: null,       // Token for next page of videos
      prevPageTokens: [],        // Stack of previous page tokens for navigation
      pageSize: 8,               // Number of videos per page
      loading: false,
    };
  },
  methods: {
    // Fetch all subfolders and automatically load videos from the latest folder
    async listSubfolders() {
      this.loading = true;
      const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${this.testFolderID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${this.apiKey}&fields=files(id,name,createdTime)`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Sort folders by creation time in descending order
        this.allFolders = data.files.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

        // Automatically load videos from the latest folder
        if (this.allFolders.length > 0) {
          // Map each folder to a promise that fetches the videos
          const folderPromises = this.allFolders.map(folder => {
            const folderId = folder.id;
            return this.listVideosInFolder(folderId);  // Return the promise for each folder
          });

          // Wait for all folder promises to resolve in parallel
          await Promise.all(folderPromises);
        }
      } catch (error) {
        console.error('Error fetching subfolders:', error);
      }
      finally {
        this.loading = false;  // Stop loading
      }
    },

    // Fetch 8 videos at a time from a folder and handle pagination with nextPageToken
    async listVideosInFolder(folderId) {
      // Correctly encode the query for fetching FASTEC-IL5 subfolders
      const fastecFolderQuery = `'${folderId}' in parents and name contains 'FASTEC-IL5'`;
      const apiUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(fastecFolderQuery)}&key=${this.apiKey}&fields=files(id,name)`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if the response contains files
        if (data.files && data.files.length > 0) {
          let allFetchedVideos = [];
          // Fetch videos from the folders
          for (let folder of data.files) {
            const fastecFolderId = folder.id;
            const videosApiUrl = `https://www.googleapis.com/drive/v3/files?q='${fastecFolderId}'+in+parents+and+mimeType contains 'video/'&key=${this.apiKey}&fields=files(id,name)`;
            const videoResponse = await fetch(videosApiUrl);
            const videoData = await videoResponse.json();
            allFetchedVideos.push(...videoData.files); // Collect videos
            this.nextPageToken = videoData.nextPageToken || null; // Store the nextPageToken
          }
          this.videos = allFetchedVideos; // Update the videos to display
        } else {
          console.error('No files found or invalid data:', data);
          this.videos = [];
        }
      } catch (error) {
        console.error('Error fetching videos from FASTEC-IL5 folders:', error);
      }
    },

    // Fetch videos from all selected folders
    async selectAll() {
      this.selectedFolders = this.filteredFolderNames.map(folder => folder.name);
      if (this.selectedFolders.length > 0) {
        let allFetchedVideos = [];
        for (let folderName of this.selectedFolders) {
          const folder = this.allFolders.find(f => f.name === folderName);
          if (folder) {
            await this.listVideosInFolder(folder.id); // Fetch videos for each folder
            allFetchedVideos.push(...this.videos);
          }
        }
        this.videos = allFetchedVideos; // Set the videos from all selected folders
      }
    },

    // Clear all selected folders and reset the video list
    clearAll() {
      this.selectedFolders = [];
      this.videos = [];
    },

    // Pagination: Fetch the next page of videos
    async nextPage() {
      if (this.nextPageToken) {
        await this.listVideosInFolder(this.selectedDateFolder, this.nextPageToken); // Fetch the next page
      }
    },

    // Pagination: Fetch the previous page of videos (not supported in Google API directly)
    prevPage() {
      console.warn('Previous page is not supported with Google Drive API pagination');
    },

    // Filter the video list based on search query
    filterVideosByName() {
      this.videos = this.videos.filter(video =>
          video.name.toLowerCase().includes(this.videoSearchQuery.toLowerCase())
      );
    },

    // Filter folder list based on search query
    filterFolders() {
      if (this.searchQuery) {
        this.filteredFolderNames = this.allFolders.filter(folder =>
            folder.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    },
  },
  mounted() {
    this.listSubfolders(); // Load subfolders (date folders) when the component is mounted
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

.video-card {
  background-color: #303030; /* Slightly lighter gray for video cards */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-body {
  background-color: #404040; /* Darker gray for card body */
}

.card-text {
  color: #e0e0e0; /* Light gray for video names */
  font-weight: 500;
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

.badge {
  padding: 0.6em 1em;
  display: flex;
  align-items: center;
}

.border {
  background-color: #404040; /* Slightly darker background for distinction */
}

.video-card {
  background-color: #303030; /* Slightly lighter gray for video cards */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-body {
  background-color: #404040; /* Darker gray for card body */
}

.card-text {
  color: #e0e0e0; /* Light gray for video names */
  font-weight: 500;
  text-align: center;
}
</style>

# Gilli Lab Data processing website

## Project Overview

**This project is a **Vue.js-based app** designed to allow the Gilli Lab at Stanford University to easily access videos of cell experiments stored in Google Drive, organized by date folders. The gallery supports lazy loading of videos, where only video metadata is fetched initially, and the video content is loaded as users scroll. This ensures efficient performance, especially when dealing with a large number of videos. Additionally, the user is shown a loading indicator when video data is being fetched. The application provides a streamlined way for lab researchers to efficiently browse, search, and filter videos of their experiments without performance slowdowns.**

### Features
- **Folder-based video organization**: The gallery organizes videos based on date folders.
- **Lazy loading**: Only the video metadata is loaded initially, and video content is loaded when scrolled into view, improving performance.
- **Dynamic folder selection**: Users can filter videos by searching key words.
- **Loading indicator**: A spinner is displayed while videos are being fetched, ensuring clear feedback during loading.
- **Responsive design**: The gallery is fully responsive, adapting to different screen sizes.

### Tech Stack
- **Vue.js**: The core framework for building the dynamic frontend.
- **Bootstrap**: For responsive design and UI components.
- **Google Drive API**: For fetching video metadata and content from Google Drive.

## Setup and Installation

### Prerequisites
- **Node.js** and **npm** installed on your local machine.
- A **Google API Key** with access to Google Drive API.

### Installation Steps

1. Clone the repositorys:
   
  ```bash
   git clone https://github.com/tsiongebree/gilli-website.git
  ```

2. Install dependencies:
   
  ```bash
   npm install
  ```
3. Launch local server
   
  ```bash
   npm run serve
  ```

### Contact
If you have any questions or would like to discuss this project further, please feel free to reach out:

Name: Tsion Gebre
Email: gtsion17@stanford.edu


## Useful Commands
### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```



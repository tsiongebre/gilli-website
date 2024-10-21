/* eslint-disable */

import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/homePage.vue';
import VideoGallery from '../components/videoGallery.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
    },
    {
        path: '/videos',
        name: 'VideoGallery',
        component: VideoGallery,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;

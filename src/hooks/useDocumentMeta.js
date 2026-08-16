import { useEffect, useRef } from 'react';
import { useScene } from '../context/SceneContext';

/**
 * useDocumentMeta — Dynamic Meta Tags & Virtual Routing (History API)
 * 
 * Updates the browser URL, page title, and meta description
 * whenever the user enters/exits a 3D room. Also handles the
 * browser back/forward buttons for seamless navigation.
 */

const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

const ROOM_META = {
    null: {
        path: '/',
        title: '宜昌旅游 3D | 数字博物馆',
        description: '沉浸式 3D 漫游宜昌：三峡大坝、宜昌博物馆、巴楚文物数字展厅、全景三峡与复古电脑博物馆。',
    },
    about: {
        path: '/about',
        title: 'About Me — ITom Portfolio',
        description: 'Learn about Tomasz "ITom" Szmajda — a creative frontend developer specializing in 3D web experiences, React, Three.js, and GSAP animations.',
    },
    gallery: {
        path: '/gallery',
        title: 'Gallery & Projects — ITom Portfolio',
        description: 'Browse the interactive 3D gallery of web development projects by ITom. Each project is displayed as a hand-drawn card you can flip and explore.',
    },
    studio: {
        path: '/studio',
        title: 'The Studio — ITom Portfolio',
        description: 'Explore ITom\'s content studio — YouTube videos, blog posts, and TikToks displayed on floating monitors in an immersive 3D space.',
    },
    contact: {
        path: '/contact',
        title: 'Contact — ITom Portfolio',
        description: 'Get in touch with Tomasz "ITom" Szmajda. Find social media links and contact information in this interactive 3D contact room.',
    },
    panorama: {
        path: '/panorama',
        title: '全景三峡 — 宜昌旅游3D',
        description: '360° 全景环视三峡大坝，拖拽环视 · 滚轮缩放，云上三峡高峡出平湖。',
    },
    collection: {
        path: '/collection',
        title: '文物展厅 — 宜昌旅游3D',
        description: '巴楚文物数字典藏展厅：青铜鼎、玉璧、青花瓷、编钟与漆器。',
    },
    computer: {
        path: '/computer',
        title: '电脑博物馆 — 宜昌旅游3D',
        description: '复古电脑博物馆：苹果 II、长城 PC、红白机、掌机与大型计算机。',
    },
};

// Map URL paths back to room IDs for deep linking
const PATH_TO_ROOM = {
    '/': null,
    '/about': 'about',
    '/gallery': 'gallery',
    '/studio': 'studio',
    '/contact': 'contact',
    '/map': 'map',
    '/panorama': 'panorama',
    '/collection': 'collection',
    '/computer': 'computer',
};

/**
 * Returns the room ID that the initial URL points to (for deep linking).
 * Call this once at app startup to determine if we need to auto-teleport.
 */
export function getInitialRoomFromUrl() {
    const path = window.location.pathname;
    const clean = (BASE && path.startsWith(BASE) ? path.slice(BASE.length) : path).replace(/\/+$/, '') || '/';
    return PATH_TO_ROOM[clean] !== undefined ? PATH_TO_ROOM[clean] : null;
}

export function useDocumentMeta() {
    const { currentRoom, teleportTo, hasEntered } = useScene();
    const isHandlingPopState = useRef(false);
    const lastPushedRoom = useRef(undefined); // Track what we last pushed to avoid duplicates

    // Update document meta and URL when room changes
    useEffect(() => {
        const roomKey = currentRoom === null ? 'null' : currentRoom;
        const meta = ROOM_META[roomKey] || ROOM_META['null'];

        // Update the page title
        document.title = meta.title;

        // Update meta description
        const descTag = document.querySelector('meta[name="description"]');
        if (descTag) {
            descTag.setAttribute('content', meta.description);
        }

        // Update OG meta tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', meta.title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', meta.description);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', `${window.location.origin}${BASE}${meta.path}`);

        // Update canonical link to ensure virtual routes are correctly indexable as separate pages
        const canonicalTag = document.querySelector('link[rel="canonical"]');
        if (canonicalTag) {
            canonicalTag.setAttribute('href', `${window.location.origin}${BASE}${meta.path}`);
        }

        // Push to browser history (only if not handling a popstate event and room actually changed)
        if (!isHandlingPopState.current && lastPushedRoom.current !== currentRoom) {
            // Use replaceState for the very first load, pushState for subsequent navigations
            if (lastPushedRoom.current === undefined) {
                window.history.replaceState({ room: currentRoom }, '', `${BASE}${meta.path}`);
            } else {
                window.history.pushState({ room: currentRoom }, '', `${BASE}${meta.path}`);
            }
            lastPushedRoom.current = currentRoom;
        }

        isHandlingPopState.current = false;
    }, [currentRoom]);

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = (event) => {
            isHandlingPopState.current = true;
            const targetRoom = event.state?.room ?? null;
            lastPushedRoom.current = targetRoom;

            if (targetRoom === null) {
                // Going back to corridor — we don't teleport, just need to trigger exit
                // The SceneContext requestExit will handle the animation
                // For now, we update meta immediately
                const meta = ROOM_META['null'];
                document.title = meta.title;
            } else if (hasEntered) {
                // Teleport to the target room
                teleportTo(targetRoom);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [teleportTo, hasEntered]);
}

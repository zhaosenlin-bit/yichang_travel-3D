/**
 * Studio Content Data
 * 
 * This file contains all content items for the Studio monitor tower.
 * Each item will be displayed on a monitor in the tower.
 * 
 * Platforms: 'youtube', 'blog', 'tiktok'
 */

export const PLATFORM_CONFIG = {
    warring: {
        color: '#B33A3A',
        accentColor: '#7a2222',
        icon: '战',
        label: '战国',
        shape: 'tv',
    },
    bachu: {
        color: '#C97A2F',
        accentColor: '#8a4a14',
        icon: '巴',
        label: '巴楚',
        shape: 'monitor',
    },
    tang: {
        color: '#7E5BB8',
        accentColor: '#54377a',
        icon: '唐',
        label: '唐宋',
        shape: 'phone',
    },
    ming: {
        color: '#3D7E5C',
        accentColor: '#1f5037',
        icon: '明',
        label: '元明',
        shape: 'monitor',
    },
    porcelain: {
        color: '#5499C7',
        accentColor: '#2b6190',
        icon: '瓷',
        label: '清瓷',
        shape: 'monitor',
    },
    folklore: {
        color: '#C2185B',
        accentColor: '#7a0f3a',
        icon: '俗',
        label: '民国',
        shape: 'phone',
    },
    modern: {
        color: '#1A6FA8',
        accentColor: '#0e3f63',
        icon: '今',
        label: '当代',
        shape: 'monitor',
    },
};

// Sample content data - replace with real content later
const RAW_CONTENT_DATA = [
    // ============ YouTube Videos ============
    {
        id: 'yt-001',
        platform: 'warring',
        title: '战国·虎座鸟架鼓',
        description: 'It\'s late 2025, we\'re flying to space, and Young Multi... still didn\'t have his own website. So I took matters into my own hands.',
        frontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp',
        thumbnail: null,
        url: 'https://www.youtube.com/watch?v=AOz4fB7NV_I&t=21s',
        date: '2026-01-10',
        views: '1.2K',
        duration: '15:32',
    },
    {
        id: 'yt-002',
        platform: 'warring',
        title: '巴楚·虎钮錞于',
        description: '📸 Watch how I turned a basic selfie into a professional photoshoot using a free AI tool from Google! In this step-by-step tutorial, I reveal my secret trick for crafting perfect prompts, even if you\'re a total beginner.',
        frontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp',
        thumbnail: null,
        url: 'https://www.youtube.com/watch?v=WQTOD7uXHNY&t=10s',
        date: '2025-10-11',
        views: '121',
        duration: '7:45',
    },
    {
        id: 'yt-003',
        platform: 'warring',
        title: '远古·长阳人化石',
        description: 'Everything you need to know to get started with 3D in React.',
        thumbnail: null,
        url: 'https://www.youtube.com/@itompoland',
        date: '2025-12-28',
        views: '2.4K',
        duration: '22:10',
    },
    {
        id: 'yt-004',
        platform: 'warring',
        title: '峡江·船工号子',
        description: 'Introduction to GLSL shaders in WebGL and Three.js.',
        thumbnail: null,
        url: 'https://www.youtube.com/@itompoland',
        date: '2025-12-15',
        views: '1.8K',
        duration: '18:33',
    },
    {
        id: 'yt-005',
        platform: 'warring',
        title: '唐宋·峡江玉璧',
        description: 'How to animate 3D objects with GSAP ScrollTrigger.',
        thumbnail: null,
        url: 'https://www.youtube.com/@itompoland',
        date: '2025-12-01',
        views: '3.1K',
        duration: '20:15',
    },
    {
        id: 'yt-006',
        platform: 'warring',
        title: '屈子·离骚',
        description: 'Raycasting, hover effects, and click interactions in Three.js.',
        thumbnail: null,
        url: 'https://www.youtube.com/@itompoland',
        date: '2025-11-20',
        views: '2.8K',
        duration: '25:00',
    },
    {
        id: 'yt-007',
        platform: 'warring',
        title: '巴楚·岩棺',
        description: 'Optimizing draw calls, geometry instancing, and more.',
        thumbnail: null,
        url: 'https://www.youtube.com/@itompoland',
        date: '2025-11-10',
        views: '1.5K',
        duration: '30:22',
    },
    {
        id: 'yt-008',
        platform: 'warring',
        title: '明代·土家织锦',
        description: 'Creating textures with noise and math functions.',
        thumbnail: null,
        url: 'https://www.youtube.com/@itompoland',
        date: '2025-10-28',
        views: '1.9K',
        duration: '18:45',
    },

    // ============ Blog Posts ============
    {
        id: 'blog-001',
        platform: 'bachu',
        title: 'Double Site of the Day confirmed! 🏆🏆',
        description: 'You\'ve probably noticed I\'ve been sharing a bunch of SOTD certificates on my stories lately. Yes, it\'s true—the YOUNG MULTI project officially scored a "double" and got recognized on the international stage...',
        frontTexture: '/textures/studio/monitorfront_postnafbdoublewinner.webp',
        paintedFrontTexture: '/textures/studio/monitorfront_postnafbdoublewinner_painted.webp',
        thumbnail: null,
        url: 'https://www.facebook.com/tomasz.szmajda.58/posts/pfbid0TmvbFrc9ASYBQHpv3fcz5gM9WZrgrLMzZFbbtSFySmzQNickLRNh6ubu388D7hHXl?rdid=nWrKXJXR8EqibqvZ',
        date: '2026-01-08',
        readTime: '5 min',
    },
    {
        id: 'blog-002',
        platform: 'bachu',
        title: 'The Hand-Drawn Aesthetic',
        description: 'How I achieved a sketch-like visual style using shaders.',
        thumbnail: null,
        url: 'https://www.facebook.com/tomasz.szmajda.58',
        date: '2025-12-20',
        readTime: '8 min',
    },
    {
        id: 'blog-003',
        platform: 'bachu',
        title: 'Optimizing 3D for the Web',
        description: 'Performance tips for smooth 60fps 3D experiences.',
        thumbnail: null,
        url: 'https://www.facebook.com/tomasz.szmajda.58',
        date: '2025-12-10',
        readTime: '6 min',
    },
    {
        id: 'blog-004',
        platform: 'bachu',
        title: 'Creative Coding Journey',
        description: 'My path from traditional dev to creative development.',
        thumbnail: null,
        url: 'https://www.facebook.com/tomasz.szmajda.58',
        date: '2025-11-25',
        readTime: '10 min',
    },
    {
        id: 'blog-005',
        platform: 'bachu',
        title: 'The Future of Web Experiences',
        description: 'Where I think interactive web is heading.',
        thumbnail: null,
        url: 'https://www.facebook.com/tomasz.szmajda.58',
        date: '2025-11-15',
        readTime: '7 min',
    },
    {
        id: 'blog-006',
        platform: 'bachu',
        title: 'Design Systems for 3D',
        description: 'Creating consistent 3D component libraries.',
        thumbnail: null,
        url: 'https://www.facebook.com/tomasz.szmajda.58',
        date: '2025-11-01',
        readTime: '12 min',
    },
    {
        id: 'blog-007',
        platform: 'bachu',
        title: 'Accessibility in 3D Web',
        description: 'Making immersive experiences accessible to everyone.',
        thumbnail: null,
        url: 'https://www.facebook.com/tomasz.szmajda.58',
        date: '2025-10-20',
        readTime: '9 min',
    },
    {
        id: 'blog-008',
        platform: 'bachu',
        title: 'Audio in Web Experiences',
        description: 'Adding spatial audio to enhance immersion.',
        thumbnail: null,
        url: 'https://www.facebook.com/tomasz.szmajda.58',
        date: '2025-10-10',
        readTime: '6 min',
    },

    // ============ TikToks ============
    {
        id: 'tt-001',
        platform: 'tang',
        title: 'Zaobserwuj mnie na TikToku! ✨',
        description: 'Dzielę się tam wskazówkami z designu, kodowania i nie tylko.',
        frontTexture: '/textures/studio/phonefront_followmeontiktok.webp',
        paintedFrontTexture: '/textures/studio/phonefront_followmeontiktok_painted.webp',
        thumbnail: null,
        url: 'https://www.tiktok.com/@itompoland',
        date: '2026-01-09',
        views: '15.2K',
        likes: '1.2K',
    },
    {
        id: 'tt-002',
        platform: 'tang',
        title: 'Coding a door animation 🚪',
        description: 'POV: You open a door in Three.js',
        thumbnail: null,
        url: 'https://www.tiktok.com/@itompoland',
        date: '2026-01-03',
        views: '8.5K',
        likes: '756',
    },
    {
        id: 'tt-003',
        platform: 'tang',
        title: 'When the shader finally works 🎉',
        description: 'The satisfaction of debugging shaders',
        thumbnail: null,
        url: 'https://www.tiktok.com/@itompoland',
        date: '2025-12-25',
        views: '22.1K',
        likes: '3.4K',
    },
    {
        id: 'tt-004',
        platform: 'tang',
        title: 'Day in the life: WebGL Dev',
        description: 'What I do as a creative developer',
        thumbnail: null,
        url: 'https://www.tiktok.com/@itompoland',
        date: '2025-12-18',
        views: '12.3K',
        likes: '1.1K',
    },
    {
        id: 'tt-005',
        platform: 'tang',
        title: 'React vs Three.js POV 😅',
        description: 'The struggle is real',
        thumbnail: null,
        url: 'https://www.tiktok.com/@itompoland',
        date: '2025-12-12',
        views: '45.2K',
        likes: '5.8K',
    },
    {
        id: 'tt-006',
        platform: 'tang',
        title: 'Making a 3D button 🔘',
        description: '30 seconds of pure satisfaction',
        thumbnail: null,
        url: 'https://www.tiktok.com/@itompoland',
        date: '2025-12-05',
        views: '18.7K',
        likes: '2.1K',
    },
    {
        id: 'tt-007',
        platform: 'tang',
        title: 'This shader took 3 hours 💀',
        description: 'Was it worth it? Absolutely.',
        thumbnail: null,
        url: 'https://www.tiktok.com/@itompoland',
        date: '2025-11-28',
        views: '33.4K',
        likes: '4.2K',
    },
    {
        id: 'tt-008',
        platform: 'tang',
        title: 'Hover effects compilation ✨',
        description: 'My favorite micro-interactions',
        thumbnail: null,
        url: 'https://www.tiktok.com/@itompoland',
        date: '2025-11-20',
        views: '28.9K',
        likes: '3.6K',
    },
    {
        id: 'tt-009',
        platform: 'tang',
        title: 'Loading screen ideas 🔄',
        description: 'Creative preloader concepts',
        thumbnail: null,
        url: 'https://www.tiktok.com/@itompoland',
        date: '2025-11-15',
        views: '19.3K',
        likes: '2.4K',
    },
    {
        id: 'tt-010',
        platform: 'tang',
        title: 'Cursor goes brrr 🖱️',
        description: 'Custom cursor madness',
        thumbnail: null,
        url: 'https://www.tiktok.com/@itompoland',
        date: '2025-11-08',
        views: '41.2K',
        likes: '5.1K',
    },
    {
        id: 'tt-011',
        platform: 'tang',
        title: 'Parallax scrolling magic 🪄',
        description: 'Simple but effective',
        thumbnail: null,
        url: 'https://www.tiktok.com/@itompoland',
        date: '2025-11-01',
        views: '25.6K',
        likes: '3.0K',
    },
    {
        id: 'tt-012',
        platform: 'tang',
        title: 'Text animation inspo 📝',
        description: 'Typography that moves',
        thumbnail: null,
        url: 'https://www.tiktok.com/@itompoland',
        date: '2025-10-25',
        views: '31.8K',
        likes: '4.0K',
    },
];

const ytTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego.webp', '/textures/studio/tvfront_filmikedytowaniezdjec.webp'];
const ytPaintedTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp', '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp'];
const blogTextures = ['/textures/studio/monitorfront_postnafbdoublewinner.webp'];
const blogPaintedTextures = ['/textures/studio/monitorfront_postnafbdoublewinner_painted.webp'];
const ttTextures = ['/textures/studio/phonefront_followmeontiktok.webp'];
const ttPaintedTextures = ['/textures/studio/phonefront_followmeontiktok_painted.webp'];

let ytIdx = 0, blogIdx = 0, ttIdx = 0;
let ytPIdx = 0, blogPIdx = 0, ttPIdx = 0;

export const CONTENT_DATA = RAW_CONTENT_DATA.map((item) => {
    return {
        ...item,
        frontTexture: item.frontTexture || (
            item.platform === 'youtube' ? ytTextures[ytIdx++ % ytTextures.length] :
                item.platform === 'blog' ? blogTextures[blogIdx++ % blogTextures.length] :
                    ttTextures[ttIdx++ % ttTextures.length]
        ),
        paintedFrontTexture: item.paintedFrontTexture || (
            item.platform === 'youtube' ? ytPaintedTextures[ytPIdx++ % ytPaintedTextures.length] :
                item.platform === 'blog' ? blogPaintedTextures[blogPIdx++ % blogPaintedTextures.length] :
                    ttPaintedTextures[ttPIdx++ % ttPaintedTextures.length]
        )
    };
});

// Helper to get content by platform
export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

// Get latest content (for "On Air" indicator)
export const getLatestContent = () => {
    return [...CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
};

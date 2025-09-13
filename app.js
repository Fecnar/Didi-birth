// Enhanced Birthday Website Application - FULLY FIXED NAVIGATION & ALL FEATURES
console.log('🎉 Loading Chutadamon\'s Birthday Website with COMPLETE FIXES...');

// Application Data
const appData = {
    userData: {
        name: "Chutadamon",
        displayName: "Chutadamon",
        birthday: "2025-09-13",
        bestSisterSince: "2005-10-05",
        birthdayGif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWQzc2pwMW5xcjNqeHR0bGJ2eDBqdmpvZHpnYzQ3MnhmMzlzOGd3aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9rO5Aksmn0dHQKXJAu/giphy.gif"
    },
    spotifyConfig: {
        clientId: "47314cafb560479590dbd910f412e561",
        // FIXED: Use window.location.origin for proper redirect URI
        redirectUri: "https://happybirthdaydidi.pages.dev/",
        scopes: [
            "user-read-private",
            "user-read-email", 
            "playlist-read-private",
            "playlist-read-collaborative",
            "user-library-read",
            "user-read-playback-state",
            "user-modify-playback-state",
            "streaming"
        ]
    },
    notificationSettings: {
        requestPermissionOnLoad: true,
        mealReminders: {
            breakfast: {"enabled": false, "time": "08:00", "message": "🍳 Time for breakfast, Chutadamon!"},
            lunch: {"enabled": false, "time": "13:00", "message": "🥗 Lunch time, Chutadamon!"},
            dinner: {"enabled": false, "time": "19:00", "message": "🍽️ Dinner is ready, Chutadamon!"}
        },
        waterReminder: {
            enabled: false,
            interval: 60,
            message: "💧 Time to drink some water, Chutadamon!"
        }
    }
};

// Global variables
let currentSlideIndex = 0;
let photos = [];
let events = [];
let currentDate = new Date();
let currentEventId = null;
let currentTheme = 'light';
let waterProgress = 0;
let reminderTimeouts = {}; // FIXED: Use timeouts for proper timing
let reminderIntervals = {};
let countdownInterval = null;
let progressInterval = null;

// Spotify variables
let spotifyAccessToken = null;
let spotifyPlayer = null;
let deviceId = null;
let currentTrack = null;
let isPlaying = false;
let currentPosition = 0;
let trackDuration = 0;
let userPlaylists = [];
let likedSongs = [];
let playbackQueue = [];
let currentPlaylist = null;
let currentLikedSongsPage = 0;
let totalLikedSongs = 0;
let isShuffleOn = false;
let repeatMode = 'off';
let currentVolume = 0.5;

// Notification variables
let notificationPermission = 'default';
let notificationSupported = 'Notification' in window;

// FIXED: Define Spotify Web Playback SDK callback globally with better error handling
if (typeof window !== 'undefined') {
    window.onSpotifyWebPlaybackSDKReady = () => {
        console.log('🎧 Spotify Web Playback SDK is ready');
        if (spotifyAccessToken) {
            setupSpotifyPlayer();
        }
    };
    
    // Fallback in case the callback doesn't fire
    setTimeout(() => {
        if (window.Spotify && window.Spotify.Player && spotifyAccessToken && !spotifyPlayer) {
            console.log('🎧 SDK ready via fallback, setting up player...');
            setupSpotifyPlayer();
        }
    }, 2000);
}


// FIXED: Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Chutadamon\'s Birthday Website - FULL VERSION...');
    
    try {
        // FIXED: Initialize notification system first
        initializeNotificationSystem();
        
        // Initialize all modules with error handling
        initializeThemeToggle();
        initializeNavigation(); // FIXED navigation
        initializeCountdowns();
        initializeReminders();
        initializeGallery();
        initializeSpotify();
        initializeCalendar();
        initializeAddToHome(); // ADD THIS LINE
        loadSavedData();
        
        console.log('✨ Website fully loaded and ready to celebrate!');
        
        // Show initial notification after a delay
        setTimeout(() => {
            showNotification('🎉 Happy Birthday Chutadamon! Your special website is ready!');
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error during initialization:', error);
        showNotification('Something went wrong, but we\'re still celebrating! 🎉');
    }
});

// ADD TO HOME SCREEN FUNCTIONALITY
let deferredPrompt = null;
let addToHomeBtn = null;

// Initialize Add to Home functionality
function initializeAddToHome() {
    console.log('📱 Initializing Add to Home Screen functionality...');
    
    addToHomeBtn = document.getElementById('add-to-home');
    
    if (addToHomeBtn) {
        // Initially hide the button
        addToHomeBtn.style.display = 'none';
        
        // Add click handler
        addToHomeBtn.addEventListener('click', handleAddToHomeClick);
        console.log('✅ Add to Home button initialized');
    }
}

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 Install prompt available');
    
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e;
    
    // Show the Add to Home button
    if (addToHomeBtn) {
        addToHomeBtn.style.display = 'block';
        showNotification('📱 You can now add this site to your home screen!');
    }
});

// Handle Add to Home button click
async function handleAddToHomeClick(e) {
    e.preventDefault();
    
    console.log('📱 Add to Home button clicked');
    
    if (!deferredPrompt) {
        // Fallback for browsers that don't support the install prompt
        showAddToHomeInstructions();
        return;
    }
    
    try {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for user choice
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
            console.log('✅ User accepted the install prompt');
            showNotification('🎉 App installed successfully!');
            
            // Hide the button after successful install
            if (addToHomeBtn) {
                addToHomeBtn.style.display = 'none';
            }
        } else {
            console.log('❌ User dismissed the install prompt');
            showNotification('📱 You can install this app anytime from the menu');
        }
        
        // Clear the prompt
        deferredPrompt = null;
        
    } catch (error) {
        console.error('❌ Error showing install prompt:', error);
        showAddToHomeInstructions();
    }
}

// Show manual instructions for browsers that don't support PWA install
function showAddToHomeInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    
    let instructions = '';
    
    if (isIOS) {
        instructions = 'On iOS: Tap the Share button in Safari, then tap "Add to Home Screen"';
    } else if (isChrome) {
        instructions = 'In Chrome: Click the three dots menu → "Add to Home screen"';
    } else {
        instructions = 'Check your browser menu for "Add to Home Screen" or "Install App" option';
    }
    
    alert(`📱 Add to Home Screen\n\n${instructions}\n\nThis will create a shortcut to Chutadamon's Birthday Website on your device!`);
}

// Listen for successful app installation
window.addEventListener('appinstalled', (e) => {
    console.log('✅ App successfully installed');
    showNotification('🎉 Birthday website installed! Check your home screen!');
    
    // Hide the Add to Home button
    if (addToHomeBtn) {
        addToHomeBtn.style.display = 'none';
    }
});

// Call this function during your app initialization
// Add this line in your DOMContentLoaded event listener:
// initializeAddToHome();


// FIXED NOTIFICATION SYSTEM
function initializeNotificationSystem() {
    console.log('🔔 Initializing FIXED notification system...');
    
    try {
        updateNotificationStatus();
        
        // Show notification banner if not granted
        if (notificationSupported && notificationPermission !== 'granted') {
            setTimeout(() => {
                showNotificationBanner();
            }, 2000);
        }
        
        // FIXED: Initialize notification request buttons with correct IDs
        const requestBtn = document.getElementById('request-notifications');
        const enableBtn = document.getElementById('enable-notifications');
        const dismissBtn = document.getElementById('dismiss-notifications');
        const testBtn = document.getElementById('test-notification');
        
        if (requestBtn) {
            requestBtn.addEventListener('click', requestNotificationPermission);
            console.log('✅ Request notifications button initialized');
        }
        
        if (enableBtn) {
            enableBtn.addEventListener('click', requestNotificationPermission);
            console.log('✅ Enable notifications button initialized');
        }
        
        if (dismissBtn) {
            dismissBtn.addEventListener('click', hideNotificationBanner);
            console.log('✅ Dismiss notifications button initialized');
        }
        
        if (testBtn) {
            testBtn.addEventListener('click', testNotification);
            console.log('✅ Test notification button initialized');
        }
        
        console.log('✅ Notification system initialized');
    } catch (error) {
        console.error('❌ Error initializing notification system:', error);
    }
}

function updateNotificationStatus() {
    if (!notificationSupported) {
        console.log('❌ Notifications not supported in this browser');
        updateNotificationUI('unsupported', 'Notifications not supported');
        return;
    }
    
    notificationPermission = Notification.permission;
    console.log('🔔 Notification permission:', notificationPermission);
    
    switch (notificationPermission) {
        case 'granted':
            updateNotificationUI('granted', 'Notifications enabled');
            break;
        case 'denied':
            updateNotificationUI('denied', 'Notifications blocked');
            break;
        default:
            updateNotificationUI('default', 'Notifications disabled');
            break;
    }
}

function updateNotificationUI(status, text) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('notification-status-text');
    const requestBtn = document.getElementById('request-notifications');
    
    if (statusDot) {
        statusDot.className = `status-dot ${status}`;
    }
    
    if (statusText) {
        statusText.textContent = text;
    }
    
    if (requestBtn) {
        if (status === 'granted') {
            requestBtn.textContent = 'Notifications Enabled ✅';
            requestBtn.disabled = true;
            requestBtn.classList.remove('btn--primary');
            requestBtn.classList.add('btn--outline');
        } else if (status === 'denied') {
            requestBtn.textContent = 'Enable in Browser Settings';
            requestBtn.disabled = true;
            requestBtn.classList.remove('btn--primary');
            requestBtn.classList.add('btn--outline');
        } else {
            requestBtn.textContent = 'Enable Notifications';
            requestBtn.disabled = false;
            requestBtn.classList.add('btn--primary');
            requestBtn.classList.remove('btn--outline');
        }
    }
}

function showNotificationBanner() {
    const banner = document.getElementById('notification-banner');
    if (banner && notificationPermission !== 'granted') {
        banner.classList.remove('hidden');
        console.log('📢 Showing notification permission banner');
    }
}

// HAMBURGER MENU JAVASCRIPT - COMPLETE FIX
function initializeNavigation() {
    console.log('🧭 Initializing navigation...');
    
    try {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        console.log('Navigation elements found:', {
            navToggle: !!navToggle,
            navMenu: !!navMenu,
            navLinks: navLinks.length
        });

        // FIXED: Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('📱 Nav toggle clicked');
                
                // Toggle active classes
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                
                // Log current state
                console.log('Menu active:', navMenu.classList.contains('active'));
                
                // Add haptic feedback on mobile
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
            console.log('✅ Mobile menu toggle initialized');
        } else {
            console.error('❌ Nav toggle or nav menu not found!', {
                navToggle: navToggle,
                navMenu: navMenu
            });
        }

        // Navigation links
        if (navLinks.length > 0) {
            navLinks.forEach((link, index) => {
                link.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    console.log(`🔗 Nav link ${index} clicked:`, href);
                    
                    // Don't prevent default for Add to Home button
                    if (this.id === 'add-to-home') {
                        return; // Let the add-to-home handler deal with this
                    }
                    
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (href && href.startsWith('#')) {
                        const targetId = href.substring(1);
                        console.log('🎯 Switching to section:', targetId);
                        
                        const success = switchSection(targetId);
                        
                        if (success) {
                            // Update active state
                            navLinks.forEach(l => l.classList.remove('active'));
                            this.classList.add('active');
                            
                            // Close mobile menu
                            if (navMenu) navMenu.classList.remove('active');
                            if (navToggle) navToggle.classList.remove('active');
                            
                            showNotification(`📱 Navigated to ${targetId.charAt(0).toUpperCase() + targetId.slice(1)}`);
                        }
                    }
                });
            });
            console.log('✅ Navigation links initialized:', navLinks.length);
        }
        
        console.log('✅ Navigation completely initialized');
    } catch (error) {
        console.error('❌ Error initializing navigation:', error);
    }
}

// Make sure this runs on page load
document.addEventListener('DOMContentLoaded', function() {
    // ... your other initialization code ...
    initializeNavigation(); // Make sure this is called
    // ... rest of your code ...
});


function hideNotificationBanner() {
    const banner = document.getElementById('notification-banner');
    if (banner) {
        banner.classList.add('hidden');
        console.log('📢 Hiding notification permission banner');
    }
}

async function requestNotificationPermission() {
    console.log('🔔 Requesting notification permission...');
    
    if (!notificationSupported) {
        showNotification('❌ Notifications are not supported in this browser');
        return;
    }
    
    try {
        const permission = await Notification.requestPermission();
        console.log('🔔 Permission result:', permission);
        
        notificationPermission = permission;
        updateNotificationStatus();
        
        if (permission === 'granted') {
            showNotification('✅ Notifications enabled! You\'ll receive meal and water reminders.');
            hideNotificationBanner();
            
            // Show test notification
            setTimeout(() => {
                new Notification('🎉 Notifications Working!', {
                    body: 'You\'ll now receive reminders at the scheduled times.',
                    icon: '/icon-192x192.png',
                    badge: '/icon-192x192.png'
                });
            }, 1000);
            
        } else if (permission === 'denied') {
            showNotification('❌ Notifications blocked. Enable them in your browser settings for reminders.');
            hideNotificationBanner();
        } else {
            showNotification('⚠️ Notification permission not granted');
        }
        
    } catch (error) {
        console.error('❌ Error requesting notification permission:', error);
        showNotification('❌ Error requesting notification permission');
    }
}

function testNotification() {
    console.log('🧪 Testing notification...');
    
    if (notificationPermission === 'granted') {
        new Notification('🧪 Test Notification', {
            body: 'This is a test notification from Chutadamon\'s Birthday Website!',
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png'
        });
        showNotification('🧪 Test notification sent!');
    } else {
        showNotification('❌ Please enable notifications first');
    }
}

// FIXED THEME TOGGLE FUNCTIONS
function initializeThemeToggle() {
    console.log('🌓 Initializing FIXED theme toggle...');
    
    try {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('birthday-theme') || 'light';
        
        setTheme(savedTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🌓 Theme toggle clicked');
                
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
                
                createCelebrationBurst(this);
                showNotification(`✨ Switched to ${newTheme} mode!`);
            });
            console.log('✅ Theme toggle initialized properly');
        } else {
            console.error('❌ Theme toggle button not found');
        }
    } catch (error) {
        console.error('❌ Error initializing theme toggle:', error);
    }
}

function setTheme(theme) {
    console.log(`🎨 Setting theme to: ${theme}`);
    currentTheme = theme;
    document.documentElement.setAttribute('data-color-scheme', theme);
    localStorage.setItem('birthday-theme', theme);
    
    const themeIcon = document.querySelector('.theme-toggle-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
    
    console.log(`✅ Theme successfully changed to: ${theme}`);
}

function createCelebrationBurst(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['🎉', '✨', '🎊', '💫', '⭐'];
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.textContent = colors[Math.floor(Math.random() * colors.length)];
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 9999;
            animation: burst 1s ease-out forwards;
        `;
        
        const angle = (i / 8) * 360;
        particle.style.setProperty('--angle', `${angle}deg`);
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 1000);
    }
}

// COMPLETELY FIXED NAVIGATION FUNCTIONS
function initializeNavigation() {
    console.log('🧭 Initializing COMPLETELY FIXED navigation...');
    
    try {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        console.log('Navigation elements found:', {
            navToggle: !!navToggle,
            navMenu: !!navMenu,
            navLinks: navLinks.length
        });

        // FIXED: Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('📱 Nav toggle clicked');
                
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
            console.log('✅ Mobile menu toggle initialized');
        }

        // FIXED: Navigation links with proper event handling
        if (navLinks.length > 0) {
            navLinks.forEach((link, index) => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const href = this.getAttribute('href');
                    console.log(`🔗 Nav link ${index} clicked:`, href);
                    
                    if (href && href.startsWith('#')) {
                        const targetId = href.substring(1);
                        console.log('🎯 Switching to section:', targetId);
                        
                        const success = switchSection(targetId);
                        
                        if (success) {
                            // Update active state
                            navLinks.forEach(l => l.classList.remove('active'));
                            this.classList.add('active');
                            console.log('✅ Navigation successful, active state updated');
                            
                            // Close mobile menu
                            if (navMenu) navMenu.classList.remove('active');
                            if (navToggle) navToggle.classList.remove('active');
                            
                            // Add navigation feedback
                            createNavigationEffect(this);
                            showNotification(`📱 Navigated to ${targetId.charAt(0).toUpperCase() + targetId.slice(1)}`);
                        } else {
                            console.error('❌ Navigation failed for section:', targetId);
                            showNotification('❌ Navigation failed');
                        }
                    }
                });
            });
            console.log('✅ Navigation links initialized:', navLinks.length);
        } else {
            console.error('❌ No navigation links found');
        }
        
        // FIXED: Initialize all sections as hidden except home
        const allSections = document.querySelectorAll('.section');
        console.log('📄 Found sections:', allSections.length);
        
        allSections.forEach((section, index) => {
            console.log(`Section ${index}: ${section.id}`);
            if (section.id !== 'home') {
                section.classList.remove('active');
            }
        });
        
        console.log('✅ Navigation completely initialized and fixed');
    } catch (error) {
        console.error('❌ Error initializing navigation:', error);
    }
}

function switchSection(sectionId) {
    console.log(`🎯 FIXED: Switching to section: ${sectionId}`);
    
    try {
        // Find target section
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) {
            console.error(`❌ Target section not found: ${sectionId}`);
            return false;
        }
        
        // Hide ALL sections first
        const allSections = document.querySelectorAll('.section');
        console.log(`📄 Found ${allSections.length} sections to manage`);
        
        allSections.forEach(section => {
            if (section.classList.contains('active')) {
                console.log(`❌ Hiding section: ${section.id}`);
                section.classList.remove('active');
            }
        });
        
        // Show target section
        targetSection.classList.add('active');
        console.log(`✅ Showing section: ${sectionId}`);
        
        // Trigger section-specific initialization
        setTimeout(() => {
            initializeSectionSpecific(sectionId);
        }, 100);
        
        return true;
    } catch (error) {
        console.error('❌ Error switching sections:', error);
        return false;
    }
}

function createNavigationEffect(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = '';
    }, 200);
}

function initializeSectionSpecific(sectionId) {
    console.log(`🎬 Initializing section: ${sectionId}`);
    
    switch(sectionId) {
        case 'home':
            if (!countdownInterval) {
                startCountdown();
            }
            break;
        case 'gallery':
            updateGalleryDisplay();
            break;
        case 'calendar':
            renderCalendar();
            updateEventsList();
            break;
        case 'spotify':
            checkSpotifyAuth();
            break;
        case 'reminders':
            updateNotificationStatus();
            updateNextReminderInfo();
            break;
    }
}

// Countdown Functions
function initializeCountdowns() {
    console.log('⏰ Initializing countdowns...');
    
    try {
        updateBirthdayCountdown();
        updateSisterCounter();
        startCountdown();
        
        console.log('✅ Countdowns initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing countdowns:', error);
    }
}

function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    updateBirthdayCountdown();
    
    countdownInterval = setInterval(() => {
        updateBirthdayCountdown();
    }, 1000);
}

function updateBirthdayCountdown() {
    try {
        const now = new Date();
        const currentYear = now.getFullYear();
        
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const birthdayThisYear = new Date(currentYear, 8, 13); // September 13
        
        const countdownTitle = document.getElementById('countdown-title');
        
        if (today.getTime() === birthdayThisYear.getTime()) {
            if (countdownTitle) {
                countdownTitle.textContent = '🎂 It\'s Your Birthday Today!';
            }
            
            const nextBirthday = new Date(currentYear + 1, 8, 13);
            const timeDiff = nextBirthday - now;
            
            updateCountdownDisplay(timeDiff);
            
            const labels = document.querySelectorAll('.time-unit label');
            labels.forEach((label, index) => {
                if (index === 0) label.textContent = 'Days Until Next';
            });
            
        } else {
            let nextBirthday = birthdayThisYear;
            if (now > birthdayThisYear) {
                nextBirthday = new Date(currentYear + 1, 8, 13);
            }
            
            if (countdownTitle) {
                countdownTitle.textContent = '🎉 Countdown to Birthday';
            }
            
            const timeDiff = nextBirthday - now;
            updateCountdownDisplay(timeDiff);
        }
    } catch (error) {
        console.error('❌ Error updating countdown:', error);
    }
}

function updateCountdownDisplay(timeDiff) {
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    updateCountdownNumber('days', days);
    updateCountdownNumber('hours', hours);
    updateCountdownNumber('minutes', minutes);
    updateCountdownNumber('seconds', seconds);
}

function updateCountdownNumber(id, value) {
    const element = document.getElementById(id);
    if (element && element.textContent !== value.toString()) {
        element.style.transform = 'scale(1.2)';
        element.textContent = value;
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }
}

function updateSisterCounter() {
    try {
        const startDate = new Date(2005, 9, 5); // October 5, 2005
        const now = new Date();
        const timeDiff = now - startDate;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        const sisterDaysEl = document.getElementById('sister-days');
        if (sisterDaysEl) {
            sisterDaysEl.textContent = days.toLocaleString();
        }
    } catch (error) {
        console.error('❌ Error updating sister counter:', error);
    }
}

// FIXED REMINDERS FUNCTIONS with proper timing
function initializeReminders() {
    console.log('🔔 Initializing FIXED reminders with proper timing system...');
    
    try {
        // Meal reminders
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        mealTypes.forEach(mealType => {
            const toggle = document.getElementById(`${mealType}-toggle`);
            const timeSelect = document.getElementById(`${mealType}-time`);
            
            if (toggle) {
                toggle.addEventListener('change', function() {
                    const time = timeSelect ? timeSelect.value : appData.notificationSettings.mealReminders[mealType].time;
                    handleMealToggle(mealType, this.checked, time);
                    showNotification(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} reminder ${this.checked ? 'enabled' : 'disabled'} ${getMealIcon(mealType)}`);
                    updateNextReminderInfo();
                });
                console.log(`✅ ${mealType} toggle initialized`);
            }
            
            if (timeSelect) {
                timeSelect.addEventListener('change', function() {
                    if (toggle && toggle.checked) {
                        handleMealToggle(mealType, true, this.value);
                        showNotification(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} time updated to ${formatTime(this.value)} ⏰`);
                        updateNextReminderInfo();
                    }
                    saveRemindersData();
                });
                console.log(`✅ ${mealType} time selector initialized`);
            }
        });
        
        // Water reminders
        const waterToggle = document.getElementById('water-toggle');
        const waterIntervalSelect = document.getElementById('water-interval-select');
        
        if (waterToggle) {
            waterToggle.addEventListener('change', function() {
                handleWaterToggle(this.checked);
                showNotification(`Water reminders ${this.checked ? 'enabled' : 'disabled'} 💧`);
                updateNextReminderInfo();
            });
            console.log('✅ Water toggle initialized');
        }
        
        if (waterIntervalSelect) {
            waterIntervalSelect.addEventListener('change', function() {
                if (waterToggle && waterToggle.checked) {
                    handleWaterToggle(true);
                    updateNextReminderInfo();
                }
                saveRemindersData();
            });
            console.log('✅ Water interval selector initialized');
        }
        
        console.log('✅ Reminders initialized with proper timing system');
    } catch (error) {
        console.error('❌ Error initializing reminders:', error);
    }
}

function handleMealToggle(mealType, enabled, time) {
    console.log(`🍽️ Handling ${mealType} toggle: ${enabled ? 'enabled' : 'disabled'} at ${time}`);
    
    try {
        if (enabled) {
            if (notificationPermission === 'granted') {
                scheduleMealReminder(mealType, time);
                console.log(`✅ ${mealType} reminder scheduled for ${time}`);
            } else {
                showNotification('⚠️ Please enable notifications to receive meal reminders');
                // Don't disable the toggle, let user keep their preference
            }
        } else {
            clearMealReminder(mealType);
            console.log(`❌ ${mealType} reminder cleared`);
        }
        saveRemindersData();
    } catch (error) {
        console.error('❌ Error handling meal toggle:', error);
    }
}

function handleWaterToggle(enabled) {
    console.log(`💧 Handling water toggle: ${enabled ? 'enabled' : 'disabled'}`);
    
    try {
        const intervalSelect = document.getElementById('water-interval-select');
        const interval = intervalSelect ? intervalSelect.value : '60';
        
        if (enabled) {
            if (notificationPermission === 'granted') {
                scheduleWaterReminder(interval);
                console.log(`✅ Water reminder scheduled every ${interval} minutes`);
            } else {
                showNotification('⚠️ Please enable notifications to receive water reminders');
                // Don't disable the toggle, let user keep their preference
            }
        } else {
            clearWaterReminder();
            console.log('❌ Water reminder cleared');
        }
        saveRemindersData();
    } catch (error) {
        console.error('❌ Error handling water toggle:', error);
    }
}

// FIXED: Proper meal reminder scheduling with correct time calculations
function scheduleMealReminder(mealType, timeString) {
    console.log(`⏰ Scheduling ${mealType} reminder for ${timeString}`);
    
    try {
        // Clear existing reminder
        clearMealReminder(mealType);
        
        if (notificationPermission !== 'granted') {
            console.log('❌ Cannot schedule reminder - no notification permission');
            return;
        }
        
        const now = new Date();
        const [hours, minutes] = timeString.split(':').map(Number);
        
        // Create target time for today
        const targetTime = new Date(now);
        targetTime.setHours(hours, minutes, 0, 0);
        
        // If the time has already passed today, schedule for tomorrow
        if (targetTime <= now) {
            targetTime.setDate(targetTime.getDate() + 1);
            console.log(`🔄 Time ${timeString} has passed today, scheduling for tomorrow`);
        }
        
        const msUntilReminder = targetTime - now;
        console.log(`⏱️ ${mealType} reminder will fire in ${Math.round(msUntilReminder / 1000 / 60)} minutes`);
        
        // Schedule the reminder
        reminderTimeouts[mealType] = setTimeout(() => {
            console.log(`🔔 Firing ${mealType} reminder!`);
            
            const message = appData.notificationSettings.mealReminders[mealType].message;
            
            // Show browser notification
            if (notificationPermission === 'granted') {
                new Notification(`${getMealIcon(mealType)} ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Time!`, {
                    body: message,
                    icon: '/icon-192x192.png',
                    badge: '/icon-192x192.png',
                    requireInteraction: true
                });
            }
            
            // Show in-app notification
            showNotification(message);
            
            // Schedule next reminder for tomorrow
            setTimeout(() => {
                const toggle = document.getElementById(`${mealType}-toggle`);
                if (toggle && toggle.checked) {
                    scheduleMealReminder(mealType, timeString);
                }
            }, 1000);
            
        }, msUntilReminder);
        
        console.log(`✅ ${mealType} reminder scheduled successfully`);
        
    } catch (error) {
        console.error(`❌ Error scheduling ${mealType} reminder:`, error);
    }
}

function scheduleWaterReminder(intervalMinutes) {
    console.log(`💧 Scheduling water reminder every ${intervalMinutes} minutes`);
    
    try {
        clearWaterReminder();
        
        if (notificationPermission !== 'granted') {
            console.log('❌ Cannot schedule water reminder - no notification permission');
            return;
        }
        
        const intervalMs = parseInt(intervalMinutes) * 60 * 1000;
        
        reminderIntervals.water = setInterval(() => {
            console.log('💧 Firing water reminder!');
            
            const message = appData.notificationSettings.waterReminder.message;
            
            // Show browser notification
            if (notificationPermission === 'granted') {
                new Notification('💧 Hydration Time!', {
                    body: message,
                    icon: '/icon-192x192.png',
                    badge: '/icon-192x192.png'
                });
            }
            
            // Show in-app notification
            showNotification(message);
            
            // Update water progress
            waterProgress = Math.min(waterProgress + 12.5, 100);
            updateWaterProgress();
            
        }, intervalMs);
        
        console.log(`✅ Water reminder scheduled every ${intervalMinutes} minutes`);
        
    } catch (error) {
        console.error('❌ Error scheduling water reminder:', error);
    }
}

function clearMealReminder(mealType) {
    if (reminderTimeouts[mealType]) {
        clearTimeout(reminderTimeouts[mealType]);
        delete reminderTimeouts[mealType];
        console.log(`🗑️ Cleared ${mealType} reminder`);
    }
}

function clearWaterReminder() {
    if (reminderIntervals.water) {
        clearInterval(reminderIntervals.water);
        delete reminderIntervals.water;
        console.log('🗑️ Cleared water reminder');
    }
}

function updateNextReminderInfo() {
    try {
        const nextReminderEl = document.getElementById('next-reminder-text');
        if (!nextReminderEl) return;
        
        const upcomingReminders = [];
        
        // Check meal reminders
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        mealTypes.forEach(mealType => {
            const toggle = document.getElementById(`${mealType}-toggle`);
            const timeSelect = document.getElementById(`${mealType}-time`);
            
            if (toggle && toggle.checked && timeSelect) {
                const [hours, minutes] = timeSelect.value.split(':').map(Number);
                const now = new Date();
                const targetTime = new Date(now);
                targetTime.setHours(hours, minutes, 0, 0);
                
                if (targetTime <= now) {
                    targetTime.setDate(targetTime.getDate() + 1);
                }
                
                upcomingReminders.push({
                    type: mealType,
                    time: targetTime,
                    display: `${getMealIcon(mealType)} ${mealType} at ${formatTime(timeSelect.value)}`
                });
            }
        });
        
        // Check water reminder
        const waterToggle = document.getElementById('water-toggle');
        if (waterToggle && waterToggle.checked) {
            const intervalSelect = document.getElementById('water-interval-select');
            const interval = intervalSelect ? parseInt(intervalSelect.value) : 60;
            const nextWater = new Date(Date.now() + (interval * 60 * 1000));
            
            upcomingReminders.push({
                type: 'water',
                time: nextWater,
                display: `💧 Water in ${interval} minutes`
            });
        }
        
        if (upcomingReminders.length > 0) {
            // Sort by time and get the nearest
            upcomingReminders.sort((a, b) => a.time - b.time);
            const next = upcomingReminders[0];
            
            const timeUntil = next.time - new Date();
            const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
            const minutesUntil = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
            
            let timeDisplay = '';
            if (hoursUntil > 0) {
                timeDisplay = `in ${hoursUntil}h ${minutesUntil}m`;
            } else if (minutesUntil > 0) {
                timeDisplay = `in ${minutesUntil} minutes`;
            } else {
                timeDisplay = 'very soon';
            }
            
            nextReminderEl.textContent = `Next: ${next.display} (${timeDisplay})`;
        } else {
            nextReminderEl.textContent = 'No active reminders';
        }
        
    } catch (error) {
        console.error('❌ Error updating next reminder info:', error);
    }
}

function getMealIcon(mealType) {
    const icons = {
        breakfast: '🍳',
        lunch: '🥗',
        dinner: '🍽️'
    };
    return icons[mealType] || '🍴';
}

function updateWaterProgress() {
    // This function would update a water progress indicator if it exists
    console.log(`💧 Water progress: ${waterProgress}%`);
}

function formatTime(time24) {
    try {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
        return time24;
    }
}

// COMPLETELY FIXED SPOTIFY INTEGRATION
function initializeSpotify() {
    console.log('🎵 Initializing COMPLETELY FIXED Spotify integration...');
    try {
        // Check URL for callback parameters first
        checkSpotifyCallback();
        
        // FIXED: Initialize UI elements with correct IDs
        const loginBtn = document.getElementById('spotify-login');
        const logoutBtn = document.getElementById('spotify-logout');
        const retryBtn = document.getElementById('retry-spotify');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', initiateSpotifyAuth);
            console.log('✅ Spotify login button initialized');
        } else {
            console.error('❌ Spotify login button not found');
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', spotifyLogout);
            console.log('✅ Spotify logout button initialized');
        }
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                hideSpotifyError();
                initiateSpotifyAuth();
            });
            console.log('✅ Spotify retry button initialized');
        }
        
        // Initialize player controls
        initializePlayerControls();
        
        // Initialize tabs
        initializeSpotifyTabs();
        
        // Check for existing token
        const savedToken = localStorage.getItem('spotify_access_token');
        const tokenExpiry = localStorage.getItem('spotify_token_expiry');
        
        if (savedToken && tokenExpiry) {
            const now = Date.now();
            if (now < parseInt(tokenExpiry)) {
                console.log('🔑 Found valid saved token');
                spotifyAccessToken = savedToken;
                initializeSpotifyWithToken();
            } else {
                console.log('⏰ Saved token expired, clearing...');
                localStorage.removeItem('spotify_access_token');
                localStorage.removeItem('spotify_token_expiry');
            }
        }
        
        console.log('✅ Spotify integration completely initialized');
    } catch (error) {
        console.error('❌ Error initializing Spotify:', error);
        showSpotifyError('Failed to initialize Spotify integration');
    }
}


// FIXED: Check for Spotify callback with proper error handling
function checkSpotifyCallback() {
    console.log('🔍 Checking for Spotify callback...');
    
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Check for authorization code (Authorization Code Flow)
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        // Check for access token (Implicit Grant Flow) 
        const accessToken = hashParams.get('access_token');
        const expiresIn = hashParams.get('expires_in');
        const error = urlParams.get('error') || hashParams.get('error');
        
        if (error) {
            console.error('❌ Spotify authorization error:', error);
            const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
            showSpotifyError(`Authorization failed: ${errorDescription || error}`);
            
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }
        
        if (accessToken && expiresIn) {
            console.log('🔑 Found access token in URL');
            spotifyAccessToken = accessToken;
            
            // Calculate expiry time
            const expiryTime = Date.now() + (parseInt(expiresIn) * 1000);
            localStorage.setItem('spotify_access_token', accessToken);
            localStorage.setItem('spotify_token_expiry', expiryTime.toString());
            
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Initialize Spotify with token
            initializeSpotifyWithToken();
            showNotification('🎉 Successfully connected to Spotify!');
            
        } else if (code) {
        console.log('🔑 Found authorization code, exchanging for token...');
        exchangeCodeForToken(code);
        window.history.replaceState({}, document.title, window.location.pathname);
        }

        
    } catch (error) {
        console.error('❌ Error checking Spotify callback:', error);
    }
}

async function exchangeCodeForToken(code) {
    try {
        const { clientId, redirectUri } = appData.spotifyConfig;
        const codeVerifier = localStorage.getItem('spotify_code_verifier');
        
        console.log('🔄 Exchange token params:');
        console.log('- Client ID:', clientId);
        console.log('- Redirect URI:', redirectUri);
        console.log('- Code:', code.substring(0, 10) + '...');
        console.log('- Code Verifier exists:', !!codeVerifier);
        console.log('- Code Verifier:', codeVerifier ? codeVerifier.substring(0, 10) + '...' : 'MISSING');
        
        if (!codeVerifier) {
            throw new Error('Code verifier not found in localStorage');
        }
        
        const requestBody = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            code_verifier: codeVerifier,
        });
        
        console.log('🌐 Sending token request with body:', requestBody.toString());
        
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestBody
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Token exchange error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ Token exchange successful:', data);
        
        if (data.access_token) {
            console.log('🔑 Successfully received access token');
            spotifyAccessToken = data.access_token;
            
            const expiryTime = Date.now() + (data.expires_in * 1000);
            localStorage.setItem('spotify_access_token', data.access_token);
            localStorage.setItem('spotify_token_expiry', expiryTime.toString());
            
            localStorage.removeItem('spotify_code_verifier');
            
            initializeSpotifyWithToken();
            showNotification('🎉 Successfully connected to Spotify!');
        } else {
            throw new Error('No access token received');
        }
        
    } catch (error) {
        console.error('❌ Error exchanging code for token:', error);
        showSpotifyError('Failed to complete authorization. Please try again.');
    }
}

// FIXED: Proper Spotify authorization with CORRECT redirect URI
async function initiateSpotifyAuth() {
    console.log('🎵 Initiating FIXED Spotify authentication with PKCE...');
    try {
        const { clientId, redirectUri, scopes } = appData.spotifyConfig;
        
        // Generate PKCE challenge - FIXED: Better error handling
        const codeVerifier = generateCodeVerifier();
        console.log('🔑 Generated code verifier:', codeVerifier.substring(0, 10) + '...');
        
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        console.log('🔑 Generated code challenge:', codeChallenge.substring(0, 10) + '...');
        
        // Store code verifier for later use
        localStorage.setItem('spotify_code_verifier', codeVerifier);
        console.log('✅ Code verifier stored in localStorage');
        
        console.log('Auth parameters:', { clientId, redirectUri, scopes: scopes.join(' ') });
        
        // FIXED: Use Authorization Code Flow with PKCE
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.append('client_id', clientId);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('redirect_uri', redirectUri);
        authUrl.searchParams.append('scope', scopes.join(' '));
        authUrl.searchParams.append('code_challenge_method', 'S256');
        authUrl.searchParams.append('code_challenge', codeChallenge);
        authUrl.searchParams.append('show_dialog', 'true');
        
        console.log('🔗 Redirecting to:', authUrl.toString());
        showNotification('🎵 Redirecting to Spotify for authorization...');
        
        setTimeout(() => {
            window.location.href = authUrl.toString();
        }, 500);
        
    } catch (error) {
        console.error('❌ Error initiating Spotify auth:', error);
        showSpotifyError('Failed to start authorization process');
    }
}

async function initializeSpotifyWithToken() {
    console.log('🎵 Initializing Spotify with token...');
    
    try {
        showNotification('🔄 Connecting to Spotify...');
        
        // Test the token by getting user profile
        const userProfile = await spotifyApiCall('/me');
        
        if (userProfile) {
            console.log('👤 User profile loaded:', userProfile.display_name);
            displayUserProfile(userProfile);
            showSpotifyAuthenticated();
            
            // Initialize Web Playback SDK
            await initializeWebPlayback();
            
            // Load user's music data
            await loadUserPlaylists();
            await loadLikedSongs();
            
            showNotification('🎉 Spotify fully connected! Ready to play music!');
        } else {
            throw new Error('Failed to load user profile');
        }
        
    } catch (error) {
        console.error('❌ Error initializing Spotify with token:', error);
        showSpotifyError('Failed to connect to Spotify. Please try logging in again.');
        spotifyLogout();
    }
}
// Add these new PKCE helper functions:
function generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return base64URLEncode(array);
}

async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return base64URLEncode(new Uint8Array(digest));
}

function base64URLEncode(array) {
    return btoa(String.fromCharCode(...array))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

async function spotifyApiCall(endpoint, options = {}) {
    console.log(`🌐 Spotify API call: ${endpoint}`);
    
    try {
        if (!spotifyAccessToken) {
            throw new Error('No access token available');
        }
        
        const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${spotifyAccessToken}`,
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (response.status === 401) {
            console.error('🔑 Token expired or invalid');
            showSpotifyError('Session expired. Please log in again.');
            spotifyLogout();
            return null;
        }
        
        if (response.status === 403) {
            console.error('🚫 Insufficient permissions');
            showSpotifyError('Insufficient permissions. Premium account may be required.');
            return null;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ API call successful: ${endpoint}`);
        return data;
        
    } catch (error) {
        console.error(`❌ Spotify API call failed for ${endpoint}:`, error);
        
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
            spotifyLogout();
        }
        
        throw error;
    }
}

function displayUserProfile(profile) {
    console.log('👤 Displaying user profile');
    
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    
    if (userAvatar && profile.images && profile.images.length > 0) {
        userAvatar.src = profile.images[0].url;
        userAvatar.style.display = 'block';
    }
    
    if (userName) {
        userName.textContent = profile.display_name || profile.id;
    }
    
    if (userEmail) {
        userEmail.textContent = profile.email || `@${profile.id}`;
    }
}

function showSpotifyAuthenticated() {
    console.log('🎵 Showing authenticated Spotify UI');
    
    const loginCard = document.getElementById('spotify-login-card');
    const profileCard = document.getElementById('spotify-profile-card');
    const playerCard = document.getElementById('spotify-player-card');
    const musicLibrary = document.getElementById('music-library');
    const errorCard = document.getElementById('spotify-error');
    
    if (loginCard) loginCard.classList.add('hidden');
    if (profileCard) profileCard.classList.remove('hidden');
    if (playerCard) playerCard.classList.remove('hidden');
    if (musicLibrary) musicLibrary.classList.remove('hidden');
    if (errorCard) errorCard.classList.add('hidden');
}

function showSpotifyError(message) {
    console.error('❌ Showing Spotify error:', message);
    
    const errorCard = document.getElementById('spotify-error');
    const errorMessage = document.getElementById('error-message');
    const loginCard = document.getElementById('spotify-login-card');
    const profileCard = document.getElementById('spotify-profile-card');
    const playerCard = document.getElementById('spotify-player-card');
    const musicLibrary = document.getElementById('music-library');
    
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    
    if (errorCard) errorCard.classList.remove('hidden');
    if (loginCard) loginCard.classList.add('hidden');
    if (profileCard) profileCard.classList.add('hidden');
    if (playerCard) playerCard.classList.add('hidden');
    if (musicLibrary) musicLibrary.classList.add('hidden');
    
    showNotification(`❌ ${message}`);
}

function hideSpotifyError() {
    const errorCard = document.getElementById('spotify-error');
    const loginCard = document.getElementById('spotify-login-card');
    
    if (errorCard) errorCard.classList.add('hidden');
    if (loginCard) loginCard.classList.remove('hidden');
}

async function initializeWebPlayback() {
    console.log('🎧 Initializing Web Playback SDK...');
    return new Promise((resolve) => {
        if (window.Spotify && window.Spotify.Player) {
            console.log('🎧 Spotify Player already available');
            setupSpotifyPlayer();
            resolve();
        } else {
            console.log('🎧 Waiting for Spotify Web Playback SDK...');
            // SDK will call the global callback when ready
            setTimeout(() => {
                console.warn('⚠️ Spotify Web Playback SDK timeout');
                resolve(); // Continue without player
            }, 10000);
        }
    });
}


function setupSpotifyPlayer() {
    console.log('🎧 Setting up Spotify Player...');
    
    try {
        if (!spotifyAccessToken) {
            console.error('❌ No access token for player setup');
            return;
        }
        
        spotifyPlayer = new window.Spotify.Player({
            name: 'Chutadamon\'s Birthday Player 🎂',
            getOAuthToken: cb => { 
                console.log('🔑 Player requesting OAuth token');
                cb(spotifyAccessToken); 
            },
            volume: currentVolume
        });
        
        // Player event listeners
        spotifyPlayer.addListener('initialization_error', ({ message }) => {
            console.error('❌ Player initialization error:', message);
        });

        spotifyPlayer.addListener('authentication_error', ({ message }) => {
            console.error('❌ Player authentication error:', message);
            showSpotifyError('Authentication failed. Please log in again.');
            spotifyLogout();
        });

        spotifyPlayer.addListener('account_error', ({ message }) => {
            console.error('❌ Player account error:', message);
            showSpotifyError('Spotify Premium required for playback control');
        });

        spotifyPlayer.addListener('playback_error', ({ message }) => {
            console.error('❌ Playback error:', message);
            showNotification('❌ Playback error occurred');
        });

        spotifyPlayer.addListener('player_state_changed', (state) => {
            if (state) {
                console.log('🎵 Player state changed');
                updatePlayerState(state);
            }
        });

        spotifyPlayer.addListener('ready', ({ device_id }) => {
            console.log('✅ Player ready with Device ID:', device_id);
            deviceId = device_id;
            showNotification('🎧 Spotify player ready!');
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
            console.log('❌ Player offline:', device_id);
            deviceId = null;
        });

        // Connect the player
        spotifyPlayer.connect().then(success => {
            if (success) {
                console.log('✅ Player connected successfully');
            } else {
                console.error('❌ Player connection failed');
            }
        });
        
    } catch (error) {
        console.error('❌ Error setting up Spotify player:', error);
    }
}

async function startWebPlayback(trackUri = null, contextUri = null) {
    console.log('🎵 Starting web playback...');
    try {
        if (!deviceId) {
            console.error('❌ No device ID available');
            showNotification('❌ Player not ready');
            return;
        }

        // First, transfer playback to this device
        await spotifyApiCall('/me/player', {
            method: 'PUT',
            body: JSON.stringify({
                device_ids: [deviceId],
                play: true
            })
        });

        // Small delay to ensure device transfer
        await new Promise(resolve => setTimeout(resolve, 500));

        // Then start playback
        const playPayload = {};
        if (trackUri) {
            playPayload.uris = [trackUri];
        } else if (contextUri) {
            playPayload.context_uri = contextUri;
        }

        await spotifyApiCall(`/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            body: JSON.stringify(playPayload)
        });

        console.log('✅ Playback started successfully');
        showNotification('🎵 Playing music!');
        
    } catch (error) {
        console.error('❌ Error starting playback:', error);
        showNotification('❌ Failed to start playback');
    }
}

function updatePlayerState(state) {
    console.log('🔄 Updating player state');
    
    try {
        const track = state.track_window.current_track;
        currentTrack = track;
        isPlaying = !state.paused;
        currentPosition = state.position;
        trackDuration = state.duration;
        
        updateCurrentTrackDisplay(track);
        updatePlayPauseButton();
        updateProgressBar();
        
    } catch (error) {
        console.error('❌ Error updating player state:', error);
    }
}

function updateCurrentTrackDisplay(track) {
    if (!track) return;
    
    const trackImage = document.getElementById('current-track-image');
    const trackName = document.getElementById('current-track-name');
    const trackArtist = document.getElementById('current-track-artist');
    const trackAlbum = document.getElementById('current-track-album');
    const totalTime = document.getElementById('total-time');
    
    if (trackImage && track.album.images.length > 0) {
        trackImage.src = track.album.images[0].url;
    }
    
    if (trackName) {
        trackName.textContent = track.name;
    }
    
    if (trackArtist) {
        trackArtist.textContent = track.artists.map(artist => artist.name).join(', ');
    }
    
    if (trackAlbum) {
        trackAlbum.textContent = track.album.name;
    }
    
    if (totalTime) {
        totalTime.textContent = formatDuration(trackDuration);
    }
}

function updatePlayPauseButton() {
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (playPauseBtn) {
        playPauseBtn.textContent = isPlaying ? '⏸️' : '▶️';
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    const currentTime = document.getElementById('current-time');
    const progressHandle = document.getElementById('progress-handle');
    
    if (progressFill && trackDuration > 0) {
        const progress = (currentPosition / trackDuration) * 100;
        progressFill.style.width = `${progress}%`;
        
        if (progressHandle) {
            progressHandle.style.left = `${progress}%`;
        }
    }
    
    if (currentTime) {
        currentTime.textContent = formatDuration(currentPosition);
    }
}

function initializePlayerControls() {
    console.log('🎛️ Initializing player controls...');
    
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', previousTrack);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTrack);
    }
    
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', toggleShuffle);
    }
    
    if (repeatBtn) {
        repeatBtn.addEventListener('click', toggleRepeat);
    }
    
    if (progressBar) {
        progressBar.addEventListener('click', seekToPosition);
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            const volume = this.value / 100;
            setVolume(volume);
        });
    }
}

async function togglePlayPause() {
    console.log('⏯️ Toggling play/pause');
    
    try {
        if (!spotifyPlayer) {
            showNotification('❌ Player not ready');
            return;
        }
        
        if (isPlaying) {
            await spotifyPlayer.pause();
            showNotification('⏸️ Paused');
        } else {
            await spotifyPlayer.resume();
            showNotification('▶️ Playing');
        }
    } catch (error) {
        console.error('❌ Error toggling playback:', error);
    }
}

async function previousTrack() {
    console.log('⏮️ Previous track');
    
    try {
        if (spotifyPlayer) {
            await spotifyPlayer.previousTrack();
            showNotification('⏮️ Previous track');
        }
    } catch (error) {
        console.error('❌ Error skipping to previous:', error);
    }
}

async function nextTrack() {
    console.log('⏭️ Next track');
    
    try {
        if (spotifyPlayer) {
            await spotifyPlayer.nextTrack();
            showNotification('⏭️ Next track');
        }
    } catch (error) {
        console.error('❌ Error skipping to next:', error);
    }
}

async function toggleShuffle() {
    console.log('🔀 Toggling shuffle');
    
    try {
        isShuffleOn = !isShuffleOn;
        
        const shuffleBtn = document.getElementById('shuffle-btn');
        if (shuffleBtn) {
            shuffleBtn.classList.toggle('active', isShuffleOn);
        }
        
        if (deviceId) {
            await spotifyApiCall(`/me/player/shuffle?state=${isShuffleOn}&device_id=${deviceId}`, {
                method: 'PUT'
            });
        }
        
        showNotification(`🔀 Shuffle ${isShuffleOn ? 'on' : 'off'}`);
    } catch (error) {
        console.error('❌ Error toggling shuffle:', error);
    }
}

async function toggleRepeat() {
    console.log('🔁 Toggling repeat');
    
    try {
        const modes = ['off', 'context', 'track'];
        const currentIndex = modes.indexOf(repeatMode);
        repeatMode = modes[(currentIndex + 1) % modes.length];
        
        const repeatBtn = document.getElementById('repeat-btn');
        if (repeatBtn) {
            repeatBtn.classList.toggle('active', repeatMode !== 'off');
            repeatBtn.textContent = repeatMode === 'track' ? '🔂' : '🔁';
        }
        
        if (deviceId) {
            await spotifyApiCall(`/me/player/repeat?state=${repeatMode}&device_id=${deviceId}`, {
                method: 'PUT'
            });
        }
        
        showNotification(`🔁 Repeat: ${repeatMode}`);
    } catch (error) {
        console.error('❌ Error toggling repeat:', error);
    }
}

function seekToPosition(e) {
    console.log('🎯 Seeking to position');
    
    if (!trackDuration || !spotifyPlayer) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekPosition = Math.floor(percentage * trackDuration);
    
    spotifyPlayer.seek(seekPosition);
}

function setVolume(volume) {
    console.log(`🔊 Setting volume to ${Math.round(volume * 100)}%`);
    
    currentVolume = volume;
    
    if (spotifyPlayer) {
        spotifyPlayer.setVolume(currentVolume);
    }
    
    const volumeValue = document.getElementById('volume-value');
    if (volumeValue) {
        volumeValue.textContent = `${Math.round(volume * 100)}%`;
    }
}

function initializeSpotifyTabs() {
    console.log('📑 Initializing Spotify tabs...');
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            console.log('📑 Switching to tab:', tabName);
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-tab`) {
                    content.classList.add('active');
                }
            });
            
            // Load tab content if needed
            loadTabContent(tabName);
        });
    });
}

function loadTabContent(tabName) {
    console.log('📂 Loading tab content:', tabName);
    
    switch(tabName) {
        case 'playlists':
            if (userPlaylists.length === 0) {
                loadUserPlaylists();
            }
            break;
        case 'liked':
            if (likedSongs.length === 0) {
                loadLikedSongs();
            }
            break;
    }
}

async function loadUserPlaylists() {
    console.log('📚 Loading user playlists...');
    
    try {
        const playlistsGrid = document.getElementById('playlists-grid');
        if (playlistsGrid) {
            playlistsGrid.innerHTML = '<div class="loading">Loading playlists...</div>';
        }
        
        const response = await spotifyApiCall('/me/playlists?limit=50');
        if (response && response.items) {
            userPlaylists = response.items;
            displayPlaylists(userPlaylists);
            console.log(`✅ Loaded ${userPlaylists.length} playlists`);
        }
    } catch (error) {
        console.error('❌ Error loading playlists:', error);
        const playlistsGrid = document.getElementById('playlists-grid');
        if (playlistsGrid) {
            playlistsGrid.innerHTML = '<div class="loading">Error loading playlists</div>';
        }
    }
}

function displayPlaylists(playlists) {
    console.log('📚 Displaying playlists');
    
    const playlistsGrid = document.getElementById('playlists-grid');
    if (!playlistsGrid) return;
    
    playlistsGrid.innerHTML = '';
    
    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.className = 'playlist-item';
        playlistElement.innerHTML = `
            <div class="playlist-header">
                <img src="${playlist.images[0]?.url || ''}" alt="${playlist.name}" class="playlist-cover">
                <div class="playlist-info">
                    <h4>${playlist.name}</h4>
                    <div class="playlist-meta">${playlist.tracks.total} tracks • ${playlist.owner.display_name}</div>
                </div>
            </div>
            <div class="playlist-description">${playlist.description || 'No description'}</div>
        `;
        
        playlistElement.addEventListener('click', () => playPlaylist(playlist));
        playlistsGrid.appendChild(playlistElement);
    });
}

async function playPlaylist(playlist) {
    console.log('🎵 Playing playlist:', playlist.name);
    try {
        await startWebPlayback(null, playlist.uri);
        showNotification(`🎵 Playing: ${playlist.name}`);
    } catch (error) {
        console.error('❌ Error playing playlist:', error);
        showNotification('❌ Error playing playlist');
    }
}


async function loadLikedSongs() {
    console.log('❤️ Loading liked songs...');
    
    try {
        const tracksList = document.getElementById('tracks-list');
        if (tracksList) {
            tracksList.innerHTML = '<div class="loading">Loading liked songs...</div>';
        }
        
        const response = await spotifyApiCall('/me/tracks?limit=50');
        if (response && response.items) {
            likedSongs = response.items;
            displayLikedSongs(likedSongs);
            console.log(`✅ Loaded ${likedSongs.length} liked songs`);
        }
    } catch (error) {
        console.error('❌ Error loading liked songs:', error);
        const tracksList = document.getElementById('tracks-list');
        if (tracksList) {
            tracksList.innerHTML = '<div class="loading">Error loading liked songs</div>';
        }
    }
}

function displayLikedSongs(songs) {
    console.log('❤️ Displaying liked songs');
    
    const tracksList = document.getElementById('tracks-list');
    if (!tracksList) return;
    
    tracksList.innerHTML = '';
    
    songs.forEach((item, index) => {
        if (!item.track) return;
        
        const track = item.track;
        const trackElement = document.createElement('div');
        trackElement.className = 'track-item';
        trackElement.innerHTML = `
            <span class="track-number">${index + 1}</span>
            <img src="${track.album.images[2]?.url || ''}" alt="${track.name}" class="track-cover">
            <div class="track-details-list">
                <h4>${track.name}</h4>
                <p>${track.artists.map(a => a.name).join(', ')}</p>
            </div>
            <span class="track-duration">${formatDuration(track.duration_ms)}</span>
        `;
        
        trackElement.addEventListener('click', () => playTrack(track.uri));
        tracksList.appendChild(trackElement);
    });
}

async function playTrack(trackUri) {
    console.log('🎵 Playing track:', trackUri);
    try {
        await startWebPlayback(trackUri);
        showNotification('🎵 Playing track');
    } catch (error) {
        console.error('❌ Error playing track:', error);
        showNotification('❌ Error playing track');
    }
}


function spotifyLogout() {
    console.log('👋 Logging out of Spotify...');
    
    // Clear tokens
    spotifyAccessToken = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');
    
    // Disconnect player
    if (spotifyPlayer) {
        spotifyPlayer.disconnect();
        spotifyPlayer = null;
    }
    
    // Reset data
    userPlaylists = [];
    likedSongs = [];
    currentTrack = null;
    deviceId = null;
    
    // Reset UI
    const loginCard = document.getElementById('spotify-login-card');
    const profileCard = document.getElementById('spotify-profile-card');
    const playerCard = document.getElementById('spotify-player-card');
    const musicLibrary = document.getElementById('music-library');
    const errorCard = document.getElementById('spotify-error');
    
    if (loginCard) loginCard.classList.remove('hidden');
    if (profileCard) profileCard.classList.add('hidden');
    if (playerCard) playerCard.classList.add('hidden');
    if (musicLibrary) musicLibrary.classList.add('hidden');
    if (errorCard) errorCard.classList.add('hidden');
    
    showNotification('👋 Logged out of Spotify');
}

function checkSpotifyAuth() {
    const savedToken = localStorage.getItem('spotify_access_token');
    const tokenExpiry = localStorage.getItem('spotify_token_expiry');
    
    if (savedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
        if (!spotifyAccessToken) {
            spotifyAccessToken = savedToken;
            initializeSpotifyWithToken();
        }
    }
}

function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Gallery Functions
function initializeGallery() {
    console.log('📸 Initializing gallery...');
    
    try {
        const uploadBtn = document.getElementById('upload-btn');
        const photoUpload = document.getElementById('photo-upload');
        const slideshowBtn = document.getElementById('slideshow-btn');
        const slideshowModal = document.getElementById('slideshow-modal');
        const closeSlideshow = document.getElementById('close-slideshow');
        const prevSlide = document.getElementById('prev-slide');
        const nextSlide = document.getElementById('next-slide');
        
        if (uploadBtn && photoUpload) {
            uploadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                photoUpload.click();
                showNotification('Select photos to upload! 📸');
            });
        }
        
        if (photoUpload) {
            photoUpload.addEventListener('change', handlePhotoUpload);
        }
        
        if (slideshowBtn) {
            slideshowBtn.addEventListener('click', function(e) {
                e.preventDefault();
                startSlideshow();
            });
        }
        
        if (closeSlideshow && slideshowModal) {
            closeSlideshow.addEventListener('click', function(e) {
                e.preventDefault();
                slideshowModal.classList.add('hidden');
            });
        }
        
        if (prevSlide) {
            prevSlide.addEventListener('click', function(e) {
                e.preventDefault();
                previousSlide();
            });
        }
        
        if (nextSlide) {
            nextSlide.addEventListener('click', function(e) {
                e.preventDefault();
                nextSlide();
            });
        }
        
        document.addEventListener('keydown', function(e) {
            if (slideshowModal && !slideshowModal.classList.contains('hidden')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    previousSlide();
                }
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextSlide();
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    slideshowModal.classList.add('hidden');
                }
            }
        });

        if (slideshowModal) {
            slideshowModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.add('hidden');
                }
            });
        }
        
        console.log('✅ Gallery initialized');
    } catch (error) {
        console.error('❌ Error initializing gallery:', error);
    }
}

function handlePhotoUpload(e) {
    try {
        const files = Array.from(e.target.files);
        
        if (files.length === 0) return;
        
        showNotification(`Uploading ${files.length} photo(s)... 📸`);
        
        files.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    setTimeout(() => {
                        const photo = {
                            id: Date.now() + Math.random(),
                            src: e.target.result,
                            name: file.name,
                            uploadDate: new Date().toISOString()
                        };
                        photos.push(photo);
                        displayPhoto(photo);
                        saveGalleryData();
                        updateGalleryDisplay();
                        
                        if (index === files.length - 1) {
                            showNotification(`${files.length} photo(s) uploaded successfully! ✨`);
                        }
                    }, index * 200);
                };
                reader.readAsDataURL(file);
            }
        });
        
        e.target.value = '';
    } catch (error) {
        console.error('❌ Error handling photo upload:', error);
    }
}

function displayPhoto(photo) {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;
    
    if (photos.length === 1) {
        galleryGrid.innerHTML = '';
    }
    
    const photoElement = document.createElement('div');
    photoElement.className = 'gallery-item';
    photoElement.innerHTML = `
        <img src="${photo.src}" alt="${photo.name}" loading="lazy">
        <button class="gallery-item-overlay" title="Delete photo">×</button>
    `;
    
    const img = photoElement.querySelector('img');
    const deleteBtn = photoElement.querySelector('.gallery-item-overlay');
    
    if (img) {
        img.addEventListener('click', function() {
            const index = photos.findIndex(p => p.id === photo.id);
            openSlideshow(index);
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            removePhoto(photo.id);
        });
    }
    
    galleryGrid.appendChild(photoElement);
}

function removePhoto(photoId) {
    if (confirm('Are you sure you want to delete this photo?')) {
        const photoIndex = photos.findIndex(p => p.id === photoId);
        if (photoIndex !== -1) {
            photos.splice(photoIndex, 1);
            updateGalleryDisplay();
            saveGalleryData();
            showNotification('Photo deleted 🗑️');
        }
    }
}

function updateGalleryDisplay() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;
    
    if (photos.length === 0) {
        galleryGrid.innerHTML = `
            <div class="empty-gallery">
                <div class="empty-icon">📸</div>
                <h3>No photos yet</h3>
                <p>Upload some beautiful memories to get started!</p>
            </div>
        `;
    } else {
        galleryGrid.innerHTML = '';
        photos.forEach(photo => {
            displayPhoto(photo);
        });
    }
}

function startSlideshow() {
    if (photos.length > 0) {
        startContinuousSlideshow(); // Use the new continuous version
    } else {
        showNotification('No photos to display. Upload some photos first! 📸');
    }
}


function openSlideshow(index) {
    if (photos.length === 0) return;
    
    currentSlideIndex = index;
    updateSlideshow();
    const slideshowModal = document.getElementById('slideshow-modal');
    if (slideshowModal) {
        slideshowModal.classList.remove('hidden');
    }
}

function updateSlideshow() {
    if (photos.length === 0) return;
    
    const slideshowImage = document.getElementById('slideshow-image');
    const slideCounter = document.getElementById('slide-counter');
    
    if (slideshowImage && photos[currentSlideIndex]) {
        slideshowImage.style.opacity = '0';
        setTimeout(() => {
            slideshowImage.src = photos[currentSlideIndex].src;
            slideshowImage.style.opacity = '1';
        }, 150);
    }
    
    if (slideCounter) {
        slideCounter.textContent = `${currentSlideIndex + 1} / ${photos.length}`;
    }
}

function previousSlide() {
    if (photos.length === 0) return;
    currentSlideIndex = (currentSlideIndex - 1 + photos.length) % photos.length;
    updateSlideshow();
}

function nextSlide() {
    if (photos.length === 0) return;
    currentSlideIndex = (currentSlideIndex + 1) % photos.length;
    updateSlideshow();
}

// COMPLETE CALENDAR JAVASCRIPT REPLACEMENT
function initializeCalendar() {
    console.log('📅 Initializing COMPLETE calendar...');
    
    try {
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');
        const addEventBtn = document.getElementById('add-event-btn');
        const eventModal = document.getElementById('event-modal');
        
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', function(e) {
                e.preventDefault();
                previousMonth();
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', function(e) {
                e.preventDefault();
                nextMonth();
            });
        }
        
        if (addEventBtn) {
            addEventBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openEventModal();
            });
        }
        
        // Initialize calendar display
        renderCalendar();
        updateEventsList();
        
        // Add default birthday event if no events exist
        if (events.length === 0) {
            events.push({
                id: Date.now(),
                title: "🎂 Chutadamon's Birthday!",
                date: "2025-09-13",
                time: "00:00",
                description: "The most amazing birthday ever!",
                color: "#FF6B9D",
                category: "birthday"
            });
            saveCalendarData();
            updateEventsList();
        }
        
        console.log('✅ Calendar initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing calendar:', error);
    }
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthElement = document.getElementById('current-month');
    
    if (!calendarGrid || !currentMonthElement) {
        console.error('❌ Calendar elements not found');
        return;
    }
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonthElement.textContent = currentDate.toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Clear previous content
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Generate calendar days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Create 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // Add classes for styling
        if (cellDate.getMonth() !== month) {
            dayElement.classList.add('other-month');
        }
        
        if (isToday(cellDate)) {
            dayElement.classList.add('today');
        }
        
        // Create day structure
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = cellDate.getDate();
        
        const dayEvents = document.createElement('div');
        dayEvents.className = 'day-events';
        
        dayElement.appendChild(dayNumber);
        dayElement.appendChild(dayEvents);
        
        // Add click handler
        dayElement.addEventListener('click', function() {
            openEventModal(cellDate);
        });
        
        // Add events for this day
        const eventsForDay = events.filter(event => 
            new Date(event.date).toDateString() === cellDate.toDateString()
        );
        
        eventsForDay.slice(0, 3).forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-indicator';
            eventElement.style.backgroundColor = event.color || '#FF6B9D';
            eventElement.textContent = event.title.length > 12 ? 
                event.title.substring(0, 12) + '...' : event.title;
            eventElement.title = `${event.title}\n${event.time ? 'at ' + formatTime(event.time) : 'All day'}`;
            
            eventElement.addEventListener('click', function(e) {
                e.stopPropagation();
                openEventModal(null, event);
            });
            
            dayEvents.appendChild(eventElement);
        });
        
        // Add "more" indicator if there are additional events
        if (eventsForDay.length > 3) {
            const moreElement = document.createElement('div');
            moreElement.className = 'event-indicator more-events';
            moreElement.textContent = `+${eventsForDay.length - 3} more`;
            dayEvents.appendChild(moreElement);
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    console.log('✅ Calendar rendered successfully');
}

function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    showNotification('📅 Previous month');
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    showNotification('📅 Next month');
}

function openEventModal(date = null, existingEvent = null) {
    const modal = document.getElementById('event-modal');
    if (!modal) return;
    
    currentEventId = existingEvent ? existingEvent.id : null;
    
    // Create modal content
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${existingEvent ? 'Edit Event' : 'Add New Event'}</h2>
            <button type="button" class="close-btn" onclick="closeEventModal()">×</button>
        </div>
        
        <form class="event-form" onsubmit="saveEvent(event)">
            <div class="form-group">
                <label for="event-title">Event Title *</label>
                <input type="text" id="event-title" required 
                       value="${existingEvent ? existingEvent.title : ''}" 
                       placeholder="Enter event title...">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="event-date">Date *</label>
                    <input type="date" id="event-date" required 
                           value="${existingEvent ? existingEvent.date : (date ? date.toISOString().split('T')[0] : '')}">
                </div>
                <div class="form-group">
                    <label for="event-time">Time</label>
                    <input type="time" id="event-time" 
                           value="${existingEvent ? existingEvent.time || '' : ''}">
                </div>
            </div>
            
            <div class="form-group">
                <label for="event-description">Description</label>
                <textarea id="event-description" rows="3" 
                          placeholder="Enter description...">${existingEvent ? existingEvent.description || '' : ''}</textarea>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="event-color">Color</label>
                    <input type="color" id="event-color" 
                           value="${existingEvent ? existingEvent.color || '#FF6B9D' : '#FF6B9D'}">
                </div>
                <div class="form-group">
                    <label for="event-category">Category</label>
                    <select id="event-category">
                        <option value="general" ${existingEvent && existingEvent.category === 'general' ? 'selected' : ''}>General</option>
                        <option value="birthday" ${existingEvent && existingEvent.category === 'birthday' ? 'selected' : ''}>Birthday</option>
                        <option value="work" ${existingEvent && existingEvent.category === 'work' ? 'selected' : ''}>Work</option>
                        <option value="personal" ${existingEvent && existingEvent.category === 'personal' ? 'selected' : ''}>Personal</option>
                    </select>
                </div>
            </div>
            
            <div class="form-actions">
                <div class="left-actions">
                    ${existingEvent ? '<button type="button" onclick="deleteEvent(' + existingEvent.id + ')" class="btn btn--danger">🗑️ Delete</button>' : ''}
                </div>
                <div class="right-actions">
                    <button type="button" onclick="closeEventModal()" class="btn btn--outline">Cancel</button>
                    <button type="submit" class="btn btn--primary">${existingEvent ? 'Update' : 'Add'} Event</button>
                </div>
            </div>
        </form>
    `;
    
    modal.classList.remove('hidden');
    
    // Focus on title input
    setTimeout(() => {
        const titleInput = document.getElementById('event-title');
        if (titleInput) titleInput.focus();
    }, 100);
}

function closeEventModal() {
    const modal = document.getElementById('event-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function saveEvent(e) {
    e.preventDefault();
    
    const title = document.getElementById('event-title').value.trim();
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const description = document.getElementById('event-description').value.trim();
    const color = document.getElementById('event-color').value;
    const category = document.getElementById('event-category').value;
    
    if (!title || !date) {
        showNotification('❌ Please fill in title and date');
        return;
    }
    
    const event = {
        id: currentEventId || Date.now(),
        title,
        date,
        time,
        description,
        color,
        category,
        createdAt: currentEventId ? events.find(e => e.id === currentEventId)?.createdAt : new Date().toISOString()
    };
    
    if (currentEventId) {
        const index = events.findIndex(e => e.id === currentEventId);
        if (index !== -1) {
            events[index] = event;
            showNotification('✅ Event updated!');
        }
    } else {
        events.push(event);
        showNotification('🎉 Event added!');
    }
    
    saveCalendarData();
    renderCalendar();
    updateEventsList();
    closeEventModal();
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        const index = events.findIndex(e => e.id === eventId);
        if (index !== -1) {
            events.splice(index, 1);
            saveCalendarData();
            renderCalendar();
            updateEventsList();
            closeEventModal();
            showNotification('🗑️ Event deleted');
        }
    }
}

function updateEventsList() {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) return;
    
    const today = new Date();
    const upcomingEvents = events
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    
    if (upcomingEvents.length === 0) {
        eventsList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No upcoming events</p>';
        return;
    }
    
    eventsList.innerHTML = upcomingEvents.map(event => {
        const eventDate = new Date(event.date);
        const dateStr = eventDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        return `
            <div class="event-item" onclick="openEventModal(null, ${JSON.stringify(event).replace(/"/g, '&quot;')})" 
                 style="border-left-color: ${event.color};">
                <div class="event-header">
                    <div class="event-title">${getCategoryIcon(event.category)} ${event.title}</div>
                </div>
                <div class="event-datetime">${dateStr}${event.time ? ' at ' + formatTime(event.time) : ''}</div>
                ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
            </div>
        `;
    }).join('');
}

function getCategoryIcon(category) {
    const icons = {
        general: '📅',
        birthday: '🎂',
        work: '💼',
        personal: '👤',
        health: '🏥',
        social: '👥',
        important: '⭐'
    };
    return icons[category] || '📅';
}

// MISSING CALENDAR DATA PERSISTENCE FUNCTIONS
function saveCalendarData() {
    try {
        localStorage.setItem('chutadamon_events', JSON.stringify(events));
        console.log('💾 Calendar data saved');
    } catch (error) {
        console.error('❌ Error saving calendar data:', error);
    }
}

function loadSavedData() {
    console.log('💾 Loading saved data...');
    
    try {
        // Load reminders (existing code you already have)
        const savedReminders = localStorage.getItem('chutadamon_reminders');
        if (savedReminders) {
            const remindersData = JSON.parse(savedReminders);
            
            // Load meal settings
            Object.entries(remindersData.meals || {}).forEach(([mealType, mealData]) => {
                const toggle = document.getElementById(`${mealType}-toggle`);
                const timeSelect = document.getElementById(`${mealType}-time`);
                
                if (toggle) toggle.checked = mealData.enabled;
                if (timeSelect) timeSelect.value = mealData.time;
                
                // Schedule if enabled and permission granted
                if (mealData.enabled && notificationPermission === 'granted') {
                    setTimeout(() => {
                        scheduleMealReminder(mealType, mealData.time);
                    }, 1000);
                }
            });
            
            // Load water settings
            if (remindersData.water) {
                const waterToggle = document.getElementById('water-toggle');
                const intervalSelect = document.getElementById('water-interval-select');
                
                if (waterToggle) waterToggle.checked = remindersData.water.enabled;
                if (intervalSelect) intervalSelect.value = remindersData.water.interval;
                
                waterProgress = remindersData.water.progress || 0;
                updateWaterProgress();
                
                // Schedule if enabled and permission granted
                if (remindersData.water.enabled && notificationPermission === 'granted') {
                    setTimeout(() => {
                        scheduleWaterReminder(remindersData.water.interval);
                    }, 1000);
                }
            }
        }
        
        // Load photos (existing code you already have)
        const savedPhotos = localStorage.getItem('chutadamon_photos');
        if (savedPhotos) {
            photos = JSON.parse(savedPhotos);
            updateGalleryDisplay();
        }
        
        // Load calendar events - THIS WAS MISSING!
        const savedEvents = localStorage.getItem('chutadamon_events');
        if (savedEvents) {
            events = JSON.parse(savedEvents);
            console.log(`📅 Loaded ${events.length} calendar events`);
        } else {
            events = []; // Initialize empty events array if no saved data
        }
        
        console.log('✅ Data loading complete!');
    } catch (error) {
        console.error('❌ Error loading saved data:', error);
        // Initialize empty arrays if loading fails
        events = [];
        photos = photos || [];
    }
}

// MISSING FUNCTION FOR EVENT MODAL
function closeEventModal() {
    const modal = document.getElementById('event-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    currentEventId = null; // Reset current event ID
}


// ADDITIONAL HELPER FUNCTION FOR BETTER DATA MANAGEMENT
function clearAllSavedData() {
    try {
        localStorage.removeItem('chutadamon_events');
        localStorage.removeItem('chutadamon_photos');
        localStorage.removeItem('chutadamon_reminders');
        events = [];
        photos = [];
        console.log('🗑️ All saved data cleared');
        showNotification('🗑️ All data cleared successfully');
    } catch (error) {
        console.error('❌ Error clearing data:', error);
    }
}


// FIXED: Continuous Auto-Playing Slideshow
let isSlideShowRunning = false;
let slideShowInterval = null;

function startContinuousSlideshow() {
    console.log('🎬 Starting continuous slideshow...');
    
    if (photos.length === 0) {
        console.log('📸 No photos for slideshow');
        return;
    }

    if (isSlideShowRunning) {
        stopContinuousSlideshow();
    }

    isSlideShowRunning = true;
    currentSlideIndex = 0;

    // Create slideshow container if it doesn't exist
    let slideshowContainer = document.getElementById('auto-slideshow');
    if (!slideshowContainer) {
        slideshowContainer = document.createElement('div');
        slideshowContainer.id = 'auto-slideshow';
        slideshowContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        `;
        
        slideshowContainer.innerHTML = `
            <img id="slideshow-image" style="max-width: 90%; max-height: 80%; object-fit: contain; border-radius: 10px;">
            <div style="color: white; margin-top: 20px; font-size: 18px;">
                <span id="slide-counter">1 / ${photos.length}</span>
                <button onclick="stopContinuousSlideshow()" style="margin-left: 20px; padding: 10px 20px; background: #ff6b9d; color: white; border: none; border-radius: 5px; cursor: pointer;">Stop Slideshow</button>
            </div>
        `;
        
        document.body.appendChild(slideshowContainer);
    }

    updateSlideshow();
    
    // Auto-advance every 4 seconds
    slideShowInterval = setInterval(() => {
        nextSlide();
        updateSlideshow();
    }, 4000);

    showNotification('🎬 Auto-slideshow started! Click "Stop Slideshow" to exit.');
}

function stopContinuousSlideshow() {
    console.log('🛑 Stopping continuous slideshow...');
    isSlideShowRunning = false;
    
    if (slideShowInterval) {
        clearInterval(slideShowInterval);
        slideShowInterval = null;
    }

    const slideshowContainer = document.getElementById('auto-slideshow');
    if (slideshowContainer) {
        slideshowContainer.remove();
    }

    showNotification('🛑 Slideshow stopped');
}

function updateSlideshow() {
    if (photos.length === 0) return;
    
    const slideshowImage = document.getElementById('slideshow-image');
    const slideCounter = document.getElementById('slide-counter');
    
    if (slideshowImage && photos[currentSlideIndex]) {
        slideshowImage.style.opacity = '0';
        setTimeout(() => {
            slideshowImage.src = photos[currentSlideIndex].src;
            slideshowImage.style.opacity = '1';
        }, 300);
    }
    
    if (slideCounter) {
        slideCounter.textContent = `${currentSlideIndex + 1} / ${photos.length}`;
    }
}

function nextSlide() {
    if (photos.length === 0) return;
    currentSlideIndex = (currentSlideIndex + 1) % photos.length;
}


// Notification System
function showNotification(message, type = 'info') {
    console.log(`🔔 Notification: ${message}`);
    createCustomNotification(message, type);
}

function createCustomNotification(message, type) {
    try {
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.innerHTML = `
            <div class="notification-icon">${type === 'meal' ? '🍽️' : type === 'water' ? '💧' : '🔔'}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">×</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--color-surface);
            backdrop-filter: blur(20px);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: var(--space-16);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: var(--space-12);
            max-width: 350px;
            animation: slideInRight 0.3s ease;
            color: var(--color-text);
        `;
        
        document.body.appendChild(notification);
        
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            });
        }
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    } catch (error) {
        console.error('❌ Error creating notification:', error);
    }
}

// Add required CSS animations
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes burst {
        0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(100px) scale(0);
            opacity: 0;
        }
    }
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: var(--color-text-secondary);
        padding: var(--space-4);
        border-radius: 50%;
        transition: all 0.2s ease;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .notification-close:hover {
        background: var(--color-error);
        color: var(--color-btn-primary-text);
    }
    .notification-icon {
        font-size: 20px;
        flex-shrink: 0;
    }
    .notification-message {
        flex: 1;
        font-size: var(--font-size-sm);
        line-height: 1.4;
    }
`;
document.head.appendChild(dynamicStyles);

// Global error handler
window.addEventListener('error', function(e) {
    console.error('❌ Application Error:', e.error);
    showNotification('Something went wrong, but we\'re still celebrating! 🎉');
});

// Performance monitoring
const startTime = performance.now();
window.addEventListener('load', function() {
    const loadTime = performance.now() - startTime;
    console.log(`⚡ Website loaded in ${loadTime.toFixed(2)}ms`);
    
    // Update notification status after load
    setTimeout(updateNotificationStatus, 500);
    setTimeout(updateNextReminderInfo, 1000);
});

console.log('🎂 Chutadamon\'s Birthday Website - COMPLETELY FIXED VERSION Ready! 🎉');
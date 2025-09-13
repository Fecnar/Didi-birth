// Enhanced Birthday Website Application - COMPLETE WITH DARKER NAVIGATION
console.log('🎉 Loading Chutadamon\'s Birthday Website - DARK BURGER MENU VERSION...');

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
let reminderTimeouts = {};
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

// PWA variables
let deferredPrompt = null;
let addToHomeBtn = null;

// FIXED: Define Spotify Web Playback SDK callback globally
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

// INITIALIZE THE APPLICATION
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing Chutadamon\'s Birthday Website with DARK NAVIGATION...');
  
  try {
    // Initialize all modules
    initializeNotificationSystem();
    initializeThemeToggle();
    initializeNavigation(); // ✨ ENHANCED DARK NAVIGATION
    initializeCountdowns();
    initializeReminders();
    initializeGallery();
    initializeSpotify();
    initializeCalendar();
    initializeAddToHome();
    loadSavedData();
    
    console.log('✨ Website fully loaded with DARK BURGER MENU!');
    
    // Show welcome notification
    setTimeout(() => {
      showNotification('🎉 Happy Birthday Chutadamon! Your special website is ready!');
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error during initialization:', error);
    showNotification('Something went wrong, but we\'re still celebrating! 🎉');
  }
});

// ========================================
// ENHANCED DARK NAVIGATION SYSTEM - COMPLETE
// ========================================

function initializeNavigation() {
  console.log('🧭 Initializing ENHANCED DARK NAVIGATION...');
  
  try {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    console.log('Navigation elements found:', {
      navToggle: !!navToggle,
      navMenu: !!navMenu,
      navLinks: navLinks.length
    });
    
    // Enhanced Mobile Menu Toggle with accessibility
    if (navToggle && navMenu) {
      // Set initial ARIA attributes
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-controls', 'nav-menu');
      navToggle.setAttribute('aria-label', 'Toggle navigation menu');
      navMenu.setAttribute('aria-hidden', 'true');
      navMenu.id = 'nav-menu';
      
      navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('📱 DARK Nav toggle clicked');
        
        const isActive = navMenu.classList.contains('active');
        
        // Toggle classes
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Update ARIA attributes
        navToggle.setAttribute('aria-expanded', !isActive);
        navMenu.setAttribute('aria-hidden', isActive);
        
        // Toggle body scroll lock for dark overlay
        if (!isActive) {
          body.classList.add('menu-open');
          console.log('🌑 Dark menu opened - scroll locked');
        } else {
          body.classList.remove('menu-open');
          console.log('🌑 Dark menu closed - scroll unlocked');
        }
        
        // Add haptic feedback on mobile
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        
        console.log('Dark menu active:', !isActive);
      });
      
      console.log('✅ Enhanced DARK mobile menu toggle initialized');
    } else {
      console.error('❌ Nav toggle or nav menu not found!');
    }
    
    // Enhanced Navigation Links with dark menu handling
    if (navLinks.length > 0) {
      navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          console.log(`🔗 DARK Nav link ${index} clicked:`, href);
          
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
              
              // Close dark mobile menu with animation
              closeNavigationMenu();
              
              // Show success feedback
              showNotification(`📱 Navigated to ${targetId.charAt(0).toUpperCase() + targetId.slice(1)}`);
              
              // Add navigation effect
              createNavigationEffect(this);
              
            } else {
              console.error('❌ Navigation failed for section:', targetId);
              showNotification('❌ Navigation failed');
            }
          }
        });
      });
      
      console.log('✅ Enhanced DARK navigation links initialized:', navLinks.length);
    } else {
      console.error('❌ No navigation links found');
    }
    
    // Close dark menu when clicking outside
    document.addEventListener('click', function(e) {
      const navMenu = document.querySelector('.nav-menu');
      const navToggle = document.querySelector('.nav-toggle');
      
      if (navMenu && navMenu.classList.contains('active') &&
          !navMenu.contains(e.target) && 
          !navToggle.contains(e.target)) {
        console.log('🌑 Clicking outside - closing dark menu');
        closeNavigationMenu();
      }
    });
    
    // Close dark menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
          console.log('⌨️ Escape pressed - closing dark menu');
          closeNavigationMenu();
        }
      }
    });
    
    // Initialize all sections as hidden except home
    const allSections = document.querySelectorAll('.section');
    console.log('📄 Found sections:', allSections.length);
    
    allSections.forEach((section, index) => {
      console.log(`Section ${index}: ${section.id}`);
      if (section.id !== 'home') {
        section.classList.remove('active');
      }
    });
    
    console.log('✅ ENHANCED DARK NAVIGATION completely initialized');
    
  } catch (error) {
    console.error('❌ Error initializing dark navigation:', error);
  }
}

// Enhanced function to close dark navigation menu
function closeNavigationMenu() {
  const navMenu = document.querySelector('.nav-menu');
  const navToggle = document.querySelector('.nav-toggle');
  const body = document.body;
  
  if (navMenu && navToggle) {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    
    // Update ARIA attributes
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    
    // Remove body scroll lock
    body.classList.remove('menu-open');
    
    console.log('🌑 Dark navigation menu closed with all effects');
  }
}

// Enhanced navigation effect with dark theme support
function createNavigationEffect(element) {
  element.style.transform = 'scale(0.95)';
  element.style.transition = 'transform 0.2s ease';
  element.style.background = 'rgba(255, 107, 157, 0.1)'; // Pink glow effect
  
  setTimeout(() => {
    element.style.transform = '';
    element.style.background = '';
  }, 200);
}

function switchSection(sectionId) {
  console.log(`🎯 ENHANCED: Switching to section: ${sectionId}`);
  
  try {
    // Find target section
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
      console.error(`❌ Target section not found: ${sectionId}`);
      return false;
    }
    
    // Hide ALL sections first with fade out
    const allSections = document.querySelectorAll('.section');
    console.log(`📄 Found ${allSections.length} sections to manage`);
    
    allSections.forEach(section => {
      if (section.classList.contains('active')) {
        console.log(`❌ Hiding section: ${section.id}`);
        section.classList.remove('active');
      }
    });
    
    // Show target section with fade in
    setTimeout(() => {
      targetSection.classList.add('active');
      console.log(`✅ Showing section: ${sectionId}`);
      
      // Trigger section-specific initialization
      setTimeout(() => {
        initializeSectionSpecific(sectionId);
      }, 100);
    }, 50);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error switching sections:', error);
    return false;
  }
}

function initializeSectionSpecific(sectionId) {
  console.log(`🎬 Initializing section: ${sectionId}`);
  
  switch(sectionId) {
    case 'home':
      if (typeof startCountdown === 'function' && !countdownInterval) {
        startCountdown();
      }
      break;
    case 'gallery':
      if (typeof updateGalleryDisplay === 'function') {
        updateGalleryDisplay();
      }
      break;
    case 'calendar':
      if (typeof renderCalendar === 'function') {
        renderCalendar();
      }
      if (typeof updateEventsList === 'function') {
        updateEventsList();
      }
      break;
    case 'spotify':
      if (typeof checkSpotifyAuth === 'function') {
        checkSpotifyAuth();
      }
      break;
    case 'reminders':
      if (typeof updateNotificationStatus === 'function') {
        updateNotificationStatus();
      }
      if (typeof updateNextReminderInfo === 'function') {
        updateNextReminderInfo();
      }
      break;
  }
}

// ========================================
// ADD TO HOME SCREEN FUNCTIONALITY
// ========================================

function initializeAddToHome() {
  console.log('📱 Initializing Add to Home Screen functionality...');
  addToHomeBtn = document.getElementById('add-to-home');
  if (addToHomeBtn) {
    addToHomeBtn.style.display = 'none';
    addToHomeBtn.addEventListener('click', handleAddToHomeClick);
    console.log('✅ Add to Home button initialized');
  }
}

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('📱 Install prompt available');
  e.preventDefault();
  deferredPrompt = e;
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
    showAddToHomeInstructions();
    return;
  }
  
  try {
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
      showNotification('🎉 App installed successfully!');
      if (addToHomeBtn) {
        addToHomeBtn.style.display = 'none';
      }
    } else {
      console.log('❌ User dismissed the install prompt');
      showNotification('📱 You can install this app anytime from the menu');
    }
    
    deferredPrompt = null;
  } catch (error) {
    console.error('❌ Error showing install prompt:', error);
    showAddToHomeInstructions();
  }
}

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

window.addEventListener('appinstalled', (e) => {
  console.log('✅ App successfully installed');
  showNotification('🎉 Birthday website installed! Check your home screen!');
  if (addToHomeBtn) {
    addToHomeBtn.style.display = 'none';
  }
});

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function initializeNotificationSystem() {
  console.log('🔔 Initializing notification system...');
  try {
    updateNotificationStatus();
    
    if (notificationSupported && notificationPermission !== 'granted') {
      setTimeout(() => {
        showNotificationBanner();
      }, 2000);
    }
    
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

// ========================================
// THEME TOGGLE
// ========================================

function initializeThemeToggle() {
  console.log('🌓 Initializing theme toggle...');
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

// ========================================
// COUNTDOWN FUNCTIONS
// ========================================

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

// ========================================
// NOTIFICATION HELPER FUNCTIONS
// ========================================

function showNotification(message, type = 'info') {
  console.log(`🔔 Notification: ${message}`);
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'custom-notification';
  notification.innerHTML = `
    <span class="notification-icon">${getNotificationIcon(type)}</span>
    <span class="notification-message">${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    }
  }, 4000);
}

function getNotificationIcon(type) {
  const icons = {
    info: 'ℹ️',
    success: '✅', 
    warning: '⚠️',
    error: '❌'
  };
  return icons[type] || icons.info;
}

// ========================================
// STUB FUNCTIONS FOR OTHER FEATURES
// ========================================

function initializeReminders() { 
  console.log('⏰ Reminders system initialized (stub)');
}

function initializeGallery() { 
  console.log('📸 Gallery system initialized (stub)');
  // Initialize photo input
  const photoInput = document.getElementById('photo-input');
  const addPhotosBtn = document.getElementById('add-photos-btn');
  
  if (addPhotosBtn && photoInput) {
    addPhotosBtn.addEventListener('click', () => {
      photoInput.click();
    });
  }
}

function initializeSpotify() { 
  console.log('🎵 Spotify system initialized (stub)');
  // Basic Spotify login button
  const loginBtn = document.getElementById('spotify-login');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      showNotification('🎵 Spotify integration coming soon!');
    });
  }
}

function initializeCalendar() { 
  console.log('📅 Calendar system initialized (stub)');
  // Basic calendar functionality
  const addEventBtn = document.getElementById('add-event-btn');
  if (addEventBtn) {
    addEventBtn.addEventListener('click', () => {
      showNotification('📅 Calendar features coming soon!');
    });
  }
}

function loadSavedData() { 
  console.log('💾 Loading saved data (stub)');
}

// ========================================
// ENHANCED CSS ANIMATIONS
// ========================================

// Add CSS for burst animation
const style = document.createElement('style');
style.textContent = `
  @keyframes burst {
    0% {
      transform: translateX(0) translateY(0) rotate(0deg) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateX(var(--dx, 100px)) translateY(var(--dy, -100px)) rotate(360deg) scale(0);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

console.log('🎂 Birthday Website with ENHANCED DARK NAVIGATION ready! 🌑✨');
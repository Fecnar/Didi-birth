// Enhanced Birthday Website Application - FULL SPOTIFY INTEGRATION
console.log('🎉 Loading Chutadamon\'s Birthday Website with Full Spotify Integration...');

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
        redirectUri: window.location.origin,
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
    themes: {
        light: {
            primary: "#E91E63",
            secondary: "#FF9800",
            background: "linear-gradient(135deg, #FF6B9D 0%, #FFA726 100%)",
            cardBg: "#ffffff",
            textPrimary: "#1a237e",
            textSecondary: "#424242",
            accent: "#9C27B0"
        },
        dark: {
            primary: "#ff0080",
            secondary: "#00d4ff",
            background: "linear-gradient(135deg, #0d1b2a 0%, #6A0572 100%)",
            cardBg: "#2c3e50",
            textPrimary: "#ecf0f1",
            textSecondary: "#bdc3c7",
            accent: "#ffff00"
        }
    },
    mealTypes: [
        {id: "breakfast", name: "Breakfast", icon: "🍳", defaultTime: "08:00"},
        {id: "lunch", name: "Lunch", icon: "🥗", defaultTime: "13:00"},
        {id: "dinner", name: "Dinner", icon: "🍽️", defaultTime: "19:00"},
        {id: "snack", name: "Snack", icon: "🍎", defaultTime: "15:30"}
    ],
    eventCategories: [
        {name: "Birthday", color: "#FF6B9D", icon: "🎂"},
        {name: "Meeting", color: "#2196F3", icon: "💼"},
        {name: "Personal", color: "#4CAF50", icon: "👤"},
        {name: "Health", color: "#FF5722", icon: "🏥"},
        {name: "Fun", color: "#9C27B0", icon: "🎉"},
        {name: "Work", color: "#607D8B", icon: "💻"},
        {name: "Travel", color: "#FF9800", icon: "✈️"},
        {name: "Family", color: "#E91E63", icon: "👨‍👩‍👧‍👦"}
    ]
};

// Global variables
let currentSlideIndex = 0;
let photos = [];
let events = [];
let currentDate = new Date();
let currentEventId = null;
let currentTheme = 'light';
let waterProgress = 0;
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
let repeatMode = 'off'; // 'off', 'track', 'context'
let currentVolume = 0.5;

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Chutadamon\'s Birthday Website...');
    
    try {
        // Initialize all modules with error handling
        initializeThemeToggle();
        initializeNavigation();
        initializeCountdowns();
        initializeReminders();
        initializeGallery();
        initializeSpotify();
        initializeCalendar();
        loadSavedData();
        
        console.log('✨ Website fully loaded and ready to celebrate!');
        
        // Show initial notification
        setTimeout(() => {
            showNotification('🎉 Happy Birthday Chutadamon! Your special website is ready!');
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error during initialization:', error);
        showNotification('Something went wrong, but we\'re still celebrating! 🎉');
    }
});

// Theme Toggle Functions - FIXED
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
                console.log('Theme toggle clicked');
                
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
                
                createCelebrationBurst(this);
                showNotification(`Switched to ${newTheme} mode! ✨`);
            });
            console.log('✅ Theme toggle initialized');
        }
    } catch (error) {
        console.error('❌ Error initializing theme toggle:', error);
    }
}

function setTheme(theme) {
    console.log(`🎨 Setting theme to: ${theme}`);
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
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

// Navigation Functions - COMPLETELY FIXED
function initializeNavigation() {
    console.log('🧭 Initializing navigation...');
    
    try {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        console.log('Found nav elements:', {
            navToggle: !!navToggle,
            navMenu: !!navMenu,
            navLinks: navLinks.length
        });

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Nav toggle clicked');
                
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
            console.log('✅ Mobile menu toggle initialized');
        }

        // Navigation links - FIXED
        if (navLinks.length > 0) {
            navLinks.forEach((link, index) => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const href = this.getAttribute('href');
                    console.log(`Nav link ${index} clicked:`, href);
                    
                    if (href && href.startsWith('#')) {
                        const targetId = href.substring(1);
                        console.log('Switching to section:', targetId);
                        
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
                            showNotification(`Navigated to ${targetId.charAt(0).toUpperCase() + targetId.slice(1)} 📱`);
                        } else {
                            console.error('❌ Navigation failed for section:', targetId);
                        }
                    }
                });
            });
            console.log('✅ Navigation links initialized:', navLinks.length);
        }
        
        console.log('✅ Navigation fully initialized');
    } catch (error) {
        console.error('❌ Error initializing navigation:', error);
    }
}

function switchSection(sectionId) {
    console.log(`📱 Attempting to switch to section: ${sectionId}`);
    
    try {
        // Find target section first
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) {
            console.error(`❌ Target section not found: ${sectionId}`);
            return false;
        }
        
        // Hide all sections
        const allSections = document.querySelectorAll('.section');
        console.log('Found sections:', allSections.length);
        
        allSections.forEach(section => {
            if (section.classList.contains('active')) {
                console.log('Hiding active section:', section.id);
                section.classList.remove('active');
            }
        });
        
        // Show target section
        targetSection.classList.add('active');
        console.log(`✅ Successfully switched to section: ${sectionId}`);
        
        // Trigger section-specific functionality
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

// Reminders Functions
function initializeReminders() {
    console.log('🔔 Initializing reminders...');
    
    try {
        appData.mealTypes.forEach(meal => {
            const toggle = document.getElementById(`${meal.id}-toggle`);
            const timeSelect = document.getElementById(`${meal.id}-time`);
            
            if (toggle) {
                toggle.addEventListener('change', function() {
                    const time = timeSelect ? timeSelect.value : meal.defaultTime;
                    handleMealToggle(meal.id, this.checked, time);
                    showNotification(`${meal.name} reminder ${this.checked ? 'enabled' : 'disabled'} ${meal.icon}`);
                });
            }
            
            if (timeSelect) {
                timeSelect.addEventListener('change', function() {
                    if (toggle && toggle.checked) {
                        handleMealToggle(meal.id, true, this.value);
                        showNotification(`${meal.name} time updated to ${formatTime(this.value)} ⏰`);
                    }
                    saveRemindersData();
                });
            }
        });
        
        const waterToggle = document.getElementById('water-toggle');
        const waterIntervalSelect = document.getElementById('water-interval-select');
        
        if (waterToggle) {
            waterToggle.addEventListener('change', function() {
                handleWaterToggle(this.checked);
                showNotification(`Water reminders ${this.checked ? 'enabled' : 'disabled'} 💧`);
            });
        }
        
        if (waterIntervalSelect) {
            waterIntervalSelect.addEventListener('change', function() {
                if (waterToggle && waterToggle.checked) {
                    handleWaterToggle(true);
                }
                saveRemindersData();
            });
        }
        
        const customMealBtn = document.getElementById('add-custom-meal');
        if (customMealBtn) {
            customMealBtn.addEventListener('click', function(e) {
                e.preventDefault();
                addCustomMeal();
            });
        }
        
        updateWaterProgress();
        console.log('✅ Reminders initialized');
    } catch (error) {
        console.error('❌ Error initializing reminders:', error);
    }
}

function handleMealToggle(mealId, enabled, time) {
    try {
        if (enabled) {
            scheduleMealReminder(mealId, time);
        } else {
            clearMealReminder(mealId);
        }
        saveRemindersData();
    } catch (error) {
        console.error('❌ Error handling meal toggle:', error);
    }
}

function handleWaterToggle(enabled) {
    try {
        const intervalSelect = document.getElementById('water-interval-select');
        const interval = intervalSelect ? intervalSelect.value : '60';
        
        if (enabled) {
            scheduleWaterReminder(interval);
        } else {
            clearWaterReminder();
        }
        saveRemindersData();
    } catch (error) {
        console.error('❌ Error handling water toggle:', error);
    }
}

function scheduleMealReminder(mealId, time) {
    clearMealReminder(mealId);
    reminderIntervals[mealId] = setTimeout(() => {
        showNotification(`🍽️ Time for ${mealId}! Don't forget to eat well.`);
    }, 2000);
}

function scheduleWaterReminder(intervalMinutes) {
    clearWaterReminder();
    const intervalMs = parseInt(intervalMinutes) * 60 * 1000;
    
    reminderIntervals.water = setInterval(() => {
        showNotification('💧 Time to drink some water! Stay hydrated!');
        waterProgress = Math.min(waterProgress + 12.5, 100);
        updateWaterProgress();
    }, intervalMs);
}

function clearMealReminder(mealId) {
    if (reminderIntervals[mealId]) {
        clearTimeout(reminderIntervals[mealId]);
        clearInterval(reminderIntervals[mealId]);
        delete reminderIntervals[mealId];
    }
}

function clearWaterReminder() {
    if (reminderIntervals.water) {
        clearInterval(reminderIntervals.water);
        delete reminderIntervals.water;
    }
}

function updateWaterProgress() {
    const progressCircle = document.querySelector('.progress-ring-circle');
    const progressText = document.querySelector('.progress-text');
    
    if (progressCircle && progressText) {
        const circumference = 2 * Math.PI * 36;
        const offset = circumference - (waterProgress / 100) * circumference;
        
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = offset;
        progressText.textContent = `${Math.round(waterProgress)}%`;
    }
}

function addCustomMeal() {
    try {
        const mealName = prompt("Enter meal name:");
        if (!mealName || mealName.trim() === '') return;
        
        const mealTime = prompt("Enter time (HH:MM format, e.g., 14:30):");
        if (!mealTime || !/^\d{2}:\d{2}$/.test(mealTime)) {
            showNotification("Please enter time in HH:MM format (e.g., 14:30)");
            return;
        }
        
        const mealIcon = prompt("Enter an emoji for this meal (e.g., 🥪):") || "🍴";
        
        const mealList = document.getElementById('meal-list');
        if (mealList) {
            const mealId = mealName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
            const mealItem = createCustomMealItem(mealId, mealName.trim(), mealTime, mealIcon);
            mealList.appendChild(mealItem);
            saveRemindersData();
            showNotification(`Custom meal "${mealName}" added successfully! 🎉`);
        }
    } catch (error) {
        console.error('❌ Error adding custom meal:', error);
    }
}

function createCustomMealItem(id, name, time, icon) {
    const mealItem = document.createElement('div');
    mealItem.className = 'meal-item';
    mealItem.innerHTML = `
        <div class="meal-header">
            <div class="meal-icon">${icon}</div>
            <div class="meal-info">
                <span class="meal-name">${name}</span>
                <span class="meal-description">Custom meal reminder</span>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" id="${id}-toggle">
                <span class="slider"></span>
            </label>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <select id="${id}-time" class="form-control meal-time" style="flex: 1;">
                <option value="${time}" selected>${formatTime(time)}</option>
            </select>
            <button class="btn btn--outline remove-meal-btn" type="button" style="padding: 8px 12px; min-width: auto;">🗑️</button>
        </div>
    `;
    
    const toggle = mealItem.querySelector(`#${id}-toggle`);
    const timeSelect = mealItem.querySelector(`#${id}-time`);
    const removeBtn = mealItem.querySelector('.remove-meal-btn');
    
    if (toggle) {
        toggle.addEventListener('change', function() {
            handleMealToggle(id, this.checked, timeSelect.value);
        });
    }
    
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            if (confirm(`Remove "${name}" meal reminder?`)) {
                clearMealReminder(id);
                mealItem.remove();
                saveRemindersData();
                showNotification(`"${name}" meal reminder removed`);
            }
        });
    }
    
    return mealItem;
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
        openSlideshow(0);
        showNotification('Starting slideshow! Use arrow keys to navigate 🎬');
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

// ENHANCED SPOTIFY INTEGRATION FUNCTIONS
function initializeSpotify() {
    console.log('🎵 Initializing comprehensive Spotify integration...');
    
    try {
        // Check if we have a token from redirect
        checkAuthorizationCallback();
        
        // Initialize Spotify authentication
        const loginBtn = document.getElementById('spotify-login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', initiateSpotifyAuth);
        }
        
        const logoutBtn = document.getElementById('spotify-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', spotifyLogout);
        }
        
        // Initialize player controls
        initializePlayerControls();
        
        // Initialize tabs
        initializeSpotifyTabs();
        
        // Initialize search functionality
        initializeSpotifySearch();
        
        // Check if user is already authenticated
        const savedToken = localStorage.getItem('spotify_access_token');
        if (savedToken) {
            spotifyAccessToken = savedToken;
            initializeSpotifyWithToken();
        }
        
        console.log('✅ Spotify integration initialized');
    } catch (error) {
        console.error('❌ Error initializing Spotify:', error);
        showSpotifyError('Failed to initialize Spotify integration');
    }
}

function checkAuthorizationCallback() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const error = params.get('error');
    
    if (error) {
        console.error('Spotify authorization error:', error);
        showSpotifyError('Authorization failed. Please try again.');
        return;
    }
    
    if (accessToken) {
        spotifyAccessToken = accessToken;
        localStorage.setItem('spotify_access_token', accessToken);
        
        // Clear hash from URL
        window.location.hash = '';
        
        // Initialize Spotify with token
        initializeSpotifyWithToken();
        
        showNotification('🎉 Successfully connected to Spotify!');
    }
}

function initiateSpotifyAuth() {
    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${appData.spotifyConfig.clientId}&` +
        `response_type=token&` +
        `redirect_uri=${encodeURIComponent(appData.spotifyConfig.redirectUri)}&` +
        `scope=${encodeURIComponent(appData.spotifyConfig.scopes.join(' '))}`;
    
    showNotification('Redirecting to Spotify for authorization... 🎵');
    window.location.href = authUrl;
}

async function initializeSpotifyWithToken() {
    try {
        showNotification('Initializing Spotify connection... 🎧');
        
        // Get user profile
        const userProfile = await spotifyApiCall('/me');
        if (userProfile) {
            displayUserProfile(userProfile);
            showSpotifyMainSection();
            
            // Initialize Web Playback SDK
            await initializeWebPlayback();
            
            // Load user data
            await loadUserPlaylists();
            await loadLikedSongs();
            
            showNotification('🎉 Spotify fully connected! Enjoy your music!');
        }
    } catch (error) {
        console.error('❌ Error initializing Spotify with token:', error);
        showSpotifyError('Failed to connect to Spotify. Please try again.');
        spotifyLogout();
    }
}

async function spotifyApiCall(endpoint, options = {}) {
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
            // Token expired
            showSpotifyError('Session expired. Please log in again.');
            spotifyLogout();
            return null;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('❌ Spotify API call failed:', error);
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
            spotifyLogout();
        }
        throw error;
    }
}

function displayUserProfile(profile) {
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userFollowers = document.getElementById('user-followers');
    const userCountry = document.getElementById('user-country');
    
    if (userAvatar && profile.images && profile.images.length > 0) {
        userAvatar.src = profile.images[0].url;
    }
    
    if (userName) {
        userName.textContent = profile.display_name || profile.id;
    }
    
    if (userEmail) {
        userEmail.textContent = profile.email || '';
    }
    
    if (userFollowers) {
        userFollowers.textContent = `${profile.followers?.total || 0} followers`;
    }
    
    if (userCountry) {
        userCountry.textContent = profile.country || '-';
    }
}

function showSpotifyMainSection() {
    const authSection = document.getElementById('spotify-auth-section');
    const profileSection = document.getElementById('spotify-profile-section');
    const mainSection = document.getElementById('spotify-main-section');
    const errorSection = document.getElementById('spotify-error');
    
    if (authSection) authSection.classList.add('hidden');
    if (profileSection) profileSection.classList.remove('hidden');
    if (mainSection) mainSection.classList.remove('hidden');
    if (errorSection) errorSection.classList.add('hidden');
}

function showSpotifyError(message) {
    const errorSection = document.getElementById('spotify-error');
    const errorMessage = document.getElementById('error-message');
    const retryBtn = document.getElementById('retry-connection-btn');
    
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    
    if (errorSection) {
        errorSection.classList.remove('hidden');
    }
    
    if (retryBtn) {
        retryBtn.onclick = () => {
            errorSection.classList.add('hidden');
            initiateSpotifyAuth();
        };
    }
    
    showNotification(`⚠️ ${message}`);
}

async function initializeWebPlayback() {
    return new Promise((resolve) => {
        if (window.Spotify) {
            setupSpotifyPlayer();
            resolve();
        } else {
            window.onSpotifyWebPlaybackSDKReady = () => {
                setupSpotifyPlayer();
                resolve();
            };
        }
    });
}

function setupSpotifyPlayer() {
    if (!spotifyAccessToken) return;
    
    spotifyPlayer = new window.Spotify.Player({
        name: 'Chutadamon\'s Birthday Player',
        getOAuthToken: cb => { cb(spotifyAccessToken); },
        volume: currentVolume
    });
    
    // Error handling
    spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize:', message);
        showSpotifyError('Failed to initialize player');
    });

    spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Failed to authenticate:', message);
        spotifyLogout();
    });

    spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account:', message);
        showSpotifyError('Spotify Premium required for playback');
    });

    // Playback status updates
    spotifyPlayer.addListener('player_state_changed', (state) => {
        if (!state) return;
        
        updatePlayerState(state);
    });

    // Ready
    spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        deviceId = device_id;
        updatePlayerStatus('Ready to play');
    });

    // Not ready
    spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        updatePlayerStatus('Player offline');
    });

    // Connect to the player!
    spotifyPlayer.connect();
}

function updatePlayerState(state) {
    if (!state) return;
    
    const track = state.track_window.current_track;
    currentTrack = track;
    isPlaying = !state.paused;
    currentPosition = state.position;
    trackDuration = state.duration;
    
    // Update UI
    updateCurrentTrackDisplay(track);
    updatePlayPauseButton();
    updateProgressBar();
    updatePlayerStatus(isPlaying ? 'Playing' : 'Paused');
    
    // Update visualizer
    const visualizer = document.getElementById('music-visualizer');
    if (visualizer) {
        visualizer.style.display = isPlaying ? 'flex' : 'none';
    }
}

function updateCurrentTrackDisplay(track) {
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
    
    if (progressFill && trackDuration > 0) {
        const progress = (currentPosition / trackDuration) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    if (currentTime) {
        currentTime.textContent = formatDuration(currentPosition);
    }
}

function updatePlayerStatus(status) {
    const playerStatus = document.getElementById('player-status');
    if (playerStatus) {
        playerStatus.textContent = status;
    }
}

function initializePlayerControls() {
    // Play/Pause
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    // Previous/Next
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', previousTrack);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTrack);
    }
    
    // Shuffle/Repeat
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', toggleShuffle);
    }
    
    if (repeatBtn) {
        repeatBtn.addEventListener('click', toggleRepeat);
    }
    
    // Progress bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', seekToPosition);
    }
    
    // Volume control
    const volumeBar = document.getElementById('volume-bar');
    if (volumeBar) {
        volumeBar.addEventListener('click', setVolume);
    }
    
    // Initialize volume display
    updateVolumeDisplay();
}

async function togglePlayPause() {
    try {
        if (!spotifyPlayer) {
            showNotification('Player not ready. Please wait...');
            return;
        }
        
        if (isPlaying) {
            await spotifyPlayer.pause();
            showNotification('Paused ⏸️');
        } else {
            await spotifyPlayer.resume();
            showNotification('Playing 🎵');
        }
    } catch (error) {
        console.error('❌ Error toggling playback:', error);
        showNotification('Error controlling playback');
    }
}

async function previousTrack() {
    try {
        if (!spotifyPlayer) return;
        await spotifyPlayer.previousTrack();
        showNotification('Previous track ⏮️');
    } catch (error) {
        console.error('❌ Error skipping to previous track:', error);
    }
}

async function nextTrack() {
    try {
        if (!spotifyPlayer) return;
        await spotifyPlayer.nextTrack();
        showNotification('Next track ⏭️');
    } catch (error) {
        console.error('❌ Error skipping to next track:', error);
    }
}

async function toggleShuffle() {
    try {
        isShuffleOn = !isShuffleOn;
        
        const shuffleBtn = document.getElementById('shuffle-btn');
        if (shuffleBtn) {
            shuffleBtn.classList.toggle('active', isShuffleOn);
        }
        
        await spotifyApiCall(`/me/player/shuffle?state=${isShuffleOn}`, {
            method: 'PUT'
        });
        
        showNotification(`Shuffle ${isShuffleOn ? 'on' : 'off'} 🔀`);
    } catch (error) {
        console.error('❌ Error toggling shuffle:', error);
    }
}

async function toggleRepeat() {
    try {
        const modes = ['off', 'context', 'track'];
        const currentIndex = modes.indexOf(repeatMode);
        repeatMode = modes[(currentIndex + 1) % modes.length];
        
        const repeatBtn = document.getElementById('repeat-btn');
        if (repeatBtn) {
            repeatBtn.classList.toggle('active', repeatMode !== 'off');
            repeatBtn.textContent = repeatMode === 'track' ? '🔂' : '🔁';
        }
        
        await spotifyApiCall(`/me/player/repeat?state=${repeatMode}`, {
            method: 'PUT'
        });
        
        showNotification(`Repeat: ${repeatMode} 🔁`);
    } catch (error) {
        console.error('❌ Error toggling repeat:', error);
    }
}

function seekToPosition(e) {
    if (!trackDuration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekPosition = Math.floor(percentage * trackDuration);
    
    if (spotifyPlayer) {
        spotifyPlayer.seek(seekPosition);
    }
}

function setVolume(e) {
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    
    currentVolume = percentage;
    
    if (spotifyPlayer) {
        spotifyPlayer.setVolume(currentVolume);
    }
    
    updateVolumeDisplay();
    showNotification(`Volume: ${Math.round(percentage * 100)}% 🔊`);
}

function updateVolumeDisplay() {
    const volumeFill = document.getElementById('volume-fill');
    if (volumeFill) {
        volumeFill.style.width = `${currentVolume * 100}%`;
    }
}

function initializeSpotifyTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
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
            
            // Load tab-specific content
            loadTabContent(tabName);
        });
    });
}

function loadTabContent(tabName) {
    switch(tabName) {
        case 'playlists':
            if (userPlaylists.length === 0) {
                loadUserPlaylists();
            }
            break;
        case 'liked-songs':
            if (likedSongs.length === 0) {
                loadLikedSongs();
            }
            break;
        case 'queue':
            updateQueueDisplay();
            break;
    }
}

async function loadUserPlaylists() {
    try {
        showLoadingState('playlists');
        
        const response = await spotifyApiCall('/me/playlists?limit=50');
        if (response && response.items) {
            userPlaylists = response.items;
            displayPlaylists(userPlaylists);
        }
    } catch (error) {
        console.error('❌ Error loading playlists:', error);
        showNotification('Failed to load playlists');
    }
}

function displayPlaylists(playlists) {
    const playlistsGrid = document.getElementById('playlists-grid');
    const loadingState = document.getElementById('playlists-loading');
    
    if (loadingState) {
        loadingState.style.display = 'none';
    }
    
    if (!playlistsGrid) return;
    
    playlistsGrid.innerHTML = '';
    
    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.className = 'playlist-item';
        playlistElement.innerHTML = `
            <img src="${playlist.images[0]?.url || ''}" alt="${playlist.name}" class="playlist-cover">
            <div class="playlist-info">
                <h4 class="playlist-name">${playlist.name}</h4>
                <p class="playlist-description">${playlist.description || 'No description'}</p>
                <div class="playlist-stats">
                    <span>${playlist.tracks.total} tracks</span>
                    <span class="separator">•</span>
                    <span>${playlist.owner.display_name}</span>
                </div>
            </div>
        `;
        
        playlistElement.addEventListener('click', () => openPlaylistModal(playlist));
        playlistsGrid.appendChild(playlistElement);
    });
}

function openPlaylistModal(playlist) {
    const modal = document.getElementById('playlist-modal');
    const title = document.getElementById('playlist-modal-title');
    const image = document.getElementById('playlist-modal-image');
    const name = document.getElementById('playlist-modal-name');
    const description = document.getElementById('playlist-modal-description');
    const tracks = document.getElementById('playlist-modal-tracks');
    const owner = document.getElementById('playlist-modal-owner');
    const playBtn = document.getElementById('play-playlist-btn');
    
    if (title) title.textContent = playlist.name;
    if (image) image.src = playlist.images[0]?.url || '';
    if (name) name.textContent = playlist.name;
    if (description) description.textContent = playlist.description || 'No description';
    if (tracks) tracks.textContent = `${playlist.tracks.total} tracks`;
    if (owner) owner.textContent = playlist.owner.display_name;
    
    if (playBtn) {
        playBtn.onclick = () => playPlaylist(playlist);
    }
    
    if (modal) {
        modal.classList.remove('hidden');
    }
    
    loadPlaylistTracks(playlist.id);
}

async function loadPlaylistTracks(playlistId) {
    try {
        showLoadingState('playlist-tracks');
        
        const response = await spotifyApiCall(`/playlists/${playlistId}/tracks?limit=50`);
        if (response && response.items) {
            displayPlaylistTracks(response.items);
        }
    } catch (error) {
        console.error('❌ Error loading playlist tracks:', error);
    }
}

function displayPlaylistTracks(tracks) {
    const tracksList = document.getElementById('playlist-tracks-list');
    const loadingState = document.getElementById('playlist-tracks-loading');
    
    if (loadingState) {
        loadingState.style.display = 'none';
    }
    
    if (!tracksList) return;
    
    tracksList.innerHTML = '';
    
    tracks.forEach((item, index) => {
        if (!item.track) return;
        
        const track = item.track;
        const trackElement = document.createElement('div');
        trackElement.className = 'track-item';
        trackElement.innerHTML = `
            <span class="track-number">${index + 1}</span>
            <img src="${track.album.images[2]?.url || ''}" alt="${track.name}" class="track-cover">
            <div class="track-details">
                <div class="track-name">${track.name}${track.explicit ? '<span class="track-explicit">E</span>' : ''}</div>
                <div class="track-artist">${track.artists.map(a => a.name).join(', ')}</div>
            </div>
            <span class="track-duration">${formatDuration(track.duration_ms)}</span>
        `;
        
        trackElement.addEventListener('click', () => playTrack(track.uri));
        tracksList.appendChild(trackElement);
    });
}

async function playPlaylist(playlist) {
    try {
        if (!deviceId) {
            showNotification('Player not ready. Please wait...');
            return;
        }
        
        await spotifyApiCall('/me/player/play', {
            method: 'PUT',
            body: JSON.stringify({
                context_uri: playlist.uri,
                device_id: deviceId
            })
        });
        
        showNotification(`Playing playlist: ${playlist.name} 🎵`);
        
        // Close modal
        const modal = document.getElementById('playlist-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        
    } catch (error) {
        console.error('❌ Error playing playlist:', error);
        showNotification('Error playing playlist');
    }
}

async function playTrack(trackUri) {
    try {
        if (!deviceId) {
            showNotification('Player not ready. Please wait...');
            return;
        }
        
        await spotifyApiCall('/me/player/play', {
            method: 'PUT',
            body: JSON.stringify({
                uris: [trackUri],
                device_id: deviceId
            })
        });
        
        showNotification('Playing track 🎵');
        
    } catch (error) {
        console.error('❌ Error playing track:', error);
        showNotification('Error playing track');
    }
}

async function loadLikedSongs(offset = 0) {
    try {
        showLoadingState('liked-songs');
        
        const response = await spotifyApiCall(`/me/tracks?limit=50&offset=${offset}`);
        if (response) {
            if (offset === 0) {
                likedSongs = response.items;
                totalLikedSongs = response.total;
            } else {
                likedSongs = [...likedSongs, ...response.items];
            }
            
            displayLikedSongs(response.items, offset);
            updateLikedSongsPagination(offset, response.total);
        }
    } catch (error) {
        console.error('❌ Error loading liked songs:', error);
        showNotification('Failed to load liked songs');
    }
}

function displayLikedSongs(songs, offset = 0) {
    const likedSongsList = document.getElementById('liked-songs-list');
    const loadingState = document.getElementById('liked-songs-loading');
    
    if (loadingState) {
        loadingState.style.display = 'none';
    }
    
    if (!likedSongsList) return;
    
    if (offset === 0) {
        likedSongsList.innerHTML = '';
    }
    
    songs.forEach((item, index) => {
        if (!item.track) return;
        
        const track = item.track;
        const trackElement = document.createElement('div');
        trackElement.className = 'track-item';
        trackElement.innerHTML = `
            <span class="track-number">${offset + index + 1}</span>
            <img src="${track.album.images[2]?.url || ''}" alt="${track.name}" class="track-cover">
            <div class="track-details">
                <div class="track-name">${track.name}${track.explicit ? '<span class="track-explicit">E</span>' : ''}</div>
                <div class="track-artist">${track.artists.map(a => a.name).join(', ')}</div>
            </div>
            <span class="track-duration">${formatDuration(track.duration_ms)}</span>
        `;
        
        trackElement.addEventListener('click', () => playTrack(track.uri));
        likedSongsList.appendChild(trackElement);
    });
}

function updateLikedSongsPagination(currentOffset, total) {
    const prevBtn = document.getElementById('prev-liked-page');
    const nextBtn = document.getElementById('next-liked-page');
    const pageInfo = document.getElementById('liked-page-info');
    
    const currentPage = Math.floor(currentOffset / 50) + 1;
    const totalPages = Math.ceil(total / 50);
    
    if (prevBtn) {
        prevBtn.disabled = currentOffset === 0;
        prevBtn.onclick = () => {
            if (currentOffset > 0) {
                loadLikedSongs(currentOffset - 50);
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentOffset + 50 >= total;
        nextBtn.onclick = () => {
            if (currentOffset + 50 < total) {
                loadLikedSongs(currentOffset + 50);
            }
        };
    }
    
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
}

function initializeSpotifySearch() {
    const playlistSearch = document.getElementById('playlist-search');
    const likedSongsSearch = document.getElementById('liked-songs-search');
    
    if (playlistSearch) {
        playlistSearch.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const filteredPlaylists = userPlaylists.filter(playlist =>
                playlist.name.toLowerCase().includes(query) ||
                playlist.description?.toLowerCase().includes(query)
            );
            displayPlaylists(filteredPlaylists);
        });
    }
    
    if (likedSongsSearch) {
        likedSongsSearch.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const filteredSongs = likedSongs.filter(item =>
                item.track?.name.toLowerCase().includes(query) ||
                item.track?.artists.some(artist => 
                    artist.name.toLowerCase().includes(query)
                )
            );
            displayLikedSongs(filteredSongs);
        });
    }
}

function updateQueueDisplay() {
    const queueList = document.getElementById('queue-list');
    if (!queueList) return;
    
    if (playbackQueue.length === 0) {
        queueList.innerHTML = `
            <div class="empty-queue">
                <div class="empty-icon">📋</div>
                <h4>Queue is empty</h4>
                <p>Play some tracks to see them here!</p>
            </div>
        `;
        return;
    }
    
    queueList.innerHTML = '';
    playbackQueue.forEach((track, index) => {
        const trackElement = document.createElement('div');
        trackElement.className = 'track-item';
        trackElement.innerHTML = `
            <span class="track-number">${index + 1}</span>
            <img src="${track.album.images[2]?.url || ''}" alt="${track.name}" class="track-cover">
            <div class="track-details">
                <div class="track-name">${track.name}</div>
                <div class="track-artist">${track.artists.map(a => a.name).join(', ')}</div>
            </div>
            <span class="track-duration">${formatDuration(track.duration_ms)}</span>
        `;
        
        queueList.appendChild(trackElement);
    });
}

function showLoadingState(section) {
    const loadingElement = document.getElementById(`${section}-loading`);
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }
}

function spotifyLogout() {
    spotifyAccessToken = null;
    localStorage.removeItem('spotify_access_token');
    
    if (spotifyPlayer) {
        spotifyPlayer.disconnect();
        spotifyPlayer = null;
    }
    
    // Reset UI
    const authSection = document.getElementById('spotify-auth-section');
    const profileSection = document.getElementById('spotify-profile-section');
    const mainSection = document.getElementById('spotify-main-section');
    const errorSection = document.getElementById('spotify-error');
    
    if (authSection) authSection.classList.remove('hidden');
    if (profileSection) profileSection.classList.add('hidden');
    if (mainSection) mainSection.classList.add('hidden');
    if (errorSection) errorSection.classList.add('hidden');
    
    // Reset data
    userPlaylists = [];
    likedSongs = [];
    playbackQueue = [];
    currentTrack = null;
    
    showNotification('Logged out from Spotify 👋');
}

function checkSpotifyAuth() {
    const savedToken = localStorage.getItem('spotify_access_token');
    if (savedToken && !spotifyAccessToken) {
        spotifyAccessToken = savedToken;
        initializeSpotifyWithToken();
    }
}

function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Calendar Functions
function initializeCalendar() {
    console.log('📅 Initializing calendar...');
    
    try {
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');
        const addEventBtn = document.getElementById('add-event-btn');
        const eventModal = document.getElementById('event-modal');
        const closeModal = document.getElementById('close-event-modal');
        const cancelBtn = document.getElementById('cancel-event');
        const eventForm = document.getElementById('event-form');
        
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
        
        if (closeModal && eventModal) {
            closeModal.addEventListener('click', function(e) {
                e.preventDefault();
                closeEventModal();
            });
        }
        
        if (cancelBtn && eventModal) {
            cancelBtn.addEventListener('click', function(e) {
                e.preventDefault();
                closeEventModal();
            });
        }
        
        if (eventForm) {
            eventForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveEvent(e);
            });
        }
        
        if (eventModal) {
            eventModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeEventModal();
                }
            });
        }
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && eventModal && !eventModal.classList.contains('hidden')) {
                e.preventDefault();
                closeEventModal();
            }
        });
        
        renderCalendar();
        renderColorPicker();
        updateEventsList();
        
        if (events.length === 0) {
            events.push({
                id: Date.now(),
                title: "🎂 Chutadamon's Birthday!",
                date: "2025-09-13",
                time: "00:00",
                description: "The most amazing birthday ever!",
                color: "#FF6B9D"
            });
            saveCalendarData();
            updateEventsList();
        }
        
        console.log('✅ Calendar initialized');
    } catch (error) {
        console.error('❌ Error initializing calendar:', error);
    }
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthElement = document.getElementById('current-month');
    
    if (!calendarGrid || !currentMonthElement) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonthElement.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
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
    
    for (let i = 0; i < 42; i++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (cellDate.getMonth() !== month) {
            dayElement.classList.add('other-month');
        }
        
        if (isToday(cellDate)) {
            dayElement.classList.add('today');
        }
        
        dayElement.innerHTML = `
            <div class="day-number">${cellDate.getDate()}</div>
            <div class="day-events"></div>
        `;
        
        dayElement.addEventListener('click', function() {
            openEventModal(cellDate);
        });
        
        // Add events for this day
        const dayEvents = events.filter(event => 
            new Date(event.date).toDateString() === cellDate.toDateString()
        );
        
        const eventsContainer = dayElement.querySelector('.day-events');
        dayEvents.slice(0, 2).forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-indicator';
            eventElement.style.backgroundColor = event.color;
            eventElement.textContent = event.title;
            eventElement.title = event.title;
            eventsContainer.appendChild(eventElement);
        });
        
        if (dayEvents.length > 2) {
            const moreElement = document.createElement('div');
            moreElement.className = 'event-indicator';
            moreElement.style.backgroundColor = '#666';
            moreElement.textContent = `+${dayEvents.length - 2} more`;
            eventsContainer.appendChild(moreElement);
        }
        
        calendarGrid.appendChild(dayElement);
    }
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

function openEventModal(date = null) {
    const modal = document.getElementById('event-modal');
    const dateInput = document.getElementById('event-date');
    
    if (!modal) return;
    
    if (date && dateInput) {
        dateInput.value = date.toISOString().split('T')[0];
    }
    
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        eventForm.reset();
    }
    
    currentEventId = null;
    const modalTitle = document.getElementById('event-modal-title');
    if (modalTitle) {
        modalTitle.textContent = 'Add New Event';
    }
    
    const firstColor = document.querySelector('.color-option');
    if (firstColor) {
        selectColor(firstColor);
    }
    
    modal.classList.remove('hidden');
    
    const titleInput = document.getElementById('event-title');
    if (titleInput) {
        setTimeout(() => titleInput.focus(), 100);
    }
}

function closeEventModal() {
    const modal = document.getElementById('event-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function renderColorPicker() {
    const colorPicker = document.getElementById('color-picker');
    if (!colorPicker) return;
    
    colorPicker.innerHTML = '';
    
    appData.eventCategories.forEach(category => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = category.color;
        colorOption.dataset.color = category.color;
        colorOption.title = category.name;
        colorOption.textContent = category.icon;
        
        colorOption.addEventListener('click', function() {
            selectColor(colorOption);
        });
        
        colorPicker.appendChild(colorOption);
    });
}

function selectColor(colorElement) {
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
    });
    colorElement.classList.add('selected');
}

function saveEvent(e) {
    e.preventDefault();
    
    try {
        const selectedColor = document.querySelector('.color-option.selected');
        const titleEl = document.getElementById('event-title');
        const dateEl = document.getElementById('event-date');
        const timeEl = document.getElementById('event-time');
        const descriptionEl = document.getElementById('event-description');
        
        if (!titleEl || !dateEl || !titleEl.value || !dateEl.value) {
            showNotification('Please fill in all required fields');
            return;
        }
        
        const event = {
            id: currentEventId || Date.now(),
            title: titleEl.value,
            date: dateEl.value,
            time: timeEl ? timeEl.value : '',
            description: descriptionEl ? descriptionEl.value : '',
            color: selectedColor ? selectedColor.dataset.color : appData.eventCategories[0].color
        };
        
        if (currentEventId) {
            const index = events.findIndex(e => e.id === currentEventId);
            if (index !== -1) {
                events[index] = event;
                showNotification('Event updated successfully! ✅');
            }
        } else {
            events.push(event);
            showNotification('Event added successfully! 🎉');
        }
        
        saveCalendarData();
        renderCalendar();
        updateEventsList();
        closeEventModal();
    } catch (error) {
        console.error('❌ Error saving event:', error);
        showNotification('Error saving event. Please try again.');
    }
}

function updateEventsList() {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) return;
    
    const today = new Date();
    const sortedEvents = events
        .filter(event => new Date(event.date + ' ' + (event.time || '00:00')) >= today)
        .sort((a, b) => new Date(a.date + ' ' + (a.time || '00:00')) - new Date(b.date + ' ' + (b.time || '00:00')))
        .slice(0, 5);
    
    if (sortedEvents.length === 0) {
        eventsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-style: italic; padding: 16px;">No upcoming events</p>';
        return;
    }
    
    eventsList.innerHTML = '';
    sortedEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.style.borderLeftColor = event.color;
        
        const eventDate = new Date(event.date);
        const dateStr = eventDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        eventElement.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-datetime">${dateStr}${event.time ? ' at ' + formatTime(event.time) : ''}</div>
            ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
        `;
        
        eventElement.addEventListener('click', function() {
            editEvent(event);
        });
        
        eventsList.appendChild(eventElement);
    });
}

function editEvent(event) {
    currentEventId = event.id;
    
    const modalTitle = document.getElementById('event-modal-title');
    const titleEl = document.getElementById('event-title');
    const dateEl = document.getElementById('event-date');
    const timeEl = document.getElementById('event-time');
    const descriptionEl = document.getElementById('event-description');
    
    if (modalTitle) modalTitle.textContent = 'Edit Event';
    if (titleEl) titleEl.value = event.title;
    if (dateEl) dateEl.value = event.date;
    if (timeEl) timeEl.value = event.time || '';
    if (descriptionEl) descriptionEl.value = event.description || '';
    
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.color === event.color) {
            option.classList.add('selected');
        }
    });
    
    const modal = document.getElementById('event-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Data Persistence Functions
function saveRemindersData() {
    try {
        const remindersData = {
            meals: {},
            water: {
                enabled: false,
                interval: '60',
                progress: waterProgress
            }
        };
        
        const waterToggle = document.getElementById('water-toggle');
        const intervalSelect = document.getElementById('water-interval-select');
        
        if (waterToggle) remindersData.water.enabled = waterToggle.checked;
        if (intervalSelect) remindersData.water.interval = intervalSelect.value;
        
        document.querySelectorAll('.meal-item').forEach(item => {
            const toggle = item.querySelector('input[type="checkbox"]');
            const timeSelect = item.querySelector('select');
            const mealName = item.querySelector('.meal-name');
            
            if (toggle && timeSelect && mealName) {
                const mealId = toggle.id.replace('-toggle', '');
                remindersData.meals[mealId] = {
                    name: mealName.textContent,
                    enabled: toggle.checked,
                    time: timeSelect.value
                };
            }
        });
        
        localStorage.setItem('chutadamon_reminders', JSON.stringify(remindersData));
    } catch (error) {
        console.error('❌ Error saving reminders data:', error);
    }
}

function saveGalleryData() {
    try {
        localStorage.setItem('chutadamon_photos', JSON.stringify(photos));
    } catch (error) {
        console.error('❌ Error saving gallery data:', error);
    }
}

function saveCalendarData() {
    try {
        localStorage.setItem('chutadamon_events', JSON.stringify(events));
    } catch (error) {
        console.error('❌ Error saving calendar data:', error);
    }
}

function loadSavedData() {
    console.log('💾 Loading saved data...');
    
    try {
        const savedReminders = localStorage.getItem('chutadamon_reminders');
        if (savedReminders) {
            const remindersData = JSON.parse(savedReminders);
            
            Object.entries(remindersData.meals || {}).forEach(([mealId, mealData]) => {
                const toggle = document.getElementById(`${mealId}-toggle`);
                const timeSelect = document.getElementById(`${mealId}-time`);
                
                if (toggle) toggle.checked = mealData.enabled;
                if (timeSelect) timeSelect.value = mealData.time;
            });
            
            if (remindersData.water) {
                const waterToggle = document.getElementById('water-toggle');
                const intervalSelect = document.getElementById('water-interval-select');
                
                if (waterToggle) waterToggle.checked = remindersData.water.enabled;
                if (intervalSelect) intervalSelect.value = remindersData.water.interval;
                
                waterProgress = remindersData.water.progress || 0;
                updateWaterProgress();
            }
        }
        
        const savedPhotos = localStorage.getItem('chutadamon_photos');
        if (savedPhotos) {
            photos = JSON.parse(savedPhotos);
            updateGalleryDisplay();
        }
        
        const savedEvents = localStorage.getItem('chutadamon_events');
        if (savedEvents) {
            events = JSON.parse(savedEvents);
        }
        
        console.log('✅ Data loading complete!');
    } catch (error) {
        console.error('❌ Error loading saved data:', error);
    }
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
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 8px 32px var(--shadow-color);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
            color: var(--text-primary);
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
        color: var(--text-secondary);
        padding: 4px;
        border-radius: 50%;
        transition: all 0.2s ease;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .notification-close:hover {
        background: var(--primary-color);
        color: white;
    }
    .notification-icon {
        font-size: 20px;
    }
    .notification-message {
        flex: 1;
        font-size: 14px;
        line-height: 1.4;
    }
    
    /* Playlist modal close button */
    #close-playlist-modal {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--text-secondary);
        padding: var(--space-8);
        border-radius: 50%;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
    }
    
    #close-playlist-modal:hover {
        background: var(--primary-color);
        color: white;
        transform: scale(1.1);
    }
`;
document.head.appendChild(dynamicStyles);

// Initialize playlist modal close button
document.addEventListener('DOMContentLoaded', function() {
    const closePlaylistModal = document.getElementById('close-playlist-modal');
    const playlistModal = document.getElementById('playlist-modal');
    
    if (closePlaylistModal && playlistModal) {
        closePlaylistModal.addEventListener('click', function(e) {
            e.preventDefault();
            playlistModal.classList.add('hidden');
        });
    }
    
    if (playlistModal) {
        playlistModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });
    }
});

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
});

console.log('🎂 Chutadamon\'s Birthday Website with Full Spotify Integration Ready! 🎉');
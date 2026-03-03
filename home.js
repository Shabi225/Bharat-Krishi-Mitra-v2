/* ---------------- BACKGROUND AUDIO ---------------- */
let voices = [];
let voiceEnabled = false;
let signupSpoken = false;
let audio = document.getElementById("bgAudio");

document.addEventListener("click", () => {
  audio.volume = 0.35;
  audio.play();
}, { once: true });

function toggleAudio() {
  audio.paused ? audio.play() : audio.pause();
}

/* ---------------- MENU ---------------- */
function toggleMenu() {
  document.getElementById("menu").classList.toggle("active");
}

document.addEventListener("click", function (event) {
  const menu = document.getElementById("menu");
  const menuBtn = document.querySelector(".menu-btn");

  if (
    menu.classList.contains("active") &&
    !menu.contains(event.target) &&
    !menuBtn.contains(event.target)
  ) {
    menu.classList.remove("active");
  }
});

/* ---------------- HERO TEXT LANGUAGE ---------------- */
function updateHeroText() {
  // If the page is currently being translated by Google, don't overwrite with Hindi base
  const googleTranslateActive = document.documentElement.classList.contains('translated-ltr') || 
                                document.documentElement.classList.contains('translated-rtl') ||
                                (document.querySelector('.goog-te-menu-value span:first-child')?.textContent && 
                                 document.querySelector('.goog-te-menu-value span:first-child').textContent !== 'Select Language');

  if (googleTranslateActive) {
      console.log("Skipping hero text update: Translation active");
      return;
  }

  // We use Hindi as the base. 
  // Google Translate will then translate this into English, Marathi, etc.
  const text = {
    title: "किसानों का डिजिटल साथी",
    line1: "खेती से जुड़ी हर ज़रूरी जानकारी अब आपकी उंगलियों पर",
    line2: "सरकारी योजनाएँ, मौसम अपडेट और स्मार्ट खेती समाधान",
    line3: "आज ही भारत कृषि मित्र से जुड़ें और खेती को भविष्य के लिए तैयार करें 🌾"
  };

  const titleEl = document.getElementById("hero-title");
  const l1El = document.getElementById("hero-line1");
  const l2El = document.getElementById("hero-line2");
  const l3El = document.getElementById("hero-line3");

  if (titleEl) titleEl.innerText = text.title;
  if (l1El) l1El.innerText = text.line1;
  if (l2El) l2El.innerText = text.line2;
  if (l3El) l3El.innerText = text.line3;

  replayHeroAnimation();
}

function changeLanguage(langCode) {
    // Trigger the Google Translate engine
    const checkEngine = setInterval(() => {
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
            combo.value = langCode;
            combo.dispatchEvent(new Event('change'));
            clearInterval(checkEngine);
            console.log("✅ Translation triggered for:", langCode);
        }
    }, 100);

    // Stop checking after 5 seconds
    setTimeout(() => clearInterval(checkEngine), 5000);
}

/* ---------------- HERO ANIMATION RESET ---------------- */
function replayHeroAnimation() {
  const hero = document.getElementById("heroBox");
  if (!hero) return;
  hero.classList.remove("hero-animate");
  void hero.offsetWidth; // force reflow
  hero.classList.add("hero-animate");
}


/* INIT TEXT */
if (!document.getElementById("hero-title").innerText.trim()) {
    updateHeroText();
}

/* ---------------- SPEECH ---------------- */


function loadVoices() {
  voices = speechSynthesis.getVoices();
}
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

function enableVoice() {
  if (!voiceEnabled) {
    voiceEnabled = true;
    speakText("वॉइस चालू हो गई है", "hi-IN");
  }
}

function speakText(text, lang) {
  if (!voiceEnabled) return;

  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);

  const voice =
    voices.find(v => v.lang === lang) ||
    voices.find(v => v.lang.startsWith(lang.split("-")[0])) ||
    voices.find(v => v.lang.startsWith("en"));

  if (voice) {
    msg.voice = voice;
    msg.lang = voice.lang;
  }

  msg.rate = 0.95;
  msg.volume = 1;
  speechSynthesis.speak(msg);
}

function speakSignup() {
  if (!voiceEnabled || signupSpoken) return;

  const langElement = document.getElementById("language");
  const lang = langElement ? langElement.value : "hi";
  
  const messages = {
    "hi": "साइन अप करें",
    "en": "Sign up"
  };

  speakText(messages[lang] || messages["hi"], lang === 'en' ? 'en-US' : 'hi-IN');
  signupSpoken = true;
}

function resetSignupVoice() {
  signupSpoken = false;
}

function speakWelcome() {
  speakText("भारत कृषि मित्र में आपका स्वागत है", "hi-IN");
}
function scrollToAbout() {
  document.getElementById("about").scrollIntoView({
    behavior: "smooth"
  });
  document.getElementById("menu").classList.remove("active");
}

/* ---------------- SCROLL TO CONTACT ---------------- */
function scrollToContact() {
  document.getElementById("contact").scrollIntoView({
    behavior: "smooth"
  });
  document.getElementById("menu").classList.remove("active");
}


function scrollToHome() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  document.getElementById("menu").classList.remove("active");
}
const header = document.querySelector("header");
const aboutSection = document.getElementById("about");

window.addEventListener("scroll", () => {
  const aboutTop = aboutSection.offsetTop;
  const scrollPos = window.scrollY;

  if (scrollPos >= aboutTop - 100) {
    header.classList.add("hide-header");
  } else {
    header.classList.remove("hide-header");
  }
})
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");

  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});


// -------- CAROUSEL (AUTO + ARROWS) --------
var carouselTrack = null;
var carouselImages = [];
var carouselIndex = 0;
var carouselTotal = 0;
var carouselTimer = null;

window.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing carousel...");

  carouselTrack = document.querySelector(".carousel-track");
  carouselImages = document.querySelectorAll(".carousel-track img");
  carouselTotal = carouselImages.length;

  console.log("Found carouselTrack:", carouselTrack);
  console.log("Total carousel images:", carouselTotal);

  if (!carouselTrack || carouselTotal === 0) {
    console.warn("Carousel not found or no images on this page.");
    return;
  }

  updateCarousel();
  startAutoSlide();
});

function updateCarousel() {
  if (!carouselTrack) return;
  carouselTrack.style.transform = `translateX(-${carouselIndex * 100}%)`;
}

function changeSlide(direction) {
  if (!carouselTrack || carouselTotal === 0) {
    console.warn("changeSlide called but carousel not ready");
    return;
  }

  carouselIndex += direction;
  if (carouselIndex < 0) {
    carouselIndex = carouselTotal - 1;
  } else if (carouselIndex >= carouselTotal) {
    carouselIndex = 0;
  }
  updateCarousel();
  restartAutoSlide(); // user click resets timer
}

function startAutoSlide() {
  // change image every 3 seconds
  carouselTimer = setInterval(function () {
    carouselIndex = (carouselIndex + 1) % carouselTotal;
    updateCarousel();
  }, 3000);
}

function restartAutoSlide() {
  if (carouselTimer) clearInterval(carouselTimer);
  startAutoSlide();
}

// AUTO WELCOME SPEECH FIX
document.addEventListener('DOMContentLoaded', function() {
  updateAuthStatus();

  // Wait for voices to load completely
  const welcomeInterval = setInterval(() => {
    if (voices.length > 0) {
      voiceEnabled = true;  // Auto-enable
      speakWelcome();
      clearInterval(welcomeInterval);
      console.log("✅ Welcome speech triggered");
    }
  }, 300);
  
  // Stop checking after 5 seconds
  setTimeout(() => clearInterval(welcomeInterval), 5000);
});

function updateAuthStatus() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;
  
  try {
    if (userStr) user = JSON.parse(userStr);
  } catch (e) {
    console.error("Auth status parse error:", e);
  }

  const authBtn = document.getElementById('authBtn');
  const schemesLink = document.getElementById('schemesLink');

  if (schemesLink) {
    schemesLink.style.display = 'block';
  }

  if (token && user) {
    if (authBtn) {
      authBtn.textContent = 'Logout';
      authBtn.onclick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      };
    }
    // Update welcome message if user is logged in
    setTimeout(() => {
      if (user && user.fullName) {
        speakText(`Welcome back, ${user.fullName}`, 'en-US');
      }
    }, 1000);
  }
}

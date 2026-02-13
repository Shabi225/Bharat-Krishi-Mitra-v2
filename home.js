/* ---------------- BACKGROUND AUDIO ---------------- */
let voices = [];
let voiceEnabled = false;
let signupSpoken = false;
let audio = document.getElementById("bgAudio");

document.addEventListener("click", () => {
  audio.volume = 1.0;
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
  const lang = document.getElementById("language").value;

  const content = {
    "hi-IN": {

      // HERO TEXT
      title: "किसानों का डिजिटल साथी",
      line1: "खेती से जुड़ी हर ज़रूरी जानकारी अब आपकी उंगलियों पर",
      line2: "सरकारी योजनाएँ, मौसम अपडेट और स्मार्ट खेती समाधान",
      line3: "आज ही भारत कृषि मित्र से जुड़ें और खेती को भविष्य के लिए तैयार करें 🌾",

      // ABOUT TEXT
      aboutTitle: "हर भारतीय किसान के लिए 🌾",
      aboutLine1: "खेती सिर्फ काम नहीं — यह जीवन जीने का तरीका है। भारत कृषि मित्र आपके साथ विश्वसनीय और सरल मार्गदर्शन देता है।",
      aboutLine2: "मौसम अपडेट से लेकर सरकारी योजनाओं तक, सब कुछ आपकी भाषा में उपलब्ध है।",
      aboutHighlight: "स्मार्ट खेती सही जानकारी से शुरू होती है।",

      // FOOTER TEXT
      footerTitle: "भारत कृषि मित्र",
      footerDesc: "भारतीय किसानों को विश्वसनीय मार्गदर्शन प्रदान करना 🌾। मौसम अपडेट से लेकर स्मार्ट खेती की सलाह तक सब कुछ यहाँ उपलब्ध है।",
 
      footerQuickLinks: "त्वरित लिंक",
      footerHome: "होम",
      footerAbout: "हमारे बारे में",
      footerSchemes: "योजनाएं",
      footerWeather: "मौसम अपडेट",
      footerContact: "संपर्क करें",

      footerContactTitle: "संपर्क करें",
      footerCopyright:
         "© 2026 भारत कृषि मित्र। सर्वाधिकार सुरक्षित।"
    },
    "en-US": {

      // HERO TEXT
      title: "The Digital Companion for Farmers",
      line1: "All essential farming information at your fingertips",
      line2: "Government schemes, weather updates, and smart farming insights",
      line3: "Join Bharat Krishi Mitra today and take farming into the future 🌱",

      // ABOUT TEXT
      aboutTitle: "For Every Indian Farmer 🌾",
      aboutLine1: "Farming is not just work — it is a way of life. Bharat Krishi Mitra provides trusted and simple guidance.",
      aboutLine2: "From weather updates to government schemes, everything is in your language.",
      aboutHighlight: "Smart farming starts with the right information.",

      // FOOTER TEXT
      footerTitle: "Bharat Krishi Mitra",
      footerDesc: "Providing trusted guidance to Indian farmers 🌾. From weather alerts to smart farming tips, everything you need is here.",

      footerQuickLinks: "Quick Links",
      footerHome: "Home",
      footerAbout: "About",
      footerSchemes: "Schemes",
      footerWeather: "Weather Update",
      footerContact: "Contact Us",

      footerContactTitle: "Contact Us",
      footerCopyright: "© 2026 Bharat Krishi Mitra. All Rights Reserved."
    },
    "bn-IN": {

      // HERO TEXT
      title: "কৃষকদের ডিজিটাল সহায়ক",
      line1: "চাষের সব গুরুত্বপূর্ণ তথ্য এখন আপনার হাতে",
      line2: "সরকারি প্রকল্প, আবহাওয়া এবং স্মার্ট চাষ",
      line3: "আজই ভারত কৃষি মিত্রে যোগ দিন 🌾",

      // ABOUT TEXT
      aboutTitle: "প্রতিটি ভারতীয় কৃষকের জন্য 🌾",
      aboutLine1: "চাষ শুধু কাজ নয় — এটি একটি জীবনধারা। ভারত কৃষি মিত্র বিশ্বস্ত সহায়তা প্রদান করে।",
      aboutLine2: "আবহাওয়া থেকে সরকারি প্রকল্প, সব আপনার ভাষায় উপলব্ধ।",
      aboutHighlight: "স্মার্ট চাষ সঠিক তথ্য দিয়ে শুরু হয়।",

      // FOOTER TEXT
      footerTitle: "ভারত কৃষি মিত্র",
      footerDesc: "ভারতীয় কৃষকদের জন্য বিশ্বস্ত সহায়তা 🌾। আবহাওয়া আপডেট থেকে স্মার্ট চাষের পরামর্শ—সবকিছু এখানে পাওয়া যায়।",
      footerQuickLinks: "দ্রুত লিংক",
      footerHome: "হোম",
      footerAbout: "আমাদের সম্পর্কে", 
      footerSchemes: "স্কিম",
      footerWeather: "আবহাওয়া আপডেট",
      footerContact: "যোগাযোগ করুন",
      footerContactTitle: "যোগাযোগ করুন",
      footerCopyright: "© 2026 ভারত কৃষি মিত্র। সর্বস্বত্ব সংরক্ষিত।"
    }
  };

  const text = content[lang] || content["hi-IN"];

  // HERO TEXT
  document.getElementById("hero-title").innerText = text.title;
  document.getElementById("hero-line1").innerText = text.line1;
  document.getElementById("hero-line2").innerText = text.line2;
  document.getElementById("hero-line3").innerText = text.line3;

  // ABOUT TEXT
  document.getElementById("about-title").innerText = text.aboutTitle;
  document.getElementById("about-line1").innerText = text.aboutLine1;
  document.getElementById("about-line2").innerText = text.aboutLine2;
  document.getElementById("about-highlight").innerText = text.aboutHighlight;

  // FOOTER TEXT
document.getElementById("footerAboutTitle").innerText = text.footerTitle;
document.getElementById("footerAboutText").innerText = text.footerDesc;
document.getElementById("footerLinksTitle").innerText = text.footerQuickLinks;
document.getElementById("footerHome").innerText = text.footerHome;
document.getElementById("footerAboutLink").innerText = text.footerAbout;
document.getElementById("footerSchemes").innerText = text.footerSchemes;
document.getElementById("footerWeather").innerText = text.footerWeather;
document.getElementById("footerContactLink").innerText = text.footerContact;
document.getElementById("footerContactTitle").innerText = text.footerContactTitle;
document.getElementById("footerCopyright").innerText = text.footerCopyright;


  replayHeroAnimation();
  if (voiceEnabled) {
    setTimeout(() => {
      speakText(text.line3, lang);
    }, 1800);
  }
}
/* ---------------- HERO ANIMATION RESET ---------------- */
function replayHeroAnimation() {
  const hero = document.getElementById("heroBox");
  hero.classList.remove("hero-animate");
  void hero.offsetWidth; // force reflow
  hero.classList.add("hero-animate");
}


/* INIT TEXT */
updateHeroText();

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

  const lang = document.getElementById("language").value;
  const messages = {
    "hi-IN": "साइन अप करें",
    "en-US": "Sign up"
  };

  speakText(messages[lang] || messages["hi-IN"], lang);
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



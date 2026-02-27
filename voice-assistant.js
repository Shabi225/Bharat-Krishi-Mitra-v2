const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.interimResults = false;

let isListening = false;

// Expanded keyword database covering all 13 supported languages
const commands = {
    weather: [
        'weather', 'weather update', 'मौसम', 'हवामान', 'আবহাওয়া', 'వాతావరణం', 'வானிலை', 'હવામાન', 'موسم', 'ಹವಾಮಾನ', 'ପାଣିପାଗ', 'കാലാവസ്ഥ', 'ਮੌਸਮ', 'বতৰ',
        'rain', 'temperature', 'बारिश', 'तापमान', 'पाऊस', 'मळमळ', 'বৃষ্টি', 'వర్షం', 'மழை', 'વરસાદ', 'ಮಳೆ', 'മഴ', 'ਮੀਂਹ'
    ],
    schemes: [
        'scheme', 'schemes', 'government scheme', 'योजना', 'योजनाएं', 'सरकारी योजना', 'স্কিম', 'పథకాలు', 'திட்டங்கள்', 'યોજનાઓ', 'اسکیمیں', 'ಯೋಜನೆಗಳು', 'ଯୋଜନା', 'ਪদ্ধତିകൾ', 'ਸਕੀਮਾਂ', 'আঁচনি',
        'subsidy', 'help', 'सहायता', 'मदत', 'সাহায্য', 'సహాయం', 'உதவி', 'સહાય', 'ಸಹಾಯ', 'സഹായം', 'ਸਹਾਇਤਾ'
    ],
    home: [
        'home', 'main page', 'back', 'होम', 'मुख्य पृष्ठ', 'पीछे', 'होम्', 'హోమ్', 'முகப்பு', 'ಹೋಮ್', 'ହୋମ୍', 'ഹോം', 'ਹੋਮ', 'হোম',
        'start', 'शुरुआत', 'सुरुवात', 'শুরু'
    ],
    about: [
        'about', 'info', 'information', 'बारे में', 'जानकारी', 'संपर्क', 'সম্পর্কে', 'గురించి', 'பற்றி', 'વિશે', 'ಬಗ್ಗೆ', 'ಬিষಯದಲ್ಲಿ', 'കുറിച്ച്', 'ਬਾਰੇ', 'বিষয়ে',
        'platform', 'company', 'संस्था'
    ],
    contact: [
        'contact', 'call', 'support', 'संपर्क', 'फ़ोन', 'योगাযোগ', 'సంప్రదించండి', 'தொடர்பு', 'સંપર્ક', 'رابطہ', 'ಸಂಪರ್ಕಿಸಿ', 'ଯୋଗାଯୋଗ', 'ബന്ധപ്പെടുക', 'ਸੰਪਰਕ', 'যোগাযোগ',
        'helpdesk', 'customer care'
    ],
    signin: [
        'sign in', 'login', 'enter', 'साइन इन', 'लॉगिन', 'अंदर जाएं', 'সাইন ইন', 'సైన్ ఇన్', 'உள்நுழை', 'સાઇન ઇન', 'ಸೈನ್ ಇನ್', 'ସାଇନ୍ ଇନ୍', 'സൈൻ ഇൻ', 'ਸਾਈਨ ਇਨ',
        'account', 'खाता'
    ],
    logout: [
        'logout', 'sign out', 'exit', 'लॉग आउट', 'बाहर निकलें', 'লগ আউট', 'లాగ్ అవుట్', 'வெளியேறு', 'લોગ આઉટ', 'ಲಾಗ್ ಔಟ್', 'ଲଗ୍ ଆଉଟ୍', 'ലോഗ് ഔട്ട്', 'ਲੌਗ ਆਉਟ'
    ],
    read: [
        'read', 'read out', 'speak', 'पढ़ो', 'पढ़कर सुनाओ', 'सुनाओ', 'वाचा', 'वाचून दाखवा', 'পড়ো', 'చదువు', 'படி', 'વાંચો', 'ਪੜ੍ਹੋ', 'ಓದು', 'ପଢନ୍ତୁ', 'വായിക്കുക', 'পঢ়ক',
        'tell me', 'बताओ', 'सांगा', 'చెప్పండి', 'சொல்லுங்கள்', 'કહો'
    ],
    check: [
        'check', 'update', 'show', 'दिखाओ', 'चेक', 'अपडेट', 'ਦੇਖੋ', 'చూడండి', 'பார்க்க', 'દેખાડો', 'ದಿನಚರಿ', 'ନୋଡି'
    ],
    location: [
        'location', 'district', 'gps', 'city', 'जिला', 'स्थान', 'शहर', 'জায়গা', 'ప్రాంతం', 'இடம்', 'જગ્યા', 'ಮಕಾಂ', 'ସ୍ଥାନ', 'സ്ഥലം'
    ]
};

const messages = {
    navigation: {
        weather: {
            'hi': 'मौसम पृष्ठ पर जा रहे हैं', 'en': 'Going to weather page', 'bn': 'আবহাওয়া পৃষ্ঠায় যাচ্ছি',
            'mr': 'हवामान पृष्ठावर जात आहे', 'te': 'వాతావరణ పేజీకి వెళ్తున్నాము', 'ta': 'வானிலை பக்கத்திற்கு செல்கிறோம்',
            'gu': 'હવામાન પૃષ્ઠ પર જઈ રહ્યા છીએ', 'ur': 'موسم کے صفحے پر جا رہے ہیں', 'kn': 'ಹವಾಮಾನ ಪುಟಕ್ಕೆ ಹೋಗುತ್ತಿದ್ದೇವೆ',
            'or': 'ପାଣିପାଗ ପୃଷ୍ଠାକୁ ଯାଉଛି', 'ml': 'കാലാവസ്ഥ പേജിലേക്ക് പോകുന്നു', 'pa': 'ਮੌਸਮ ਦੇ ਪੰਨੇ ਤੇ ਜਾ ਰਹੇ ਹਾਂ', 'as': 'বতৰৰ পৃষ্ঠালৈ গৈ আছোঁ'
        },
        schemes: {
            'hi': 'योजनाओं के पृष्ठ पर जा रहे हैं', 'en': 'Going to schemes page', 'bn': 'স্কিম পৃষ্ঠায় যাচ্ছি',
            'mr': 'योजनांच्या पृष्ठावर जात आहे', 'te': 'పథకాల పేజీకి వెళ్తున్నాము', 'ta': 'திட்டங்கள் பக்கத்திற்கு செல்கிறோம்',
            'gu': 'યોજનાઓના પૃષ્ઠ પર જઈ રહ્યા છીએ', 'ur': 'اسکیموں کے صفحے پر جا رہے ہیں', 'kn': 'ಯೋಜನೆಗಳ ಪುಟಕ್ಕೆ ಹೋಗುತ್ತಿದ್ದೇವೆ',
            'or': 'ଯୋଜନା ପୃଷ୍ଠାକୁ ଯାଉଛି', 'ml': 'പദ്ധതികളുടെ പേജിലേക്ക് പോകുന്നു', 'pa': 'ਸਕੀਮਾਂ ਦੇ ਪੰਨੇ ਤੇ ਜਾ ਰਹੇ ਹਾਂ', 'as': 'আঁচনিৰ পৃষ্ঠালৈ গৈ আছোঁ'
        },
        home: {
            'hi': 'मुख्य पृष्ठ पर जा रहे हैं', 'en': 'Going to home page', 'bn': 'মূল পৃষ্ঠায় যাচ্ছি',
            'mr': 'मुख्य पृष्ठावर जात आहे', 'te': 'హోమ్ పేజీకి వెళ్తున్నాము', 'ta': 'முகப்பு பக்கத்திற்கு செல்கிறோம்',
            'gu': 'મુખ્ય પૃષ્ઠ પર જઈ રહ્યા છીએ', 'ur': 'ہوم پیج پر جا رہے ہیں', 'kn': 'ಹೋಮ್ ಪುಟಕ್ಕೆ ಹೋಗುತ್ತಿದ್ದೇವೆ',
            'or': 'ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ଯାଉଛି', 'ml': 'ഹോം പേജിലേക്ക് പോകുന്നു', 'pa': 'ਹੋਮ ਪੰਨੇ ਤੇ ਜਾ ਰਹੇ ਹਾਂ', 'as': 'মূল পৃষ্ঠালৈ গৈ আছোঁ'
        },
        about: {
            'hi': 'हमारे बारे में अनुभाग पर जा रहे हैं', 'en': 'Going to about section', 'bn': 'আমাদের সম্পর্কে বিভাগে যাচ্ছি',
            'mr': 'आमच्याबद्दल विभागात जात आहे', 'te': 'మా గురించి విభాగానికి వెళ్తున్నాము', 'ta': 'எங்களைப் பற்றி பகுதிకు செல்கிறோம்',
            'gu': 'અમારા વિશે વિભાગ પર જઈ રહ્યા છીએ', 'ur': 'ہمارے بارے میں سیکشن پر جا رہے ہیں', 'kn': 'ನಮ್ಮ ಬಗ್ಗೆ ವಿಭಾಗಕ್ಕೆ ಹೋಗುತ್ತಿದ್ದೇವೆ',
            'or': 'ଆମ ବିଷୟରେ ବିଭାଗକୁ ଯାଉଛି', 'ml': 'ഞങ്ങളെക്കുറിച്ച് വിഭാഗത്തിലേക്ക് പോകുന്നു', 'pa': 'ਸਾਡੇ ਬਾਰੇ ਭਾਗ ਤੇ ਜਾ ਰਹੇ ਹਾਂ', 'as': 'আমাৰ বিষয়ে বিভাগলৈ গৈ আছোঁ'
        },
        contact: {
            'hi': 'संपर्क अनुभाग पर जा रहे हैं', 'en': 'Going to contact section', 'bn': 'যোগাযোগ বিভাগে যাচ্ছি',
            'mr': 'संपर्क विभागात जात आहे', 'te': 'సంప్రదింపు విభాగానికి వెళ్తున్నాము', 'ta': 'தொடர்பு பகுதிக்கு செல்கிறோம்',
            'gu': 'સંપર્ક વિભાગ પર જઈ રહ્યા છીએ', 'ur': 'رابطہ سیکشن پر جا رہے ہیں', 'kn': 'ಸಂಪರ್ಕ ವಿಭಾಗಕ್ಕೆ ಹೋಗುತ್ತಿದ್ದೇವೆ',
            'or': 'ଯୋଗାଯୋଗ ବିଭାଗକୁ ଯାଉଛି', 'ml': 'ബന്ധപ്പെടുക വിഭാഗത്തിലേക്ക് പോകുന്നു', 'pa': 'ਸੰਪਰਕ ਭਾਗ ਤੇ ਜਾ ਰਹੇ ਹਾਂ', 'as': 'যোগাযোগ বিভাগলৈ গৈ আছোঁ'
        },
        signin: {
            'hi': 'लॉगिन पृष्ठ पर जा रहे हैं', 'en': 'Going to login page', 'bn': 'লগইন পৃষ্ঠায় যাচ্ছি',
            'mr': 'लॉगिन पृष्ठावर जात आहे', 'te': 'లాగిన్ పేజీకి వెళ్తున్నాము', 'ta': 'உள்நுழைவு பக்கத்திற்கு செல்கிறோம்',
            'gu': 'લોગિન પૃષ્ઠ પર જઈ રહ્યા છીએ', 'ur': 'لاگ ان پیج پر جا رہے ہیں', 'kn': 'ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಹೋಗುತ್ತಿದ್ದೇವೆ',
            'or': 'ଲଗଇନ୍ ପୃଷ୍ଠାକୁ ଯାଉଛି', 'ml': 'ലോഗിൻ പേജിലേക്ക് പോകുന്നു', 'pa': 'ਲੌਗਇਨ ਪੰਨੇ ਤੇ ਜਾ ਰਹੇ ਹਾਂ', 'as': 'লগইন পৃষ্ঠালৈ গৈ আছোঁ'
        },
        logout: {
            'hi': 'लॉग आउट कर रहे हैं', 'en': 'Logging out', 'bn': 'লগ আউট করছি',
            'mr': 'लॉग आउट करत आहे', 'te': 'లాగ్ అవుట్ అవుతున్నాము', 'ta': 'வெளியேறுகிறோம்',
            'gu': 'લોગ આઉટ કરી રહ્યા છીએ', 'ur': 'لاگ آؤٹ ہو رہے ہیں', 'kn': 'ಲಾಗ್ ಔಟ್ ಆಗುತ್ತಿದ್ದೇವೆ',
            'or': 'ଲଗ୍ ଆଉଟ୍ ହେଉଛି', 'ml': 'ലോഗ് ഔട്ട് ചെയ്യുന്നു', 'pa': 'ਲੌਗ ਆਉਟ ਕਰ ਰਹੇ ਹਾਂ', 'as': 'লগ আউট কৰি আছোঁ'
        }
    },
    actions: {
        detectingLocation: {
            'hi': 'आपका जिला खोजा जा रहा है...', 'en': 'Detecting location...', 'bn': 'আপনার অবস্থান চিহ্নিত করা হচ্ছে...',
            'mr': 'तुमचे स्थान शोधले जात आहे...', 'te': 'మీ స్థానాన్ని గుర్తిస్తున్నాము...', 'ta': 'உங்கள் இருப்பிடத்தைக் கண்டறிகிறோம்...',
            'gu': 'તમારું સ્થાન શોધાઈ રહ્યું છે...', 'ur': 'آپ کا مقام تلاش کیا جا رہا ہے...', 'kn': 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗುತ್ತಿದೆ...',
            'or': 'ଆପଣଙ୍କ ସ୍ଥାନ ଚିହ୍ନଟ କରାଯାଉଛି...', 'ml': 'നിങ്ങളുടെ സ്ഥാനം കണ്ടെത്തുന്നു...', 'pa': 'ਤੁਹਾਡੀ ਸਥਿਤੀ ਦਾ ਪਤਾ ਲਗਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...', 'as': 'আপোনাৰ স্থান চিনাক্ত কৰা হৈছে...'
        },
        updatingWeather: {
            'hi': 'जानकारी अपडेट की जा रही है...', 'en': 'Updating weather data...', 'bn': 'আবহাওয়ার তথ্য আপডেট করা হচ্ছে...',
            'mr': 'हवामान माहिती अपडेट केली जात आहे...', 'te': 'వాతావరణ సమాచారాన్ని అప్‌డేట్ చేస్తున్నాము...', 'ta': 'வானிலை தகவலைப் புதுப்பிக்கிறோம்...',
            'gu': 'હવામાન માહિતી અપડેટ થઈ રહી છે...', 'ur': 'موسم کا ڈیٹا اپ ڈیٹ کیا جا رہا ہے...', 'kn': 'ಹವಾಮಾನ ಡೇಟಾವನ್ನು ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...',
            'or': 'ପାଣିପାଗ ତଥ୍ୟ ଅପଡେଟ୍ କରାଯାଉଛି...', 'ml': 'കാലാവസ്ഥ വിവരങ്ങൾ പുതുക്കുന്നു...', 'pa': 'ਮੌਸਮ ਦਾ ਡੇਟਾ ਅਪਡੇਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...', 'as': 'বতৰৰ তথ্য আপডেট কৰা হৈছে...'
        },
        error: {
            'hi': 'क्षमा करें, मुझे समझ नहीं आया। कृपया पुनः प्रयास करें।', 'en': "I didn't understand. Please try again.",
            'bn': 'দুঃখিত, আমি বুঝতে পারিনি। আবার চেষ্টা করুন।', 'mr': 'क्षमस्व, मला समजले नाही. कृपया पुन्हा प्रयत्न करा.',
            'te': 'క్షమించండి, నాకు అర్థం కాలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.', 'ta': 'மன்னிக்கவும், எனக்கு புரியவில்லை. மீண்டும் முயற்சிக்கவும்.',
            'gu': 'ક્ષમા કરશો, મને સમજાયું નહીં. કૃપા કરીને ફરી પ્રયાસ કરો.', 'ur': 'معذرت، مجھے سمجھ نہیں آیا۔ براہ کرم دوبارہ کوشش کریں۔',
            'kn': 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.', 'or': 'କ୍ଷମା କରିବେ, ମୁଁ ବୁଝିପାରିଲି ନାହିଁ | ଦୟାକରି ପୁଣਿ ଚେଷ୍ਟା କରନ୍ତୁ |',
            'ml': 'ക്ഷമിക്കണം, എനിക്ക് മനസ്സിലായില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.', 'pa': 'ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।', 'as': 'দুঃখিত, মই বুজি নাপালোঁ। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।'
        },
        nothingToRead: {
            'hi': 'पढ़ने के लिए कुछ नहीं है।', 'en': 'Nothing to read.', 'bn': 'পড়ার মতো কিছু নেই।',
            'mr': 'वाचण्यासारखे काही नाही.', 'te': 'చదవడానికి ఏమీ లేదు.', 'ta': 'படிக்க எதுவும் இல்லை.',
            'gu': 'વાંચવા માટે કંઈ નથી.', 'ur': 'پڑھنے کے لیے کچھ نہیں ہے۔', 'kn': 'ಓದಲು ಏನೂ ಇಲ್ಲ.',
            'or': 'ପଢିବା ପାଇଁ କିଛି ନାହିଁ |', 'ml': 'വായിക്കാൻ ഒന്നുമില്ല.', 'pa': 'ਪੜ੍ਹਨ ਲਈ ਕੁਝ ਨਹੀਂ ਹੈ।', 'as': 'পঢ়িবলৈ একো নাই।'
        }
    }
};


let voices = [];
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
}
window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

function startVoiceAssistant() {
    const lang = document.getElementById('language')?.value || 'hi';
    recognition.lang = getLangCode(lang);
    
    if (!isListening) {
        try {
            recognition.start();
            isListening = true;
            updateMicUI(true);
            speakResponse(getGreeting(lang), recognition.lang);
        } catch (e) {
            console.error("Recognition start error:", e);
            isListening = false;
        }
    } else {
        recognition.stop();
        isListening = false;
        updateMicUI(false);
        }
    }
    
    
    recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log('Recognized Transcript:', transcript);
    handleCommand(transcript);
};

recognition.onend = () => {
    isListening = false;
    updateMicUI(false);
};

recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isListening = false;
    updateMicUI(false);
};

function handleCommand(transcript) {
    const currentLang = document.getElementById('language')?.value || 'hi';
    const langCode = getLangCode(currentLang);

    // Global Matcher: Check all language keywords for the command
    if (matchGlobalCommand(transcript, commands.read)) {
        readPageContent();
        return;
    }

    if (matchGlobalCommand(transcript, commands.location) && window.location.pathname.includes('weather.html')) {
        if (typeof detectLocation === 'function') {
            speakResponse(messages.actions.detectingLocation[currentLang] || messages.actions.detectingLocation['en'], langCode);
            detectLocation();
            return;
        }
    }

    if (matchGlobalCommand(transcript, commands.check) && window.location.pathname.includes('weather.html')) {
        if (typeof getWeather === 'function') {
            speakResponse(messages.actions.updatingWeather[currentLang] || messages.actions.updatingWeather['en'], langCode);
            getWeather();
            return;
        }
    }

    // Navigation
    if (matchGlobalCommand(transcript, commands.weather)) {
        navigate('weather.html', 'weather', currentLang, langCode);
    } else if (matchGlobalCommand(transcript, commands.schemes)) {
        navigate('schemes.html', 'schemes', currentLang, langCode);
    } else if (matchGlobalCommand(transcript, commands.home)) {
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            speakResponse(getNavigationMessage('home', currentLang), langCode);
            scrollToHome();
        } else {
            navigate('index.html', 'home', currentLang, langCode);
        }
    } else if (matchGlobalCommand(transcript, commands.about)) {
        if (window.location.pathname.includes('index.html')) {
            speakResponse(getNavigationMessage('about', currentLang), langCode);
            scrollToAbout();
        } else {
            navigate('index.html#about', 'about', currentLang, langCode);
        }
    } else if (matchGlobalCommand(transcript, commands.contact)) {
        if (window.location.pathname.includes('index.html')) {
            speakResponse(getNavigationMessage('contact', currentLang), langCode);
            scrollToContact();
        } else {
            navigate('index.html#contact', 'contact', currentLang, langCode);
        }
    } else if (matchGlobalCommand(transcript, commands.signin)) {
        navigate('signin.html', 'signin', currentLang, langCode);
    } else if (matchGlobalCommand(transcript, commands.logout)) {
        speakResponse(getNavigationMessage('logout', currentLang), langCode);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => window.location.reload(), 1500);
    } else {
        const errorMsg = messages.actions.error[currentLang] || messages.actions.error['en'];
        speakResponse(errorMsg, langCode);
    }
}

function matchGlobalCommand(transcript, keywordList) {
    // Cross-language matching: check if the transcript contains any keyword from any language
    return keywordList.some(keyword => transcript.includes(keyword.toLowerCase()));
}

function navigate(url, targetKey, lang, langCode) {
    speakResponse(getNavigationMessage(targetKey, lang), langCode);
    setTimeout(() => window.location.href = url, 1500);
}

function readPageContent() {
    let textToRead = "";
    const lang = document.getElementById('language')?.value || 'hi';
    const nothingMsg = messages.actions.nothingToRead[lang] || messages.actions.nothingToRead['en'];

    if (window.location.pathname.includes('weather.html')) {
        textToRead = (document.getElementById('currentWeather')?.innerText || "") + " " + 
                     (document.getElementById('advisory')?.innerText || "") + " " + 
                     (document.getElementById('cropSuggestion')?.innerText || "");
    } else if (window.location.pathname.includes('schemes.html')) {
        // For schemes, we wait a bit to ensure cards are rendered
        const grid = document.getElementById('schemesGrid');
        if (grid && grid.children.length > 0) {
            textToRead = grid.innerText;
        } else {
            textToRead = nothingMsg;
        }
    } else {
        textToRead = document.getElementById('about')?.innerText || "Bharat Krishi Mitra - Digital companion for farmers.";
    }

    // Clean up text (remove extra newlines/spaces often added by translation engines)
    const cleanedText = textToRead.replace(/\n\s*\n/g, '\n').trim();
    
    // If Urdu, we give a tiny bit more time for RTL layout to settle
    const delay = lang === 'ur' ? 500 : 100;
    setTimeout(() => {
        speakResponse(cleanedText || nothingMsg, getLangCode(lang));
    }, delay);
}

function getLangCode(lang) {
    const codes = {
        'hi': 'hi-IN', 'en': 'en-US', 'bn': 'bn-IN', 'mr': 'mr-IN', 'te': 'te-IN',
        'ta': 'ta-IN', 'gu': 'gu-IN', 'ur': 'ur-PK', 'kn': 'kn-IN', 'or': 'or-IN',
        'ml': 'ml-IN', 'pa': 'pa-IN', 'as': 'as-IN'
    };
    return codes[lang] || 'hi-IN';
}

function getGreeting(lang) {
    const g = {
        'hi': 'नमस्ते, मैं आपकी क्या मदद कर सकता हूँ?',
        'en': 'Hello, how can I help you?',
        'bn': 'নমস্কার, আমি আপনাকে কিভাবে সাহায্য করতে পারি?',
        'mr': 'नमस्कार, मी तुम्हाला कशी मदत करू शकतो?',
        'te': 'నమస్తే, నేను మీకు ఎలా సహాయం చేయగలను?',
        'ta': 'வணக்கம், நான் உங்களுக்கு எப்படி உதவ முடியும்?',
        'gu': 'નમસ્તે, હું તમારી શું મદદ કરી શકું?',
        'ur': 'ہیلو، میں آپ کی کیا مدد کر سکتا ہوں؟',
        'kn': 'ನಮಸ್ತೆ, ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
        'or': 'ନମସ୍କାର, ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
        'ml': 'നമസ്കാരം, എനിക്ക് എങ്ങനെ സഹായിക്കാനാകും?',
        'pa': 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
        'as': 'নমস্কাৰ, মই আপোনাক কেনেকৈ সহায় কৰিব পাৰো?'
    };
    return g[lang] || g['hi'];
}

function getNavigationMessage(target, lang) {
    return messages.navigation[target]?.[lang] || messages.navigation[target]?.['en'] || 'OK';
}

function speakResponse(text, lang) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Refresh voices if empty
    if (voices.length === 0) voices = window.speechSynthesis.getVoices();

    // Find best matching voice
    const voice = voices.find(v => v.lang === lang) || 
                  voices.find(v => v.lang.startsWith(lang.split('-')[0])) ||
                  voices.find(v => v.lang.startsWith('en'));
    
    if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
    } else {
        utterance.lang = lang;
    }

    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
}


function updateMicUI(active) {
    const btn = document.getElementById('voiceMicBtn');
    if (btn) {
        btn.style.backgroundColor = active ? '#ff4444' : 'white';
        btn.innerHTML = active ? '🛑' : '🎤';
        btn.style.boxShadow = active ? '0 0 20px #ff4444' : '0 4px 15px rgba(0,0,0,0.2)';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('voiceMicBtn')) return;
    const mic = document.createElement('div');
    mic.id = 'voiceMicBtn';
    mic.innerHTML = '🎤';
    mic.style.cssText = `
        position: fixed; bottom: 20px; left: 20px; background: white;
        padding: 15px; border-radius: 50%; cursor: pointer; z-index: 1500;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-size: 24px;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.3s ease;
    `;
    mic.onclick = startVoiceAssistant;
    document.body.appendChild(mic);
});

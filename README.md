# 🔍 Discourse Plugin Detector - Browser Extension

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=google-chrome)](https://chrome.google.com/webstore)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox-Add--ons-orange?logo=firefox)](https://addons.mozilla.org/firefox/)
[![GitHub Stars](https://img.shields.io/github/stars/username/discourse-plugin-detector?style=social)](https://github.com/ibrahmsql/discourse-plugin-detector)
[![License](https://img.shields.io/badge/license-Apache-green.svg)](LICENSE)

**The most comprehensive Discourse plugin detection tool** - Instantly identify 40+ Discourse plugins, themes, and technology stack with confidence scoring. Perfect for Discourse administrators, developers, security researchers, and forum analysts.

## 🚀 **Why Choose Discourse Plugin Detector?**

### ⚡ **Lightning Fast Detection**
- **40+ Plugin Signatures** - Detect discourse-chat, discourse-poll, discourse-calendar, and more
- **Real-time Analysis** - Instant results as you browse Discourse forums
- **Zero Performance Impact** - Lightweight and optimized for speed

### 🎯 **Features**
- **🔬 Confidence Scoring System** - High/Medium/Low confidence levels for accurate detection
- **📊 Technology Stack Analysis** - Identify Ember.js, jQuery, Bootstrap, PostgreSQL, Redis
- **🏷️ Smart Categorization** - 16 categories: Content, Communication, Moderation, Security, etc.
- **🎨 Beautiful UI** - Wappalyzer-inspired interface with modern design

### 🌐 **Cross-Browser Support**
- ✅ **Chrome Extension** - Full compatibility with Chromium browsers
- ✅ **Firefox Add-on** - Native Firefox support with optimized manifest
- ✅ **Edge Compatible** - Works seamlessly on Microsoft Edge

## 📥 **Installation**

### Chrome Web Store
```bash
# Coming Soon - Direct installation from Chrome Web Store
```

### Firefox Add-ons
```bash
# Coming Soon - Direct installation from Firefox Add-ons
```

### Manual Installation (Developer Mode)
1. **Download** the latest release
2. **Extract** the ZIP file
3. **Open** Chrome/Firefox extension management
4. **Enable** Developer mode
5. **Load** unpacked extension

## 🔧 **How to Use**

1. **Visit any Discourse forum** (e.g., meta.discourse.org)
2. **Click the extension icon** in your browser toolbar
3. **View detected plugins** with confidence scores and categories
4. **Analyze technology stack** and security information

## 🎯 **Detected Plugins & Technologies**

### 🔌 **Core Plugins**
- discourse-chat, discourse-poll, discourse-calendar
- discourse-reactions, discourse-voting, discourse-assign
- discourse-solved, discourse-gamification, discourse-math

### 💼 **Business & Enterprise**
- discourse-subscriptions, discourse-patreon, discourse-advertising
- discourse-saml, discourse-oauth2, discourse-ldap
- discourse-automation, discourse-policy, discourse-templates

### 🛡️ **Security & Moderation**
- discourse-akismet, discourse-perspective, discourse-user-notes
- discourse-post-voting, discourse-translator, discourse-saved-search

### 🎨 **Themes & UI**
- Custom CSS detection, Theme component analysis
- Bootstrap, Font Awesome, Custom fonts

### ⚙️ **Technology Stack**
- **Frontend**: Ember.js, jQuery, Handlebars, Moment.js
- **Backend**: Ruby on Rails, PostgreSQL, Redis
- **Infrastructure**: Nginx, Docker, CDN detection

## 🏆 **Why Developers Love It**

> "Essential tool for Discourse development. Saves hours of manual inspection!" - *Forum Developer*

> "Perfect for security audits and competitive analysis." - *Security Researcher*

> "Clean interface, accurate detection, exactly what I needed." - *Discourse Admin*

## 🔍 **SEO Keywords**

**Primary**: discourse plugin detector, discourse extension, forum analysis tool
**Secondary**: discourse security, plugin identification, forum technology detection
**Long-tail**: how to detect discourse plugins, discourse forum analysis browser extension

## 📊 **Features Comparison**

| Feature | Discourse Plugin Detector | Wappalyzer | BuiltWith |
|---------|---------------------------|------------|----------|
| Discourse-specific | ✅ **Specialized** | ❌ Generic | ❌ Generic |
| Plugin Detection | ✅ **40+ plugins** | ❌ Limited | ❌ Basic |
| Confidence Scoring | ✅ **Yes** | ❌ No | ❌ No |
| Real-time Analysis | ✅ **Instant** | ✅ Yes | ❌ Slow |
| Free to Use | ✅ **100% Free** | ⚠️ Limited | ❌ Paid |

## 🛠️ **For Developers**

### API Integration
```javascript
// Access detection results programmatically
chrome.runtime.sendMessage({action: 'getDetectionResults'}, (response) => {
  console.log('Detected plugins:', response.plugins);
  console.log('Technology stack:', response.technologies);
});
```

### Custom Plugin Signatures
```javascript
// Add custom plugin detection rules
const customPlugin = {
  name: 'my-custom-plugin',
  signatures: {
    dom: ['.my-plugin-class'],
    scripts: ['/assets/my-plugin.js']
  }
};
```

## 🔒 **Privacy & Security**

- **🛡️ No Data Collection** - All analysis happens locally
- **🔐 Secure by Design** - No external API calls
- **👤 Privacy First** - No user tracking or analytics
- **📝 Open Source** - Transparent and auditable code

## 🌟 **Roadmap**

- [ ] **Chrome Web Store** publication
- [ ] **Firefox Add-ons** publication
- [ ] **API endpoint** detection
- [ ] **Plugin vulnerability** database
- [ ] **Export functionality** (JSON, CSV)
- [ ] **Dark mode** support
- [ ] **Multi-language** support

## 🤝 **Contributing**

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start
```bash
git clone https://github.com/username/discourse-plugin-detector.git
cd discourse-plugin-detector
npm install
npm run build
```

## 📄 **License**

APACHE2 License - see [LICENSE](LICENSE) file for details.

## 🔗 **Related Projects**

- [DiscourseMap](https://github.com/ibrahmsql/discoursemap) - Comprehensive Discourse security scanner
- [Discourse API](https://docs.discourse.org/) - Official Discourse API documentation
- [Discourse Meta](https://meta.discourse.org/) - Official Discourse community

## 📞 **Support**

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/ibrahmsql/discourse-plugin-detector/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/ibrahmsql/discourse-plugin-detector/discussions)
- 📧 **Email**: ib

---

**⭐ Star this repository if you find it useful!**

**🔍 Keywords**: discourse, plugin-detection, browser-extension, chrome-extension, firefox-addon, forum-analysis, security-research, web-technology, discourse-plugins, forum-security, plugin-scanner, discourse-themes, technology-detection, wappalyzer-alternative, discourse-admin-tools


## Desteklenen Tarayıcılar

- **Chrome**: Manifest V3 desteği ile
- **Firefox**: Manifest V2 uyumluluğu ile
- **Edge**: Chromium tabanlı sürümler
- **Opera**: Chromium tabanlı sürümler

## Kurulum

### Chrome/Edge için
1. `manifest.json` dosyasını kullanın
2. Chrome'da `chrome://extensions/` adresine gidin
3. "Geliştirici modu"nu etkinleştirin
4. "Paketlenmemiş uzantı yükle" butonuna tıklayın
5. `browser_extension` klasörünü seçin

### Firefox için
1. `manifest_firefox.json` dosyasını `manifest.json` olarak yeniden adlandırın
2. Firefox'ta `about:debugging` adresine gidin
3. "Bu Firefox" sekmesine tıklayın
4. "Geçici Eklenti Yükle" butonuna tıklayın
5. `manifest.json` dosyasını seçin

## Kullanım

### Temel Kullanım
1. Bir Discourse forumuna gidin
2. Tarayıcı araç çubuğundaki DiscourseMap ikonuna tıklayın
3. "Tarama Başlat" butonuna tıklayın
4. Sonuçları inceleyin

### Otomatik Tarama
- Eklenti, Discourse sitelerini otomatik olarak algılar
- Ayarlardan otomatik taramayı etkinleştirebilirsiniz
- Sonuçlar rozet olarak ikonda gösterilir

### Sonuçları Dışa Aktarma
1. Tarama tamamlandıktan sonra "Dışa Aktar" butonuna tıklayın
2. İstediğiniz formatı seçin (JSON, CSV, HTML)
3. Dosya otomatik olarak indirilir

## Tespit Edilen Eklentiler

### İçerik ve İletişim
- **discourse-polls**: Anket oluşturma
- **discourse-chat**: Gerçek zamanlı sohbet
- **discourse-calendar**: Etkinlik takvimi
- **discourse-reactions**: Emoji tepkileri
- **discourse-math**: LaTeX matematik desteği
- **discourse-spoiler-alert**: Spoiler etiketleri

### Moderasyon ve Yönetim
- **discourse-voting**: Özellik oylama
- **discourse-assign**: Konu atama
- **discourse-checklist**: Görev listeleri
- **discourse-follow**: Kullanıcı takibi
- **discourse-automation**: Otomasyon kuralları

### Kimlik Doğrulama
- **discourse-oauth2-basic**: OAuth2 kimlik doğrulama
- **discourse-saml**: SAML entegrasyonu
- **discourse-github-auth**: GitHub girişi
- **discourse-google-oauth2**: Google girişi

### Analitik ve Araçlar
- **discourse-prometheus**: Metrik toplama
- **discourse-sitemap**: SEO sitemap
- **discourse-gamification**: Oyunlaştırma

### Ve 30+ eklenti daha çeşitli kategorilerde!

## 🛠️ Technology Detection

The extension detects:
- **Discourse Version**: Forum software version
- **Ruby Version**: Programming language version
- **Ruby on Rails**: Web framework version
- **JavaScript Libraries**: jQuery, Ember.js, Bootstrap
- **Database Systems**: PostgreSQL detection
- **Caching Systems**: Redis detection

## Geliştirme

### Proje Yapısı
```
browser_extension/
├── manifest.json              # Chrome/Edge manifest
├── manifest_firefox.json      # Firefox manifest
├── content.js                 # İçerik betiği
├── popup.html                 # Popup arayüzü
├── popup.js                   # Popup mantığı
├── popup.css                  # Popup stilleri
├── background.js              # Chrome arka plan
├── background_firefox.js      # Firefox arka plan
└── icons/                     # Eklenti ikonları
    ├── icon16.svg
    ├── icon32.svg
    ├── icon48.svg
    └── icon128.svg
```

### Yeni Eklenti Ekleme
1. `content.js` dosyasındaki `pluginSignatures` objesine yeni eklenti ekleyin
2. Tespit yöntemlerini tanımlayın (DOM, script, CSS)
3. Güvenlik açığı bilgilerini `knownVulnerabilities` objesine ekleyin
4. Test edin ve doğrulayın

### Katkıda Bulunma
1. Projeyi fork edin
2. Yeni özellik dalı oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Dalınızı push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## İletişim

- **GitHub**: [DiscourseMap Repository](https://github.com/ibrahmsql/discoursemap)
- **Issues**: [Bug Reports & Feature Requests](https://github.com/ibrahmsql/discoursemap/issues)
- **Discussions**: [Community Discussions](https://github.com/ibrahmsql/discoursemap/discussions)

## Changelog

### v1.0.0 (2024)
- İlk sürüm
- 50+ eklenti tespiti
- Güvenlik açığı analizi
- Chrome ve Firefox desteği
- Otomatik tarama
- Çoklu format dışa aktarım

## Teşekkürler

- **Discourse Team**: Harika forum yazılımı için
- **Wappalyzer**: İlham veren teknoloji tespiti için
- **Community**: Geri bildirim ve katkılar için

---

**Not**: Bu eklenti, güvenlik araştırması ve eğitim amaçlıdır. Lütfen sorumlu bir şekilde kullanın ve hedef sistemlerin kullanım koşullarına uyun.
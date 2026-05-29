# Das Kapital - Oyun Uygulaması

Ekonomik sim ülasyonlu bir oyun uygulaması. React + Vite ile yapılmıştır.

## Proje Yapısı

```
DasKapital/
├── src/
│   ├── components/
│   │   ├── GlobalStyle.jsx          # Global stil bileşeni
│   │   ├── lobby/                   # Lobby ekran bileşenleri
│   │   │   ├── NameScreen.jsx       # Ad giriş ekranı
│   │   │   ├── LobbyScreen.jsx      # Oyuncu bekleme lobisi
│   │   │   └── PlayerRow.jsx        # Oyuncu satırı
│   │   ├── main/                    # Ana oyun ekranı bileşenleri
│   │   │   ├── Header.jsx           # Başlık ve para göstergesi
│   │   │   ├── ResourcesTab.jsx     # Kaynaklar sekmesi
│   │   │   ├── CompaniesTab.jsx     # Şirketler sekmesi
│   │   │   ├── CardsTab.jsx         # Kartlar sekmesi
│   │   │   └── BottomBar.jsx        # Alt düğmeler
│   │   ├── panels/                  # Açılır panel bileşenleri
│   │   │   ├── NotificationsPanel.jsx
│   │   │   ├── PlayersPanel.jsx
│   │   │   ├── SendPanel.jsx
│   │   │   └── QuarterVotePanel.jsx
│   │   └── shared/                  # Paylaşılan bileşenler
│   │       ├── Common.jsx           # PanelHeader, AdjBtn
│   │       └── QRCode.jsx           # QR kod
│   ├── constants/                   # Sabit değerler
│   │   ├── resources.js             # Kaynaklar
│   │   ├── companies.js             # Şirketler
│   │   ├── players.js               # Oyuncular
│   │   ├── cards.js                 # Kart verileri
│   │   ├── styles.js                # Stil sabitleri
│   │   └── index.js                 # Tümünü export et
│   ├── utils/                       # Yardımcı fonksiyonlar
│   │   ├── helpers.js               # Zaman ve temel fonksiyonlar
│   │   └── gameHelpers.js           # Oyun başlatma fonksiyonları
│   ├── App.jsx                      # Ana uygulama bileşeni
│   ├── main.jsx                     # React DOM entry point
│   └── index.css                    # Global stiller
├── index.html                       # HTML giriş noktası
├── package.json                     # Proje bağımlılıkları
├── vite.config.js                   # Vite konfigürasyonu
└── README.md                        # Bu dosya
```

## Kurulum ve Çalıştırma

### Gereksinimler

- **Node.js** 16+ sürümü

### Adımlar

1. **Node.js Kurulumu** (Eğer kurulu değilse):
   - https://nodejs.org/ adresinden LTS sürümünü indirip kurun

2. **Proje klasörüne gidin**:

   ```bash
   cd "d:\kutu oyunu\DasKapital"
   ```

3. **Bağımlılıkları yükleyin**:

   ```bash
   npm install
   ```

4. **Geliştirme sunucusunu başlatın**:

   ```bash
   npm run dev
   ```

5. **Tarayıcıda açın**:
   - Terminal'de gösterilen `http://localhost:5173` linkine tıklayın
   - Veya manuel olarak tarayıcıya yazın

## Build Etme

Üretime hazır sürümü oluşturmak için:

```bash
npm run build
```

Oluşturulan dosyalar `dist/` klasöründe bulunur.

## Bileşen Hiyerarşisi

```
App
├── Phase: NAME
│   └── NameScreen
├── Phase: LOBBY
│   └── LobbyScreen
│       ├── QRCode
│       └── PlayerRow
└── Phase: GAME
    ├── Header
    ├── Tabs (Main View)
    │   ├── ResourcesTab
    │   ├── CompaniesTab
    │   └── CardsTab
    ├── Panels
    │   ├── NotificationsPanel
    │   ├── PlayersPanel
    │   ├── SendPanel
    │   └── QuarterVotePanel
    └── BottomBar
```

## Oyun Mekanikeri

### Kaynaklar (Resources)

- LABOR, FOOD, SOUL, WASTE, ENERGY, DATA, STATUS
- Al/Sat işlemleri ile fiyatlar değişir

### Şirketler (Companies)

- Hisse alım/satımı
- Hissedar sıralaması

### Kartlar

- Politika kartları (POLİTİKA)
- Olay kartları (OLAY)
- Aktif kartları takip et

### Oyun Akışı

1. Ad gir (NAME)
2. Oyuncuları bekle (LOBBY)
3. Oyunu oyna (GAME)
   - Kaynaklar yönet
   - Şirket hisseleri al/sat
   - Kartları etkinleştir
   - Diğer oyunculara gönder
   - Quarter geçişi oylaması yap

## Teknoloji Stack

- **React 18**: UI bileşenleri
- **Vite**: Hızlı geliştirme ve build
- **Vanilla CSS**: Inline stiller ile UI

## Notlar

- Tüm stiller React bileşenleri içinde inline tanımlanmıştır
- Responsive tasarım 480px max-width için optimize edilmiştir
- Türkçe dil desteği bulunmaktadır

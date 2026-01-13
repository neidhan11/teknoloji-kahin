# Teknoloji Kahin 🔮

Yarının teknolojilerini bugünden gör! GitHub API kullanarak teknoloji trendlerini analiz eden ve tahmin eden sistem.

## 🚀 Özellikler

- **Trend Analizi**: GitHub'daki en popüler ve hızlı yükselen projeleri takip et
- **Skor Sistemi**: Her proje için trend skoru hesaplama
- **Otomatik Güncelleme**: GitHub Actions ile günlük veri güncelleme
- **Premium Dashboard**: Modern, karanlık tema arayüz
- **Filtreleme & Arama**: Projeleri ara ve sırala

## 📊 Canlı Demo

[https://KULLANICI_ADIN.github.io/teknoloji-kahin](https://KULLANICI_ADIN.github.io/teknoloji-kahin)

## 🛠️ Kurulum

1. Bu repoyu fork'la veya clone'la:
```bash
git clone https://github.com/KULLANICI_ADIN/teknoloji-kahin.git
cd teknoloji-kahin
```

2. (Opsiyonel) Verileri manuel güncelle:
```bash
node scripts/fetch-data.js
```

3. GitHub Pages'i aktifleştir:
   - Settings → Pages → Source: main branch

## 📁 Dosya Yapısı

```
teknoloji-kahin/
├── index.html          # Ana dashboard
├── style.css           # Stiller
├── app.js              # Uygulama mantığı
├── data/
│   ├── trending.json   # Güncel trend verileri
│   └── history/        # Geçmiş veriler
├── scripts/
│   └── fetch-data.js   # Veri çekme scripti
└── .github/
    └── workflows/
        └── update-data.yml  # Günlük güncelleme
```

## 🔮 Trend Skoru Nasıl Hesaplanır?

```
Skor = (Star Puanı × 2) + Fork Puanı + npm Puanı + Yaş Bonusu
     × Aktivite Çarpanı
```

- **Star Puanı**: 1000 star = 1 puan (max 60)
- **Fork Puanı**: 500 fork = 1 puan (max 10)
- **Aktivite Çarpanı**: Son 7 gün içinde commit = 1.5x

## 📈 Veri Kaynakları

- [GitHub API](https://docs.github.com/en/rest) - Repo verileri
- [npm API](https://github.com/npm/registry/blob/main/docs/download-counts.md) - Download sayıları

## 💰 Maliyet

**0 TL** - Tüm servisler ücretsiz tier'larla çalışır.

## 📝 Lisans

MIT

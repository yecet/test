# Oğuzhan Kapukaya – Akademik Web Sitesi

> Next.js 15 App Router · TypeScript · Tailwind CSS · Vercel

Elektrik ve Elektronik Mühendisliği araştırma görevlisi **Oğuzhan Kapukaya** için geliştirilmiş, veritabanı gerektirmeyen modern akademik web sitesi. İçerikler tamamen TypeScript veri dosyaları üzerinden yönetilir.

---

## 🚀 Hızlı Başlangıç

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Tarayıcıda aç
# http://localhost:3000
```

---

## 📁 Proje Yapısı

```
webtest/
├── public/
│   ├── cv/
│   │   └── oguzhan-kapukaya-cv.pdf   ← CV dosyanızı buraya koyun
│   └── materials/
│       ├── devre-analizi/            ← Ders PDF'leri buraya
│       ├── elektronik-devreler/
│       ├── sinyaller-ve-sistemler/
│       ├── sayisal-tasarim/
│       └── mikrodenetleyiciler/
└── src/
    ├── app/                          ← Sayfa dosyaları
    │   ├── page.tsx                  → Ana Sayfa
    │   ├── hakkimda/page.tsx         → Hakkımda
    │   ├── cv/page.tsx               → CV
    │   ├── dersler/page.tsx          → Dersler Listesi
    │   ├── dersler/[slug]/page.tsx   → Ders Detayı
    │   ├── dersler/[slug]/materyaller/page.tsx → Materyaller
    │   ├── duyurular/page.tsx        → Duyurular
    │   ├── yayinlar/page.tsx         → Yayınlar
    │   ├── arastirma/page.tsx        → Araştırma Alanları
    │   └── iletisim/page.tsx         → İletişim
    └── data/                         ← İçerik buradan yönetilir
        ├── profile.ts                → Kişisel bilgiler
        ├── courses.ts                → Dersler
        ├── materials.ts              → Ders materyalleri
        ├── announcements.ts          → Duyurular
        ├── publications.ts           → Yayınlar
        └── research.ts               → Araştırma alanları
```

---

## ✏️ İçerik Güncelleme Rehberi

### 1. Yeni Materyal Eklemek

`src/data/materials.ts` dosyasını açın ve `materials` dizisine yeni bir nesne ekleyin:

```typescript
{
  id: "da-w5-slide",           // benzersiz ID (kurs-hafta-tür)
  courseSlug: "devre-analizi", // hangi ders
  title: "Hafta 5 – Çevre Analizi Slaytları",
  description: "Mesh analiz yöntemi ve örnekleri.",
  week: 5,                     // hafta numarası (genel materyal için null)
  type: "slayt",               // slayt | ders-notu | odev | lab | sinav | kaynak
  fileUrl: "/materials/devre-analizi/hafta5-slayt.pdf",
  fileSize: "2.8 MB",
  uploadedAt: "2024-10-14",    // YYYY-MM-DD
},
```

Ardından PDF dosyasını `public/materials/devre-analizi/` klasörüne koyun.

---

### 2. Yeni Yayın Eklemek

`src/data/publications.ts` dosyasını açın ve `publications` dizisine ekleyin:

```typescript
{
  id: "pub-013",               // benzersiz ID
  title: "Makale Başlığı",
  authors: ["O. Kapukaya", "Diğer Yazar"],
  venue: "IEEE Transactions on ...",
  year: 2025,
  type: "journal",             // journal | conference | book-chapter | thesis | preprint
  doi: "10.1109/...",
  url: "https://ieeexplore.ieee.org/...",
  keywords: ["anahtar", "kelime"],
  abstract: "Opsiyonel özet metni.",
},
```

---

### 3. Yeni Duyuru Eklemek

`src/data/announcements.ts` dosyasını açın ve `announcements` dizisine ekleyin:

```typescript
{
  id: "ann-009",
  title: "Duyuru Başlığı",
  content: "Duyuru içeriği buraya...",
  date: "2025-05-01",          // YYYY-MM-DD
  relatedCourse: "devre-analizi", // veya null (genel duyuru için)
  important: false,            // true ise kırmızı önemli rozeti gösterilir
},
```

---

### 4. Kişisel Bilgileri Güncellemek

`src/data/profile.ts` dosyasını düzenleyin. E-posta, ofis, biyografi, sosyal bağlantılar vb. tüm kişisel bilgiler burada.

---

### 5. CV'yi Güncellemek

1. Yeni CV dosyanızı `oguzhan-kapukaya-cv.pdf` olarak kaydedin.
2. `public/cv/` klasörüne koyun.
3. Git'e gönderin — eski dosya otomatik olarak değiştirilir.

---

## 🌐 GitHub'a Yükleme

```bash
# İlk kez yüklemek için:
git init
git add .
git commit -m "İlk commit – akademik web sitesi"

# GitHub'da yeni bir repo oluşturun, ardından:
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
git branch -M main
git push -u origin main

# Sonraki güncellemeler için:
git add .
git commit -m "Materyal güncellendi / Yayın eklendi"
git push
```

---

## ⚡ Vercel'e Deploy Etmek

### İlk Kez Deploy

1. [vercel.com](https://vercel.com) adresine gidin.
2. GitHub hesabınızla giriş yapın.
3. **"Add New Project"** → GitHub reposunu seçin.
4. Framework olarak **Next.js** otomatik seçilir.
5. **"Deploy"** düğmesine tıklayın.
6. Birkaç dakika içinde siteniz `https://proje-adı.vercel.app` adresinde yayında olur.

### Otomatik Güncelleme

Her `git push` sonrasında Vercel otomatik olarak yeni bir build alır ve yayınlar. Herhangi bir ek ayar gerekmez.

---

## 🔗 Özel Domain (Custom Domain) Bağlamak

1. Vercel'de projenizi açın → **Settings** → **Domains**.
2. **"Add Domain"** alanına domain adınızı yazın (örn. `oguzhankapukaya.com`).
3. Vercel size iki DNS kaydı gösterir:
   - **A kaydı**: `76.76.21.21`
   - **CNAME kaydı**: `cname.vercel-dns.com`
4. Domain sağlayıcınızın (GoDaddy, Namecheap vb.) DNS panelini açın.
5. Bu iki kaydı ekleyin.
6. DNS yayılması 10 dakika–48 saat sürebilir.
7. Vercel otomatik olarak **ücretsiz SSL** sertifikası atar.

---

## 🛠 Geliştirme Komutları

```bash
npm run dev      # Geliştirme sunucusunu başlat (http://localhost:3000)
npm run build    # Production build al (hata kontrolü)
npm run lint     # ESLint ile kod kalitesi kontrolü
npm run start    # Production build'i yerel çalıştır
```

---

## 📋 Teknoloji Yığını

| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| Next.js | 15+ | App Router, SSG |
| TypeScript | 5+ | Tip güvenliği |
| Tailwind CSS | 4+ | Stil |
| Vercel | — | Hosting + CDN |

---

## 🆘 Sık Sorulan Sorular

**S: PDF dosyaları görünmüyor?**
Dosyanın `public/materials/DERS-ADI/dosya.pdf` konumunda olduğundan emin olun. `src/data/materials.ts` içindeki `fileUrl` alanının başında `/` olmalı: `/materials/devre-analizi/hafta1.pdf`

**S: Yaptığım değişiklik sitede görünmüyor?**
`git push` yaptıktan sonra Vercel dashboard'dan build'in tamamlandığını kontrol edin (1–3 dakika).

**S: TypeScript hatası alıyorum?**
`npm run build` çalıştırın ve hata mesajını inceleyin. Genellikle eksik alan veya tip uyumsuzluğu olur.

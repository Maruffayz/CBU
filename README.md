# 🏦 CBU – Shaxsiy moliya platformasi (MyFin fork)

CBU – bu [MyFin](https://github.com/aFaneca/myfin) shaxsiy moliya platformasining moslashtirilgan forki bo‘lib, foydalanuvchiga xarajatlar va daromadlarni yuritish, byudjet tuzish va statistikani ko‘rish imkonini beradi.

Bu repozitoriyada faqat **backend API** va **web frontend** bor. Mobil ilova (Android) qismi olib tashlangan.

---

## 📁 Tuzilma

- `project` – Node.js / Express asosidagi **REST API** (MyFin API fork)
- `web` – React + TypeScript asosidagi **web frontend** (MyFin web fork)

Har bir qism o‘z README fayliga ega:

- Backend bo‘yicha batafsil: `project/README.md`
- Frontend bo‘yicha batafsil: `web/README.md`

---

## 🚀 Ishga tushirish (lokal development uchun qisqa ko‘rsatma)

### 1. Backend (API)

```bash
cd project
npm install
npm run dev
```

Bu bosqichda sizga MySQL bazasi va tegishli muhit o‘zgaruvchilarini (`DB_NAME`, `DB_USER`, `DB_PW`, `DB_HOST`, `DB_PORT` va hokazo) to‘g‘ri sozlash kerak bo‘ladi. To‘liq ko‘rsatmalar uchun `project/README.md` faylini ko‘ring.

### 2. Frontend (Web)

Alohida terminal oynasida:

```bash
cd web
npm install
npm run dev
```

Frontend `Vite` yordamida ishlaydi va backend API manzilini tegishli `VITE_MYFIN_BASE_API_URL` konfiguratsiyasi orqali oladi (Dockerda build arg sifatida, dev rejimida esa `.env` fayli orqali sozlash mumkin). Batafsil ma’lumot: `web/README.md`.

---

## 🌐 Til va tarjimalar

Frontend ilovada ko‘p tillilik qo‘llab-quvvatlanadi. O‘zbek tili uchun tarjimalar:

- `web/public/locales/uz/translation.json`

Ushbu fayl orqali interfeys matnlarini o‘zbek tiliga moslab tahrir qilishingiz mumkin.

---

## 🐳 Docker (ixtiyoriy)

Loyiha Docker bilan ham ishlashi mumkin (backend va frontend uchun alohida Dockerfile’lar mavjud):

- Backend Dockerfile: `project/Dockerfile`
- Frontend Dockerfile: `web/Dockerfile`

Odatda quyidagicha ishlatiladi:

1. MySQL konteynerini ishga tushirish
2. `project` uchun image build qilish va env o‘zgaruvchilarni berib ishga tushirish
3. `web` uchun image build qilish va `VITE_MYFIN_BASE_API_URL` orqali API manzilini ko‘rsatish

To‘liq konfiguratsiya va parametrlar uchun har bir papkadagi README’larni ko‘ring.

---

## 📜 Litsenziya

Bu loyiha asl MyFin loyihasi kabi ochiq manbali bo‘lib, litsenziya shartlari `LICENSE` faylida ko‘rsatilgan.

# RPI Control demo

Jde o demo variantu aplikace pro monitorování malé farmy sedmi jednodeskových počítačů **Raspberry Pi**, které jsou uzpůsobeny pro zcela konkrétní kontinuálně probíhající úkol. Aplikace umožňuje uložení odkazu na plochu mobilního telefonu iPhone v režimu **Progressive Web App** a tváří a používá se potom jako nativní aplikace, což zvyšuje komfort při jejím každodenním používání.

Aplikace je dostupná on-line na adrese https://scraper.shopimo.cz/rpi-control-demo

## Funkce

- **Přihlášení** uživatele e-mailem a heslem, token se ukládá do `localStorage`, takže přihlášení přežije zavření aplikace.
- **Přehled strojů**: seznam všech Raspberry Pi se stavem (online / offline / pozastaveno), časem od poslední odvedené práce a výkonností za poslední 1, 3 a 8 hodin.
- **Detail stroje**: podrobné údaje o konkrétním zařízení (kdy byl naposled online, kdy naposled uložil na server dílčí výsledek své práce, počty úloh za hodinu a výkonnost v %) a přepínač pro **aktivaci / deaktivaci** stroje na dálku.
- **Automatické obnovování** dat každých 30 sekund a ruční obnovení tlačítkem.
- **Barevné vyhodnocení výkonnosti** vůči očekávané rychlosti stroje (červená < 50 %, oranžová < 66 %, černá < 100 %, zelená ≥ 100 %).

## Technické řešení

Aplikace je čistě klientská **SPA (single-page application)** postavená v Reactu. Veškerá data získává z REST API na serveru, které není součástí toho repositáře. 

### Architektura

```
src/
├── main.jsx               vstupní bod, obalí aplikaci do AuthProvideru
├── App.jsx                hlavní komponenta, přepíná přihlášení / seznam / detail
├── context/
│   └── AuthContext.jsx    přihlášení, odhlášení, správa tokenu, sdílené formátovací funkce
└── components/
   ├── MenuBar.jsx        horní lišta (logo, zpět, odhlášení)
   ├── LoginForm.jsx      přihlašovací formulář
   ├── MachinesList.jsx   seznam strojů
   ├── MachineDetail.jsx  detail stroje s přepínačem aktivity
   └── Loading.jsx        indikátor načítání    
```

- **Stav aplikace**: lokální stav komponent (`useState`, `useEffect`). Přihlášení a sdílené pomocné funkce poskytuje **React Context** (`AuthContext`). Nepoužívá se router ani externí state management. Mezi seznamem a detailem se přepíná podle zvoleného zařízení v `App.jsx`.
- **Komunikace s API**: knihovna **Axios**. Po přihlášení se do všech požadavků automaticky přidává hlavička `x-authorization: Bearer <token>`. Globální interceptor při odpovědi `401 Unauthorized` uživatele automaticky odhlásí.
- **Periodické načítání**: polling přes `setInterval` (30 s), interval se při odchodu z obrazovky ruší.

### PWA

- `public/site.webmanifest` s `"display": "standalone"`, názvem a ikonami.
- Meta tagy pro iOS v `index.html` (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon`).
- Po přidání na plochu přes Safari → *Sdílet* → *Přidat na plochu* se aplikace spouští na celou obrazovku bez ovládacích prvků prohlížeče.

## Použité technologie

| Oblast | Technologie |
|---|---|
| UI framework | [React 19](https://react.dev/) |
| Build a dev server | [Vite 7](https://vite.dev/) + `@vitejs/plugin-react` |
| Mobilní UI komponenty | [Konsta UI](https://konstaui.com/) (téma iOS) |
| Styly | [Tailwind CSS 4](https://tailwindcss.com/) (`@tailwindcss/vite`) |
| Ikony | [Lucide React](https://lucide.dev/) |
| HTTP klient | [Axios](https://axios-http.com/) |
| Linting | ESLint 9 (`eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) |

## Spuštění

```bash
npm install
npm run dev       # vývojový server
npm run build     # produkční build do složky dist/
npm run preview   # náhled produkčního buildu
npm run lint      # kontrola kódu
```



# 🏠 Gestaffitto: gestione affitto e utenze

Un'area riservata per gestire un affitto senza Excel e senza messaggi sparsi: pagamenti mensili, bollette, ricevute PDF e documenti dell'immobile, con una vista per il proprietario e una per l'inquilino.

[![Licenza MIT](https://img.shields.io/badge/licenza-MIT-green.svg)](LICENSE)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Supabase](https://img.shields.io/badge/Supabase-backend-3ecf8e)

**👉 [Prova la demo](https://gestione-affitto-casa-public.vercel.app/)** · **📬 [Entra nella lista d'attesa per la versione online](https://gestaffitto-landing.vercel.app/)**

> La demo usa solo dati di esempio. Se non vuoi installare nulla, puoi iscriverti alla lista d'attesa della versione online già pronta, pensata per proprietari con 1-5 immobili.

## Screenshot

| Vista inquilino | Vista proprietario |
| --- | --- |
| ![Vista inquilino](https://github.com/user-attachments/assets/428d5e1c-1a90-4ae6-b28a-a7963288aa30) | ![Vista proprietario](https://github.com/user-attachments/assets/1a4bea00-cfc5-466b-a1f2-188852de523c) |

## Cosa fa

**Area proprietario** (accesso protetto da PIN)
- Controlla scadenza del canone e stato di ogni mese.
- Segna un pagamento come pagato o in attesa con un tocco.
- Carica le bollette in PDF (luce, gas, acqua, internet, tari, assicurazione casa) indicando totale e quota dell'inquilino.
- Genera la ricevuta di pagamento in PDF direttamente dal browser.

**Area inquilino**
- Consulta lo storico mese per mese con canone, utenze e totale.
- Scarica le singole bollette e la ricevuta PDF una volta saldato il mese.
- Apre i documenti dell'immobile (per esempio APE e visura catastale).

## Stack

- **Frontend:** React, TypeScript, Vite, Lucide React, jsPDF
- **Backend:** Supabase (PostgreSQL e Storage per i PDF)
- **Hosting:** Vercel (va bene anche GitHub Pages)

## Installazione

Servono Node.js 18 o superiore e un account gratuito su [Supabase](https://supabase.com).

### 1. Clona il repository

```bash
git clone https://github.com/federbru96/gestione-affitto-casa-public.git
cd gestione-affitto-casa-public
npm install
```

### 2. Crea il progetto Supabase

1. Crea un nuovo progetto su Supabase.
2. Crea le tabelle `tenants` (inquilino e dati dell'immobile) e `payments` (pagamenti mensili).
3. Crea due bucket di Storage: `bollette` (PDF delle utenze) e `documenti-immobile` (APE, visura e altri documenti).
4. Attiva la **Row Level Security** su tutte le tabelle e limita la scrittura al solo proprietario.

### 3. Configura le variabili d'ambiente

Copia il file di esempio e inserisci i valori che trovi in Supabase, sotto *Project Settings → API*:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://tuo-progetto.supabase.co
VITE_SUPABASE_ANON_KEY=la_tua_chiave_anon
```

Usa **solo** la chiave `anon` (pubblica). Non inserire mai la chiave `service_role` nel codice o nel repository.

### 4. Avvia in locale

```bash
npm run dev
```

### 5. Pubblica su Vercel

1. Importa il repository su [Vercel](https://vercel.com).
2. Aggiungi le due variabili `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nelle impostazioni del progetto.
3. Premi **Deploy**.

## Sicurezza e privacy

- Il progetto non contiene credenziali: configurazione e chiavi stanno nel tuo `.env`, escluso dal repository.
- I dati restano nel **tuo** progetto Supabase, non su un servizio di terzi.
- Per un uso reale, non pubblicare dati o documenti di un inquilino su un'istanza accessibile a tutti: attiva la Row Level Security e proteggi l'accesso.

## Versione online (in valutazione)

Sto valutando una versione già pronta all'uso, senza installazione, per proprietari con pochi immobili. Se ti interessa, [iscriviti alla lista d'attesa](https://gestaffitto-landing.vercel.app/) e dimmi cosa vorresti trovare.

## Contribuire

Idee, segnalazioni di bug e pull request sono benvenute: apri una [issue](https://github.com/federbru96/gestione-affitto-casa-public/issues). Se il progetto ti è utile, una ⭐ aiuta a farlo conoscere.

## Licenza

Distribuito con licenza [MIT](LICENSE): puoi usarlo, modificarlo e riutilizzarlo liberamente.

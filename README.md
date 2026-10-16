# 🏠 RentFlow - Gestione Affitto & Spese

Applicazione web leggera per gestire un contratto di locazione transitorio: storico dei pagamenti, ripartizione delle utenze, ricevute PDF e documenti dell'immobile.

Questa è la **versione generica e pubblica**: contiene solo dati di esempio (inquilino fittizio "Mario Rossi"). Esiste una versione privata, con la stessa interfaccia e le stesse funzioni, usata per un immobile reale.

---

## ✨ Funzioni

* **Area Proprietario** protetta da **Supabase Auth** (email e password): aggiorna lo stato dei pagamenti con un click, carica le bollette in PDF, ripartisce le utenze e genera le ricevute.
* **Area Inquilino** in sola lettura: storico mensile, stato dei saldi, bollette scaricabili per ogni mese, ricevuta PDF per i mesi pagati e **documenti dell'immobile** (es. APE, visura).
* **Utenze**: inserimento di Luce, Gas, Acqua, Internet, ecc. con ricalcolo automatico del totale mensile; il PDF va su Supabase Storage.
* **Ricevute PDF** generate nel browser con `jsPDF`.

## 🛠️ Stack

React 18, TypeScript, Vite, Lucide React, jsPDF, Supabase (PostgreSQL, Auth, Storage). Hosting consigliato: Vercel.

---

## 🚀 Installazione

### 1. Clona e installa
```bash
git clone https://github.com/federbru96/gestione-affitto-casa-public.git
cd gestione-affitto-casa-public
npm install
```

### 2. Crea il progetto Supabase
1. Crea un nuovo progetto su [supabase.com](https://supabase.com).
2. Apri **SQL Editor** ed esegui `supabase/schema.sql`: crea le tabelle, le regole di sicurezza (RLS) e il bucket `bollette`.
3. In **Authentication → Users** crea il tuo utente proprietario (email e password).
4. Copia il suo UUID e lancia nel SQL Editor:
   ```sql
   insert into private.app_owners (user_id) values ('IL-TUO-UUID');
   ```
5. Inserisci il tuo inquilino nella tabella `tenants` e i mesi nella tabella `payments`.

### 3. Variabili d'ambiente
Copia `.env.example` in `.env` e inserisci URL e chiave **anon** del progetto (Project Settings → API):
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### 4. Avvia
```bash
npm run dev
```

---

## 🔐 Sicurezza

* La chiave `anon` è pubblica per natura: la protezione dei dati sta nelle **regole RLS** di `supabase/schema.sql`.
* Chiunque può **leggere** i dati dell'inquilino (la vista inquilino non richiede login); **scrivere** può solo l'utente presente in `private.app_owners`. Anche chi si registra con un altro account non ottiene permessi di scrittura.
* Il bucket `bollette` è pubblico in lettura tramite link e accetta solo PDF fino a 5 MB.
* Non pubblicare mai la chiave `service_role` e non inserire dati reali di un inquilino se non hai attivato un login anche per lui.

## 📄 Documenti dell'immobile

La sezione legge la tabella `property_documents` (`title`, `file_url`). Per aggiungere un documento, carica il file dove preferisci (ad esempio in un bucket Supabase) e inserisci una riga con il link. La cartella `public/demo/` contiene tre PDF fittizi usati dai dati di esempio.

## 📜 Licenza

MIT, vedi `LICENSE`.

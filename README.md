# 🏠 Gestione Affitto & Spese (Open Source)

Applicazione web leggera, moderna e incentrata sulla privacy, sviluppata in **React**, **TypeScript** e **Supabase**, nata per gestire in modo trasparente e digitale i contratti di locazione transitori e la suddivisione delle bollette/utenze tra proprietario e inquilino.

---

## ✨ Caratteristiche Principali

* **Doppia Vista (Proprietario / Inquilino):**
  * **Area Proprietario:** Accessibile tramite PIN protetto, permette di monitorare le scadenze, aggiornare gli stati dei pagamenti con un click, caricare nuove bollette in PDF e generare ricevute di pagamento conformi.
  * **Area Inquilino:** Permette alla parte conduttrice di consultare lo storico dei mesi, verificare lo stato dei pagamenti, scaricare le ricevute PDF ufficiali e visualizzare i documenti dell'immobile (es. APE, Visura Catastale).
* **Gestione Automatica delle Utenze:** Inserimento rapido delle bollette (Luce, Gas, Acqua, Internet, ecc.) con ricalcolo automatico del totale mensile e allegato PDF collegato tramite Supabase Storage.
* **Generazione Ricevute PDF:** Creazione istantanea di ricevute di pagamento formali direttamente dal browser grazie a `jsPDF`.
* **Architettura "Security via Frontend Logic":** Progettato per mantenere i dati isolati e sicuri, separando la logica pubblica del codice dalle credenziali di produzione.

Vista Inquilino
<img width="1035" height="883" alt="Screenshot 2026-10-02 115525" src="https://github.com/user-attachments/assets/428d5e1c-1a90-4ae6-b28a-a7963288aa30" />

Vista Proprietario
<img width="1056" height="886" alt="Screenshot 2026-10-02 115546" src="https://github.com/user-attachments/assets/1a4bea00-cfc5-466b-a1f2-188852de523c" />

---

## 🛠️ Stack Tecnologico

* **Frontend:** React 19, TypeScript, Vite, Lucide React, jsPDF.
* **Backend & Database:** Supabase (PostgreSQL + Storage buckets per i PDF).
* **Hosting:** Vercel / GitHub Pages.

---

## 🚀 Guida all'Installazione (Per uso personale o sviluppo)

Se desideri clonare questo repository e configurare una tua istanza privata dell'applicazione con Supabase, segui questi passaggi:

### 1. Clona il repository
```bash
git clone https://github.com/federbru96/gestione-affitto-casa-public.git

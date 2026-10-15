# 🏠 RentFlow - Gestione Affitto & Spese (Micro-SaaS Ready)

Applicazione web moderna, leggera e focalizzata sulla gestione digitale e trasparente dei contratti di locazione transitori, il tracciamento dei pagamenti e la suddivisione delle spese/utenze tra proprietario e inquilino.

Nata per gestire un'esigenza reale di gestione immobiliare, l'architettura è stata strutturata in modo pulito e modulare, pronta per essere evoluta in un servizio **Micro-SaaS multi-proprietario**.

---

## ✨ Caratteristiche Principali

* **Doppia Vista (Proprietario Admin / Inquilino):**
  * **Area Proprietario:** Protetta da autenticazione reale (**Supabase Auth** via Email e Password). Permette di monitorare scadenze, aggiornare lo stato dei pagamenti con un click, caricare le bollette in PDF e generare le ricevute.
    * **Area Inquilino:** Accesso diretto per consultare lo storico mensile, verificare lo stato dei saldi, scaricare le ricevute PDF ufficiali e accedere ai documenti dell'immobile (es. APE, Visura Catastale).
    * **Gestione Automatica delle Utenze:** Inserimento rapido delle spese (Luce, Gas, Acqua, Internet) con ricalcolo automatico del totale e archiviazione del PDF su **Supabase Storage**.
    * **Generazione Ricevute PDF:** Modulo dedicato (`src/utils/pdfGenerator.ts`) per la creazione istantanea e il download di ricevute di pagamento conformi tramite `jsPDF`.
    * **Pronto per l'evoluzione SaaS:** Architettura pronta per l'isolamento dei dati per singolo proprietario (Multi-tenancy via Supabase RLS).

    ---

    ## 📸 Anteprima Interfaccia

    **Vista Inquilino**
    <img width="1035" height="883" alt="Vista Inquilino" src="https://github.com/user-attachments/assets/428d5e1c-1a90-4ae6-b28a-a7963288aa30" />

    **Vista Proprietario (Admin)**
    <img width="1056" height="886" alt="Vista Proprietario" src="https://github.com/user-attachments/assets/1a4bea00-cfc5-466b-a1f2-188852de523c" />

    ---

    ## 🛠️ Stack Tecnologico

    * **Frontend:** React 19, TypeScript, Vite, Lucide React, jsPDF.
    * **Backend & Database:** Supabase (PostgreSQL, Supabase Auth, Storage Buckets).
    * **Hosting:** Vercel / Netlify / StackBlitz.

    ---

    ## 🚀 Guida all'Installazione e Configurazione

    Segui questi passaggi per clonare e avviare il progetto in locale:

    ### 1. Clona il repository e installa le dipendenze
    ```bash
    git clone [https://github.com/federbru96/gestione-affitto-casa-public.git](https://github.com/federbru96/gestione-affitto-casa-public.git)
    cd gestione-affitto-casa-public
    npm install

# EdilRate — Private Beta v1

**Versione:** v0.9.0-beta.1  
**Data:** 15 luglio 2026  
**Ambiente:** Produzione Vercel  
**URL Beta:** https://edilrate.vercel.app

## 1. Obiettivo della beta

Validare con un gruppo ristretto di utenti e imprese:

- chiarezza della piattaforma;
- ricerca delle imprese;
- qualità delle schede aziendali;
- sistema di recensioni;
- richieste di preventivo;
- rivendicazione delle aziende;
- dashboard azienda e amministratore.

## 2. Funzionalità incluse

### Area pubblica

- Homepage responsive
- Ricerca per nome, città e categoria
- Filtri per città, provincia e categoria
- Ordinamento delle imprese
- Categorie dinamiche
- Profili aziendali
- Cover e gallery
- Recensioni e distribuzione valutazioni
- Una recensione per utente e azienda
- Modifica della propria recensione
- Richieste di preventivo senza registrazione
- Richieste di rivendicazione con account
- Blocco delle richieste di claim duplicate
- Pagina feedback
- Chi siamo, contatti e pagine legali

### Autenticazione

- Google
- Facebook
- Email e password
- Conferma email
- Recupero e modifica password
- Redirect differenziati per utenti e aziende

### Dashboard azienda

- Profilo dell’impresa
- Dati di contatto
- Descrizione e attività
- Logo, cover e gallery
- Visualizzazione preventivi ricevuti
- Aggiornamento dello stato dei preventivi

### Dashboard amministratore

- Statistiche generali
- Attività recenti
- Gestione aziende
- Import Excel
- Gestione recensioni
- Gestione preventivi
- Gestione feedback
- Approvazione e rifiuto dei claim

### Automazioni email

- Nuova recensione
- Nuovo preventivo
- Nuovo claim
- Nuovo feedback

Tecnologie utilizzate:

- Supabase Database
- Trigger PostgreSQL e pg_net
- Supabase Edge Functions
- Resend

### SEO

- Metadata globali e specifici
- Metadata dinamici delle imprese
- Open Graph
- Twitter Cards
- Canonical URL
- Sitemap dinamica
- robots.txt
- JSON-LD LocalBusiness

### Sicurezza

- Row Level Security
- Policy per utenti, aziende e amministratori
- Storage policy per immagini aziendali
- Secret server-side
- Blocco database delle recensioni e dei claim duplicati
- Protezione delle Edge Functions tramite webhook secret

## 3. Limitazioni note della beta

- Dominio definitivo non ancora collegato
- Email inviate tramite dominio di test Resend
- Possibile recapito delle notifiche nella cartella Spam
- Testi legali ancora provvisori
- Nessuna Google Maps interattiva
- Nessun sistema di abbonamenti o pagamenti
- Nessuna area preferiti
- Nessuna analytics avanzata
- Il numero iniziale di recensioni reali è limitato

## 4. Funzionalità volutamente rimandate

- Dominio edilrate.it
- Email professionali @edilrate.it
- SMTP personalizzato per Supabase Auth
- Verifica SPF, DKIM e DMARC
- Google Maps e ricerca vicino a me
- Piani Premium
- Pagamenti Stripe
- Analytics
- Notifiche dirette alle aziende
- Moderazione avanzata
- Linee guida ufficiali per le recensioni

## 5. Criteri di successo della beta

La beta sarà considerata positiva se:

- gli utenti comprendono il servizio senza spiegazioni;
- riescono a trovare un’impresa;
- riescono a pubblicare o modificare una recensione;
- riescono a inviare un preventivo;
- le aziende comprendono il processo di claim;
- la dashboard aziendale è utilizzabile autonomamente;
- non emergono problemi critici di sicurezza o affidabilità.

## 6. Stato della release

- Build di produzione superata
- Deploy Vercel completato
- Test desktop e mobile completati
- Login Google, Facebook ed email verificati
- Dashboard azienda verificata
- Dashboard amministratore verificata
- Notifiche email automatiche verificate
- Database di test ripulito

**Stato finale:** READY FOR PRIVATE BETA
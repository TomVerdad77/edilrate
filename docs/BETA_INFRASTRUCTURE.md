# EdilRate Beta Infrastructure

## Servizi

- Frontend: Vercel
- Repository: GitHub
- Database/Auth/Storage: Supabase
- Email transazionali: Resend

## Variabili Vercel

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Edge Function

- send-admin-notification

## Secret Supabase Edge Functions

- RESEND_API_KEY
- ADMIN_NOTIFICATION_EMAIL
- EMAIL_FROM
- WEBHOOK_SECRET

Non inserire mai i valori reali nel repository.

## Secret Supabase Vault

- edilrate_notification_function_url
- edilrate_webhook_secret

## Trigger database

- trigger_notify_admin_new_review
- trigger_notify_admin_new_quote
- trigger_notify_admin_new_claim
- trigger_notify_admin_new_feedback

## Vincoli principali

- reviews_user_company_unique
- claim_requests_active_unique

## Bucket Storage

- company-images
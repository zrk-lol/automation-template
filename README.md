# Automation template

Scheduled automation without a server, by **Varhex by Ȥrk Team**: GitHub Actions runs the script on a cron, it checks your sites and alerts you on Discord when one is down.

- Status code and response time for every URL, with a timeout
- A Markdown report in the terminal and on the GitHub run summary
- A Discord alert listing the sites that are down
- Easy to adapt for other jobs: reports, data imports, syncing between apps

## Start

```bash
npm install
cp .env.example .env   # list your URLS, optionally a DISCORD_WEBHOOK_URL
npm run dev
```

## Run it every 30 minutes on GitHub

1. Repository **Settings → Secrets and variables → Actions**
2. Variables: `URLS` (and optionally `SLOW_MS`)
3. Secret: `DISCORD_WEBHOOK_URL`
4. The workflow `.github/workflows/uptime.yml` runs on its own.

## Français

Automatisation sans serveur : GitHub Actions lance le script toutes les 30 minutes, vérifie vos sites et vous alerte sur Discord en cas de panne. Facile à adapter pour d’autres tâches planifiées (rapports, imports, synchronisation).

---
Made by [Varhex by Ȥrk Team](https://varhex.com) · MIT licence

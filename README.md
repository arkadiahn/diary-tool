# 📖 Diary-Tool

## About
Diary-Tool is a lightweight application designed for students to write weekly diary entries and monitor their project progress over time. By regularly reflecting on their work, students can stay organized, track their pace, and identify areas for improvement. The tool also includes visual graphs to make progress more tangible and motivating.

## Deploy
To deploy the Diary-Tool a few preqesites are required:
1. Keycloak Setup (with a authenticated client)
2. PostgreSQL DB

The `.env` file requires following values:
```sh
# ----------------------------------- Auth ----------------------------------- #
AUTH_SECRET="RANDOM_SECRET"
AUTH_KEYCLOAK_ID="{AUTH_KEYCLOAK_ID}"
AUTH_KEYCLOAK_SECRET="{AUTH_KEYCLOAK_SECRET}"
AUTH_KEYCLOAK_ISSUER="{AUTH_KEYCLOAK_ISSUER}"

# --------------------------------- Database --------------------------------- #
DATABASE_URL="{DATABASE_URL}"

# --------------------------------- Metadata --------------------------------- #
SITE_NAME="DiaryTool"			# Optional
SITE_DESCRIPTION="DiaryTool"	# Optional
```

## Develop

```sh
bun install
bun run dev
```

---

Developed by Arkadia Heilbronn gGmbH


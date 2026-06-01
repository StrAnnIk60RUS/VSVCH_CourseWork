# SQL-дамп базы данных VSVH

Файл **`vsvh_languages.sql`** — полный дамп PostgreSQL (схема `public` и демонстрационные данные). Инструкция по импорту и запуску — в [README.md](../../../README.md) в корне репозитория.

## Импорт (pgAdmin 4)

1. Создайте пустую базу **`vsvh_languages`** (UTF8).
2. Query Tool → Open File → `vsvh_languages.sql` → Execute.

## Импорт (psql)

```bash
psql -U postgres -d vsvh_languages -f server/database/dumps/vsvh_languages.sql
```

После импорта настройте `server/.env` (`DATABASE_URL`) и **не** запускайте `npm run db:seed`.

## Обновление дампа (для сопровождения репозитория)

Из корня репозитория, при настроенном `server/.env` и установленном PostgreSQL:

```bash
npm run db:migrate
npm run db:seed
```

Затем (Windows, путь к `pg_dump` может отличаться):

```powershell
cd server
# подставьте свой путь к pg_dump и параметры из DATABASE_URL
$env:PGPASSWORD = "ваш_пароль"
& "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -h localhost -p 5432 -U postgres -d vsvh_languages --no-owner --no-acl -f database/dumps/vsvh_languages.sql
```

При обновлении дампа удаляйте из файла строки `\restrict` / `\unrestrict` (pg_dump 18+) и посторонние схемы (например, случайную `SDGSD`), если они появились в локальной БД. В репозитории для сдачи дамп уже очищен.

Тестовые логины после импорта — в разделе «Тестовые учётные записи» в [README.md](../../../README.md).

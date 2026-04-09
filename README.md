# VSVH Languages

Веб-платформа для изучения языков с двумя основными ролями: студент и преподаватель.  
Проект объединяет клиент на React и API на Express + PostgreSQL в одном репозитории и покрывает ключевые сценарии: каталог курсов, обучение, прогресс, аналитика преподавателя, отчёты и напоминания.

## Для кого этот проект

- **Проверяющим и рекрутерам**: быстро показать функциональность и архитектуру учебного full-stack проекта.
- **Разработчикам**: дать понятные шаги для локального запуска, миграций БД и дальнейшей разработки.

## Ключевые возможности

### Студент
- Регистрация/вход, просмотр каталога и карточек курсов.
- Запись на курс, прохождение уроков и отправка ответов на упражнения.
- Отслеживание прогресса и история активности.
- Работа с избранным и напоминаниями.
- Формирование отчётов о прогрессе (PDF/DOCX) и отправка на e-mail (при наличии SMTP).

### Преподаватель
- Создание и управление своими курсами.
- CRUD для уроков и упражнений в своих курсах.
- Аналитика студентов по курсу: прогресс, активность, фильтры и сортировка.
- Экспорт списка студентов в CSV.
- Формирование сводных отчётов по курсу (PDF/DOCX) и отправка на e-mail.

### Гость
- Публичный просмотр каталога и карточек курсов.

## Технологический стек

- **Frontend**: React, TypeScript, React Router, Redux Toolkit, Webpack, Tailwind CSS.
- **Backend**: Node.js, Express, Sequelize, JWT, Zod.
- **Database**: PostgreSQL.
- **Отчёты и сервисы**: PDFKit, docx, Nodemailer.

## Структура репозитория

```text
VSVH/
├─ client/          # React-приложение (Webpack)
├─ server/          # Express API + Sequelize + миграции/seed
├─ docs/            # функциональные требования и карта страниц
├─ package.json     # npm workspaces (client, server)
└─ README.md
```

## Быстрый старт

### 1) Требования

- Node.js LTS (рекомендуется 20+)
- npm
- PostgreSQL

### 2) Установка зависимостей

Из корня репозитория:

```bash
npm install
```

### 3) Настройка окружения сервера

В папке `server` создайте `.env` на основе `server/env.example`.

Минимально необходимые переменные:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vsvh_languages?schema=public"
JWT_SECRET="change-me-in-production"
PORT=4000
CLIENT_ORIGIN="http://localhost:5173"
```

### 4) Миграции и seed данных

Из корня репозитория:

```bash
npm run db:migrate
npm run db:seed
```

### 5) Запуск приложения

Запуск клиента и сервера одновременно (из корня):

```bash
npm run dev
```

По умолчанию:
- клиент: `http://localhost:5173`
- API: `http://localhost:4000`
- healthcheck: `GET /api/health`

## Скрипты

### Корень репозитория
- `npm run dev` — параллельный запуск `client` и `server`.
- `npm run build` — production-сборка клиента.
- `npm run lint` — ESLint для клиента.
- `npm run db:migrate` — миграции БД (`server`).
- `npm run db:migrate:undo` — откат последней миграции.
- `npm run db:seed` — заполнение БД тестовыми данными.

### Client (`client/package.json`)
- `npm run dev -w client` — webpack dev server.
- `npm run build -w client` — `tsc --noEmit` + production build.
- `npm run lint -w client` — ESLint.

### Server (`server/package.json`)
- `npm run dev -w server` — запуск API в watch-режиме.
- `npm run start -w server` — запуск API без watch.
- `npm run db:migrate -w server` — миграции Sequelize.
- `npm run db:seed -w server` — seed-скрипт.

## API и документация

- Функциональные требования и критерии приёмки: [`docs/FUNCTIONAL_REQUIREMENTS.md`](docs/FUNCTIONAL_REQUIREMENTS.md)
- Карта страниц и пользовательских сценариев: [`docs/PAGES_AND_FEATURES.md`](docs/PAGES_AND_FEATURES.md)
- Архитектура и pre-project документы: [`docs/preproject/03-architecture-and-api.md`](docs/preproject/03-architecture-and-api.md)

## Текущее состояние

- Backend API и схема данных реализованы и документированы.
- Frontend структура и основные страницы присутствуют, развитие UI ведётся итерационно.
- Почтовые отчёты работают в реальном режиме при настроенном SMTP; без SMTP используется демо-поведение.

## Workflow разработки

- Основная ветка: `main`.
- Ветка под задачу: `feature/<name>`.
- Перед PR рекомендуется:
  - проверить линт: `npm run lint`
  - проверить сборку: `npm run build`
  - при изменениях схемы БД обновить миграции/seed и документацию.

Формат коммитов: Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`).
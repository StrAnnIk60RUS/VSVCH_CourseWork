# VSVH Languages

Веб-платформа для изучения иностранных языков (роли: **студент**, **преподаватель**, гость).  
Клиент: React + TypeScript + Webpack. Сервер: Node.js + Express + PostgreSQL (Sequelize).

Данный репозиторий содержит всё необходимое для локального запуска и проверки работы приложения.

## Требования

| Компонент | Версия |
|-----------|--------|
| **Node.js** | 22.15.0 или выше — https://nodejs.org |
| **npm** | поставляется с Node.js |
| **PostgreSQL** | 18.1 или выше — https://www.postgresql.org/download/ |
| **pgAdmin 4** | для импорта SQL-дампа — https://www.pgadmin.org/download/ |
| **Браузер** | Google Chrome, Mozilla Firefox или Microsoft Edge |

Рекомендуется **Visual Studio Code** — https://code.visualstudio.com

## Структура репозитория

```text
VSVH/
├─ client/                              # React-приложение
├─ server/                              # Express API
│  ├─ env.example                       # образец конфигурации (скопировать в .env)
│  └─ database/dumps/vsvh_languages.sql # дамп БД (схема + демо-данные)
├─ package.json                         # npm workspaces (client + server)
├─ package-lock.json
└─ README.md                            # данная инструкция
```

## Получение исходного кода

1. Откройте репозиторий на GitHub.
2. Нажмите **Code → Download ZIP** и распакуйте архив  
   **или** выполните `git clone <URL-репозитория>`.

## Установка и запуск (для проверяющего)

### 1. Установить зависимости

В корневой папке проекта (где лежит `package.json`):

```bash
npm install
```

Команда устанавливает зависимости и клиента, и сервера (npm workspaces).

### 2. Подготовить базу данных PostgreSQL

1. Создайте пустую базу данных с именем **`vsvh_languages`** (кодировка UTF8).
2. Импортируйте SQL-дамп:
   - файл: `server/database/dumps/vsvh_languages.sql`;
   - в **pgAdmin 4**: правый щелчок по БД → **Query Tool** → **Open File** → выбрать файл → **Execute** (F5);
   - из командной строки (если `psql` в PATH):

     ```bash
     psql -U postgres -d vsvh_languages -f server/database/dumps/vsvh_languages.sql
     ```

3. После успешного импорта **не выполняйте** `npm run db:seed` — дамп уже содержит схему и демонстрационные данные.

### 3. Настроить `server/.env`

1. Скопируйте `server/env.example` в `server/.env`.
2. В файле `server/.env` укажите строку подключения к вашей БД в переменной **`DATABASE_URL`** (логин и пароль PostgreSQL внутри URI):

```env
DATABASE_URL="postgresql://postgres:ваш_пароль@localhost:5432/vsvh_languages?schema=public"
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN=7d
PORT=4000
CLIENT_ORIGIN="http://localhost:5173"
```

Имя базы в `DATABASE_URL` должно совпадать с созданной БД: **`vsvh_languages`**.

Переменные `SMTP_*` можно оставить пустыми — отправка отчётов на e-mail для локальной проверки не обязательна.

### 4. Запустить приложение

**Вариант А — два терминала (рекомендуется для проверки):**

Терминал 1 — API:

```bash
cd server
npm start
```

В консоли: `API http://localhost:4000`.

Терминал 2 — клиент:

```bash
cd client
npm start
```

**Вариант Б — один терминал из корня:**

```bash
npm run dev
```

### 5. Открыть в браузере

- **Клиент (интерфейс):** http://localhost:5173  
- **API:** http://localhost:4000  
- **Проверка API:** http://localhost:4000/api/health  

## Тестовые учётные записи

После импорта дампа `vsvh_languages.sql` используйте готовые логины (страница входа: **/login**).

### Преподаватель

| Поле | Значение |
|------|----------|
| Email | `elena.morozova@vsvh.demo` |
| Пароль | `PrepVsvh2026!` |
| Разделы | `/teacher/courses`, `/teacher/analytics` |

### Студент

| Поле | Значение |
|------|----------|
| Email | `ivan.volkov@vsvh.demo` |
| Пароль | `StudVsvh2026!` |
| Разделы | `/courses`, `/me/learning`, `/me/progress` |

Гостевой просмотр каталога курсов доступен без авторизации.

## Типичные ошибки

| Симптом | Причина | Решение |
|---------|---------|---------|
| Ошибка подключения к БД | Неверный `DATABASE_URL` или PostgreSQL не запущен | Проверить службу PostgreSQL и параметры в `server/.env` |
| Пустой каталог курсов | Дамп не импортирован | Повторить импорт `vsvh_languages.sql` в БД `vsvh_languages` |
| Ошибки при `npm run db:seed` | Данные уже загружены дампом | Не запускать seed после импорта дампа |
| Страница не открывается | Неверный порт (например, 3000) | Использовать **http://localhost:5173** |
| `EADDRINUSE` | Порт 4000 или 5173 занят | Завершить предыдущий процесс `npm start` / `npm run dev` |
| CORS / блокировка запросов | Неверный `CLIENT_ORIGIN` | В `.env`: `CLIENT_ORIGIN="http://localhost:5173"` |

## Альтернатива: БД без дампа (для разработчиков)

Если дамп недоступен, из корня проекта:

```bash
npm run db:migrate
npm run db:seed
```

После сида в консоли выводятся те же тестовые логины и пароли.

## Скрипты (кратко)

| Команда (из корня) | Назначение |
|--------------------|------------|
| `npm install` | Установка зависимостей |
| `npm run dev` | Клиент + сервер одновременно |
| `npm run build` | Production-сборка клиента |
| `npm run db:migrate` | Миграции Sequelize |
| `npm run db:seed` | Тестовые данные (только без импорта дампа) |

# Postman: коллекция API VSVH

Локальная коллекция и окружение для ручного и автоматического тестирования всех HTTP-эндпоинтов Express API (`server/app.js`).

## Файлы

| Файл | Назначение |
|------|------------|
| `VSVH.postman_collection.json` | Коллекция запросов с тестами (`Tests`) |
| `VSVH.postman_environment.json` | Переменные (`baseUrl`, seed-аккаунты, динамические id после Bootstrap) |
| `build-collection.mjs` | Генератор коллекции (исправляйте его и пересобирайте JSON) |

Пересборка коллекции после правок:

```bash
npm run postman:build
```

## Предусловия

1. **PostgreSQL** и переменные в `server/.env` (см. корневой `README.md`).
2. Миграции и seed (для папки **14. Seed smoke** и проверок с `seedCourseId`):

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. Запущенный API (по умолчанию порт **4000**):

   ```bash
   npm run dev -w server
   ```

   Либо только сервер из корня через workspaces.

В окружении Postman поле `baseUrl` по умолчанию: `http://localhost:4000`.

## Импорт в Postman

1. **Import** → выберите `VSVH.postman_collection.json` и `VSVH.postman_environment.json`.
2. Выберите окружение **VSVH Local**.
3. **Run collection** (рекомендуется запускать **всю** коллекцию по порядку: сначала **0. Bootstrap**, затем остальное).

Папка **0. Bootstrap** создаёт временных пользователей `qa-teacher-*` / `qa-student-*`, курсы и сохраняет токены и id в переменные окружения сессии.

## Запуск через Newman (CLI)

Из корня репозитория (сервер должен быть запущен):

```bash
npm run test:api
```

Это эквивалентно:

```bash
npx newman run postman/VSVH.postman_collection.json -e postman/VSVH.postman_environment.json --reporters cli
```

## Seed-аккаунты (после `npm run db:seed`)

См. `server/database/seed.js` — в окружении заданы:

- Преподаватель: `elena.morozova@vsvh.demo`
- Студент: `ivan.volkov@vsvh.demo`

Пароли хранятся в переменных окружения Postman (`seedTeacherPassword`, `seedStudentPassword`).

## Покрытие

- Положительные и отрицательные сценарии по группам: Health, Auth, Users, Courses, Lessons, Exercises, Enrollments, Submissions, Favorites, Reminders, Teacher, Reports.
- В группе **Reminders** дополнительно покрыты `GET /api/reminders/notifications` и `POST /api/reminders/:id/acknowledge`.
- Папка **14. Seed smoke** проверяет вход под seed-пользователями и непустой список курсов преподавателя.
- Папка **15. Cleanup** удаляет созданные в Bootstrap ресурсы (идемпотентность повторных прогонов).

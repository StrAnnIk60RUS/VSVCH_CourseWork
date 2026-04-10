# База данных VSVH (PostgreSQL)

Актуальное описание схемы по коду: [server/database/migrations/init-schema.sql](../server/database/migrations/init-schema.sql), модели Sequelize — [server/db/models/index.js](../server/db/models/index.js).

## Воспроизведение схемы

- Одна начальная миграция Sequelize: `server/database/migrations/20260410150000-initial-schema.cjs` (выполняет SQL из `init-schema.sql`).
- Заполнение демо-данных: `npm run db:seed -w server` ([server/database/seed.js](../server/database/seed.js)).

Подключение: переменная окружения `DATABASE_URL` (см. [server/env.example](../server/env.example)).

## Типы PostgreSQL (ENUM)

| Имя типа | Значения | Назначение |
|----------|-----------|------------|
| `Role` | `STUDENT`, `TEACHER`, `ADMIN` | Платформенные роли пользователя (связь `user_roles` → справочник `roles`) |
| `CourseStaffRole` | `TEACHER`, `AUTHOR`, `METHODIST`, `CURATOR` | Роль участника в штате конкретного курса (`course_staff`) |

## Таблицы (14)

| Таблица | Назначение |
|---------|------------|
| `roles` | Справочник платформенных ролей (PK `code`). |
| `users` | Учётные записи: `email` (unique), `password_hash`, `name`, метки времени. |
| `user_roles` | M:N пользователь ↔ роль; PK составной (`user_id`, `role_code`). |
| `courses` | Курс: метаданные, `published`, **`rating_average`** (кэш среднего рейтинга для сортировки каталога; обновляется при изменении отзывов). |
| `course_staff` | Штат курса: кто с какой ролью ведёт/готовит курс; unique (`course_id`, `user_id`, `staff_role`). |
| `course_reviews` | Отзыв: `rating` 1–5, `comment`; один отзыв на пару (`user_id`, `course_id`). |
| `lessons` | Уроки курса: `sort_order`, `title`, `content`. |
| `exercises` | Упражнения урока: `type`, **`payload` (JSONB)** — структура зависит от типа задания. |
| `enrollments` | Запись студента на курс: `progress` (%), unique (`user_id`, `course_id`). |
| `certificates` | Выданный сертификат: unique `enrollment_id`, unique `document_number`, `issued_at`. |
| `lesson_completions` | Факт завершения урока пользователем; unique (`user_id`, `lesson_id`). |
| `submissions` | Ответ на упражнение: `score`, **`payload` (JSONB)**. |
| `favorites` | Избранное; unique (`user_id`, `course_id`). |
| `reminders` | Напоминания; `course_id` опционален. |

## Целостность и индексы

- Внешние ключи с `ON DELETE CASCADE` (или `SET NULL` для `reminders.course_id`) — см. конец `init-schema.sql`.
- Уникальность: `users.email`, пары в `enrollments`, `favorites`, `lesson_completions`, `course_reviews`; уникальные `certificates.enrollment_id` и `certificates.document_number`.
- Индексы: `course_staff(course_id)`, `course_reviews(course_id)`, `courses(rating_average)`.

## Нормализация и осознанные исключения

- Роли пользователя и штат курса вынесены в связующие таблицы; число записавшихся на курс считается агрегатом по `enrollments` (отдельный счётчик в `courses` не хранится).
- **`rating_average`** в `courses` — денормализованный кэш для сортировки/фильтра `minRating`; источник истины по оценкам — строки в `course_reviews` (среднее нужно пересчитывать в приложении при CUD отзывов).
- **`enrollments.progress`** — хранимый процент по бизнес-правилам (пересчёт при завершении уроков и отправках); не заменяет учёт фактов в `lesson_completions`.
- **JSONB** в `exercises.payload` и `submissions.payload` — гибкость типов упражнений; полная атомарная нормализация этих полей в отдельные таблицы в схеме не делается.

## Сущность «отчёты» в продуктовой документации

Таблица `reports` в SQL **не заведена**: генерация PDF/DOCX описана в функциональных требованиях как поведение API; при необходимости журналирования позже можно добавить отдельную миграцию.

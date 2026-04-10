# 04. Данные, безопасность, окружения

## 1) Предварительная модель данных (MVP)

Ключевые сущности:
- `users`
- `roles`
- `user_roles`
- `courses` (в т.ч. кэш `rating_average` для сортировки каталога)
- `course_staff` (штат курса: TEACHER, AUTHOR, METHODIST, CURATOR)
- `course_reviews` (оценка и комментарий; один отзыв на пару пользователь–курс)
- `lessons`
- `exercises`
- `enrollments`
- `certificates` (выдача PDF: уникальный `document_number`, связь с `enrollment`)
- `lesson_completions`
- `submissions`
- `favorites`
- `reminders`
- `reports` (метаданные генерации/отправки)

Основные связи:
- `users` M:N `roles` через `user_roles`.
- `users` M:N `courses` через `course_staff` (роли штата курса).
- `courses` 1:N `lessons`, `lessons` 1:N `exercises`.
- `users (student)` M:N `courses` через `enrollments`; `enrollments` 1:0..1 `certificates`.
- `users` 1:N `course_reviews`, `submissions`, `reminders`, `favorites`.

## 2) Ограничения целостности
- Уникальность `users.email`.
- Уникальность пары `enrollments(userId, courseId)`.
- Уникальность пары `favorites(userId, courseId)`.
- Внешние ключи с согласованной стратегией удаления (`RESTRICT`/`CASCADE` по бизнес-правилам).
- Индексы на полях фильтрации и сортировки (например: `courses(language, level)`, `courses(rating_average)`, `course_reviews(course_id)`, `submissions(user_id, created_at)`).

## 3) Политика безопасности (минимум)
- Пароли только в виде bcrypt hash.
- JWT подписывается секретом из env.
- Ролевая проверка на backend для каждой защищенной операции.
- Входная валидация на уровне API (DTO/schema).
- Rate limiting для auth endpoint и потенциально нагруженных маршрутов.
- CORS с явным `CLIENT_ORIGIN`.
- Централизованная обработка ошибок без утечки внутренних деталей.

## 4) Базовая модель угроз и контроль
- **Brute-force login** -> лимиты запросов, единое сообщение об ошибке.
- **SQL injection** -> параметризованные запросы ORM.
- **XSS на клиенте** -> экранирование и запрет небезопасного HTML по умолчанию.
- **CSRF для cookie-сценариев** -> при переходе на cookie auth добавить CSRF-токен.
- **Утечка секретов** -> хранение ключей только в `.env*`, без коммита в репозиторий.

## 5) Окружения и конфигурация
- **local**: разработка и ручное тестирование.
- **staging**: предпрод, интеграционные тесты, smoke-проверки.
- **production**: релиз.

Конфигурация через переменные окружения:
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `CLIENT_ORIGIN`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (опционально для реальной отправки отчетов)

## 6) Политика секретов
- `.env` хранится локально и не коммитится.
- Для CI/CD использовать защищенное хранилище секретов платформы.
- Ротация `JWT_SECRET` и SMTP-учетных данных при инцидентах.

## 7) Логирование и аудит (минимум MVP)
- Логи серверных ошибок с correlation id.
- Логи критичных действий (авторизация, попытки доступа без прав, генерация отчетов).
- Отдельная пометка `demo: true` для e-mail отчетов без SMTP.

## 8) Критерий готовности этапа "Data/Security"
- Утверждена карта сущностей и связей.
- Зафиксированы обязательные ограничения и индексная стратегия.
- Описаны меры безопасности и политика окружений/секретов.

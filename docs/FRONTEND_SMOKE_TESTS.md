# Frontend Smoke Tests

Минимальный регрессионный набор для UI после каждого крупного инкремента.

## Guest
- Открыть `/` и `/courses`.
- Перейти на `/courses/:courseId` и проверить список уроков.
- Убедиться, что защищенные маршруты редиректят на `/login`.

## Auth
- Зарегистрировать нового `student`.
- Выйти и повторно войти.
- Проверить восстановление сессии после reload.

## Student
- На странице курса выполнить запись/отписку и операции избранного.
- На странице урока отметить урок пройденным и отправить ответ на упражнение.
- На `/me/learning` проверить прогресс и удаление записи.
- На `/me/reminders` выполнить create/update/delete.
- На `/me/profile` обновить имя и сбросить `vsvh:` ключи localStorage.
- На `/me/progress` скачать PDF/DOCX и отправить e-mail запрос отчета.

## Teacher
- Открыть `/teacher/courses`, перейти в `/teacher/courses/:courseId`.
- В manage-странице проверить создание/удаление урока и create/delete exercise.
- Проверить таблицу студентов с фильтром status и сортировкой.
- Скачать CSV студентов курса.
- Скачать teacher summary report (PDF/DOCX) и отправить e-mail запрос.

## Gates
- `npm run lint -w client`
- `npm run build -w client`

## Task Card

### Goal
- Подготовить архитектурный baseline клиентской части для дальнейшей реализации FR-сценариев без смешивания доменов.

### InScope
- Базовый HTTP-клиент с авторизацией токеном и единым форматом ошибок.
- Общие типы API для auth/catalog/course.
- Расширение store для auth/session состояния.
- Роутинг-скелет с role-aware guard-компонентом.

### OutOfScope
- Реализация конкретных бизнес-сценариев страниц.
- CRUD-формы teacher/student.

### NonGoals
- Массовый редизайн UI.
- Переписывание уже существующих layout-компонентов.

### AcceptanceCriteria
- Есть единая точка запросов в `client/src/api`.
- Токен хранится/читается централизованно.
- Приложение компилируется и guards работают на уровне маршрутов.

### AffectedRequirements
- FR-UI-01, FR-AUTH-01, FR-AUTH-02, FR-AUTH-03.
- Маршруты из `docs/PAGES_AND_FEATURES.md` раздел 3.

### Priority
- P0, так как без baseline остальные инкременты будут недетерминированными.

### ChangeBudget
- maxFilesChanged: 18
- maxModulesChanged: 6
- forbiddenRefactors: массовые переименования и переносы директорий

### CommitPlan
- Ожидаемое число коммитов: 1
- commit1_scope: только baseline-архитектура API/store/router guards
- Тип: feat
- Правило checkpoint: коммит после локальной проверки lint/build.

### TestPlan
- `npm run lint -w client`
- `npm run build -w client`
- Smoke: переход guest по публичным маршрутам и редиректы с guard-компонентами.

### RisksAndRollback
- Риск: конфликт с текущими placeholder-страницами.
- Rollback: откатить только baseline commit без изменения страниц.

### Deliverables
- Код baseline-слоя API и auth-store.
- Документ Task Card для commit #1.

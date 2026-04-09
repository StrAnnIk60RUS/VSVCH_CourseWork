# 10. Quality gates and deterministic workflow

Документ задает обязательный порядок выполнения задач и quality gates для проекта VSVH.
Цель - предсказуемое исполнение без случайных решений и скрытых регрессий.

## 1) Единый pipeline

Каждая задача проходит один и тот же путь:

1. `Intake`
2. `Implement`
3. `Verify`
4. `SelfReview`
5. `Report`

Задача не считается завершенной, если пропущен любой этап.

## 2) Stage details и обязательные проверки

### Stage: Intake
- Заполнить `07-task-template.md`.
- Зафиксировать `AffectedRequirements` (R*) и `Priority` (P0..P3).
- Проверить соответствие мастер-плану:
  - `03-architecture-and-api.md` §1.2
  - `03-architecture-and-api.md` §17
  - `03-architecture-and-api.md` §19
- Установить `ChangeBudget`.

### Stage: Implement
- Выполнять только `InScope`.
- Не делать незапрошенные рефакторы.
- Не выходить за `ChangeBudget` без отдельного подтверждения.

### Stage: Verify
- Обязательные hard-gates:
  - `lint`
  - `typecheck` (если применимо)
  - `tests` (минимум затронутый контур)
  - `build` (если применимо)
- Для API/страниц:
  - обязательный doc-sync: `FUNCTIONAL_REQUIREMENTS.md` и `PAGES_AND_FEATURES.md`.

### Stage: SelfReview
- Проверить, что нет out-of-scope изменений.
- Проверить, что статус требований не ухудшился.
- Проверить DoD:
  - task-level: `03-architecture-and-api.md` §16
  - pre-release/release: `03-architecture-and-api.md` §20

### Stage: Report
- В отчете обязательно указать:
  - `changed`
  - `notChangedByDesign`
  - `risks`
  - `verificationDone`

## 3) Uncertainty gate (обязательно)

Если есть 2 или более равновалидных варианта реализации, исполнитель обязан:

1. Остановиться до имплементации спорной части.
2. Представить варианты и trade-offs.
3. Запросить подтверждение выбранного пути.

Самостоятельный выбор "на глаз" в такой ситуации запрещен.

## 4) CommitGate (инкрементальные коммиты)

После каждого завершенного проверяемого инкремента исполнитель обязан предложить коммит.

Критерии инкремента, готового к коммиту:

- закрыта одна логическая цель;
- пройдены локальные проверки для затронутого контура;
- синхронизирована документация (если изменение затрагивает API/страницы);
- diff остается обозримым для ревью.

Запрещено:

- копить большой несвязанный diff до конца всей задачи;
- объединять несколько независимых функциональных блоков в один монолитный коммит без обоснования.

## 5) Doc-sync gate

Если затронуто API или страничные сценарии, в рамках той же задачи обязательно:

- обновить `docs/FUNCTIONAL_REQUIREMENTS.md`;
- обновить `docs/PAGES_AND_FEATURES.md`;
- сверить согласованность c `03-architecture-and-api.md`.

## 6) CommitMessageGate

Перед каждым коммитом обязателен mini-check сообщения:

- используется корректный Conventional Commit формат;
- сообщение отражает смысл изменения (why), а не перечисление файлов;
- в сообщении нет упоминаний инструмента/ассистента (включая Cursor).

Если любой пункт не выполнен, коммит не должен предлагаться до исправления текста.

## 7) No-go conditions

Merge/close запрещен, если выполняется хотя бы одно условие:

- есть незакрытый hard-gate;
- есть out-of-scope изменения;
- нарушен `ChangeBudget` без согласования;
- отсутствует doc-sync при изменении API/страниц;
- есть завершенный инкремент, но коммит не предложен пользователю;
- CommitMessageGate не пройден;
- не пройден DoD gate.

## 8) Связанные документы

- `docs/preproject/03-architecture-and-api.md`
- `docs/preproject/04-execution-workflow.md`
- `docs/preproject/07-task-template.md`
- `docs/preproject/08-decisions-log.md`
- `docs/preproject/09-known-pitfalls.md`

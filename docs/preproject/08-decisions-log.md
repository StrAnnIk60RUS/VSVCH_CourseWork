# 08. Decisions log (ADR-lite)

Журнал фиксирует архитектурные и процессные решения, чтобы команда и Cursor
использовали единый подход без случайных отклонений.

## Правила ведения

- Добавлять запись при любом выборе, который меняет реализацию или процесс.
- Если решение устарело, помечать его как `superseded` и ссылаться на новое.
- Не удалять старые записи: журнал должен сохранять историю решений.

## Шаблон записи

```md
## ADR-XXX: <краткий заголовок>
- Date: YYYY-MM-DD
- Status: active | superseded
- Context:
  - Что за проблема/развилка.
- Options:
  - Option A: ...
  - Option B: ...
- Decision:
  - Что выбрали и почему.
- Consequences:
  - Плюсы:
  - Минусы/компромиссы:
- Related:
  - docs/preproject/03-architecture-and-api.md §...
  - docs/preproject/10-quality-gates.md
```

---

## ADR-001: Мастер-план как source of truth
- Date: 2026-04-09
- Status: active
- Context:
  - Нужен единый ориентир, чтобы не смешивать целевое ТЗ и фактический статус.
- Options:
  - Option A: использовать несколько равноправных документов.
  - Option B: назначить один мастер-план и связать остальные документы с ним.
- Decision:
  - Выбран Option B: `03-architecture-and-api.md` назначен мастер-планом.
- Consequences:
  - Плюсы:
    - Меньше конфликтов и двусмысленностей при реализации.
    - Проще проверять приоритеты и готовность.
  - Минусы/компромиссы:
    - Требуется дисциплина синхронизации зависимых документов.
- Related:
  - `docs/preproject/03-architecture-and-api.md`
  - `docs/preproject/04-execution-workflow.md`
  - `.cursor/rules/MainRule.md`

## ADR-002: Обязательный anti-random workflow
- Date: 2026-04-09
- Status: active
- Context:
  - Нужен предсказуемый процесс выполнения задач без неожиданных решений.
- Options:
  - Option A: оставаться на общих рекомендациях без жестких gate-правил.
  - Option B: формализовать pipeline с обязательными gate-checks.
- Decision:
  - Выбран Option B: введен deterministic workflow и quality gates.
- Consequences:
  - Плюсы:
    - Повышается воспроизводимость результатов.
    - Снижается доля регрессий и out-of-scope изменений.
  - Минусы/компромиссы:
    - Небольшое увеличение времени на формальные проверки.
- Related:
  - `docs/preproject/10-quality-gates.md`
  - `docs/preproject/07-task-template.md`

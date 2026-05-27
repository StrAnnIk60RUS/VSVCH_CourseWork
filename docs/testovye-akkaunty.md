# Тестовые учётные записи VSVH

Данные доступны после импорта дампа `server/database/dumps/vsvh_languages.sql` (см. [раздел 4 ПЗ](4-rukovodstvo-sistemnogo-programmista.md)) или после выполнения сида:

```bash
npm run db:seed
```

После успешного сида те же логины и пароли выводятся в консоль.

---

## 1. Преподаватель

| Поле | Значение |
|------|----------|
| **Имя** | Елена Морозова |
| **Email** | `elena.morozova@vsvh.demo` |
| **Пароль** | `PrepVsvh2026!` |
| **Роль в API** | `teacher` |
| **Роль в БД** | `TEACHER` |

### Курсы преподавателя (штат `course_staff`)

| ID курса | Название | Язык | Уровень | Опубликован |
|----------|----------|------|---------|-------------|
| `seed-course-en-a1` | Английский с нуля: алфавит, цифры и приветствия | en | A1 | да |
| `seed-course-en-b1` | Business English: встречи и переговоры | en | B1 | да |
| `seed-course-fr-draft` | Français: phonétique (черновик) | fr | A2 | нет (черновик) |

На курсе `seed-course-en-a1` дополнительно указана роль **AUTHOR**.

### Типовые сценарии входа

- Список курсов: `/teacher/courses`
- Управление курсом: `/teacher/courses/seed-course-en-a1`
- Аналитика: `/teacher/analytics`
- API: `POST /api/auth/login` с email и паролем выше

### Студенты на курсах Елены (когорта для отчётности)

Шесть дополнительных студентов записаны на курсы A1/B1 с разным прогрессом. Общий пароль: `CohortVsvh2026!`

| Email | Имя |
|-------|-----|
| `seed-cohort-student-1@vsvh.demo` | Анна Петрова |
| `seed-cohort-student-2@vsvh.demo` | Сергей Соколов |
| `seed-cohort-student-3@vsvh.demo` | Мария Кузнецова |
| `seed-cohort-student-4@vsvh.demo` | Дмитрий Орлов |
| `seed-cohort-student-5@vsvh.demo` | Ольга Соловьёва |
| `seed-cohort-student-6@vsvh.demo` | Никита Лебедев |

---

## 2. Студент

| Поле | Значение |
|------|----------|
| **Имя** | Иван Волков |
| **Email** | `ivan.volkov@vsvh.demo` |
| **Пароль** | `StudVsvh2026!` |
| **Роль в API** | `student` |
| **Роль в БД** | `STUDENT` |

### Записи на курсы (`enrollments`)

| ID курса | Название |
|----------|----------|
| `seed-course-en-a1` | Английский с нуля: алфавит, цифры и приветствия |
| `seed-course-en-b1` | Business English: встречи и переговоры |

Прогресс пересчитывается сидом после отправок упражнений.

### Дополнительные данные студента

| Сущность | Описание |
|----------|----------|
| **Отзывы** | A1 — 5★; B1 — 4★ |
| **Избранное** | курс `seed-course-en-b1` |
| **Напоминание** | «Повторить урок 2 (приветствия)» по курсу A1 (дата ≈ через 3 дня от сида) |
| **Отправка** | упражнение `seed-en-a1-l1-ex1` (ответ «E», 5 баллов) |

### Типовые сценарии входа

- Каталог: `/courses`
- Моё обучение: `/me/learning`
- Урок: `/courses/seed-course-en-a1/lessons/seed-en-a1-l1`
- Прогресс и отчёт: `/me/progress`
- API: `POST /api/auth/login` с email и паролем выше

---

## 3. Сводка для копирования

```
Преподаватель
  Email:    elena.morozova@vsvh.demo
  Пароль:   PrepVsvh2026!
  Имя:      Елена Морозова

Студент
  Email:    ivan.volkov@vsvh.demo
  Пароль:   StudVsvh2026!
  Имя:      Иван Волков
```

---

## 4. Связанные файлы в репозитории

| Файл | Назначение |
|------|------------|
| `server/database/seed.js` | источник данных сида (`SEED_ACCOUNTS`) |
| `postman/VSVH.postman_environment.json` | переменные `seedTeacherEmail`, `seedStudentEmail`, пароли |
| `postman/README.md` | запуск коллекции Postman |
| `docs/FRONTEND_SMOKE_TESTS.md` | чек-лист проверки UI по ролям |

*Только для локальной разработки и демонстрации. Не использовать эти пароли в production.*

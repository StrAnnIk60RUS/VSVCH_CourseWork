# Client (React + TypeScript + Webpack)

Сборка и дев-сервер соответствуют требованию курсового проекта: **Webpack** как сборщик модулей.

## Скрипты

- `npm run dev` — `webpack-dev-server` (по умолчанию порт **5173**, совпадает с `CLIENT_ORIGIN` в `server/env.example`)
- `npm run build` — проверка типов (`tsc --noEmit`) и production-сборка
- `npm run lint` — ESLint

## Стили

Tailwind CSS v4 подключается через PostCSS (`postcss.config.cjs`, `@tailwindcss/postcss`) и [src/styles/global.css](src/styles/global.css).

## Состояние

Redux Toolkit: [src/store](src/store), провайдер в [src/main.tsx](src/main.tsx).

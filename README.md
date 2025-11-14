# DistaHilar — Frontend (Next.js 15 + TypeScript)

English | [Русский ниже](#русский)

Need the server? Visit the [DistaHilar Backend](../back/README.md).

## Overview

DistaHilar Frontend is a modern, Telegram‑inspired web messenger UI built with Next.js App Router. It features real‑time messaging, chat folders, reactions, media preview, WebRTC calls/live rooms, and full i18n support.

This is a personal, non‑commercial project for learning purposes. Product and interface ideas are inspired by the Telegram application; all trademarks belong to their respective owners.

## Features

- Authentication and account
  - Sign in / sign up flows with client‑side validation and error states
  - Account information modal; change phone and username modals
- Real‑time messaging
  - Socket.IO‑powered updates for new messages and message state changes
  - Chats list with search, unread counters, and message previews
  - Conversation features:
    - Text, images, video, audio, files
    - Replies (quotes) and pinned messages
    - Emoji reactions with an emoji picker
  - Media viewer:
    - Full‑screen preview for images/video
    - Carousel navigation between attachments
- Chat organization
  - Chat folders with a management UI to create and curate views
- Calls and live
  - 1:1 WebRTC calls and experimental “live rooms”
- Internationalization
  - Chechen, English and Russian locales via next‑intl (locale‑aware routes)
- UI and themes
  - Tailwind CSS + shadcn/ui; dark and light themes

## Screenshots

<table>
<tr>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/01.png" target="_blank">
    <img src="./public/images/screenshots/01.png" alt="Sign In Page - Authentication Interface" width="100%" style="max-width: 900px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); margin: 20px 0; cursor: pointer; transition: transform 0.2s;">
    </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/1.1.png" target="_blank">
    <img src="./public/images/screenshots/1.1.png" alt="Sign Up Page - Registration Form" width="100%" style="max-width: 900px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); margin: 20px 0; cursor: pointer; transition: transform 0.2s;">
    </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/02.png" target="_blank">
    <img src="./public/images/screenshots/02.png" alt="Main Chat Interface - Conversations List" width="100%" style="max-width: 450px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>

</tr>
  <tr>
  <td align="center" width="33.33%">
  <a href="./public/images/screenshots/2.1.png" target="_blank">
    <img src="./public/images/screenshots/2.1.png" alt="Chat Conversation - Message Thread" width="100%" style="max-width: 450px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
  <td align="center" width="33.33%">
  <a href="./public/images/screenshots/2.2.png" target="_blank">
    <img src="./public/images/screenshots/2.2.png" alt="Chat Interface - Media Messages and Reactions" width="100%" style="max-width: 450px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/03.png" target="_blank">
    <img src="./public/images/screenshots/03.png" alt="Chat Interface - Message Input and Attachments" width="100%" style="max-width: 450px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>

</tr>
<tr>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.1.png" target="_blank">
    <img src="./public/images/screenshots/3.1.png" alt="Media Viewer - Image Preview" width="100%" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.2.png" target="_blank">
    <img src="./public/images/screenshots/3.2.png" alt="Chat Settings - Account Information" width="100%" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.3.png" target="_blank">
    <img src="./public/images/screenshots/3.3.png" alt="Chat Folders - Organization Interface" width="100%" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>

</tr>
<tr>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.4.png" target="_blank">
    <img src="./public/images/screenshots/3.4.png" alt="Emoji Picker - Reaction Selection" width="100%" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.5.png" target="_blank">
    <img src="./public/images/screenshots/3.5.png" alt="Message Options - Reply and Pin Actions" width="100%" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.6.png" target="_blank">
    <img src="./public/images/screenshots/3.6.png" alt="Theme Settings - Dark and Light Mode" width="100%" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>

</tr>
<tr>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.7.png" target="_blank">
    <img src="./public/images/screenshots/3.7.png" alt="Language Settings - Internationalization" width="100%" style="max-width: 250px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/4.png" target="_blank">
    <img src="./public/images/screenshots/4.png" alt="WebRTC Call Interface - Video Call" width="100%" style="max-width: 250px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/5.png" target="_blank">
    <img src="./public/images/screenshots/5.png" alt="Live Room - Group Video Call" width="100%" style="max-width: 250px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
</tr>
<tr>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/6.png" target="_blank">
    <img src="./public/images/screenshots/6.png" alt="Search Interface - Chat and Message Search" width="100%" style="max-width: 250px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center">
  <a href="./public/images/screenshots/7.png" target="_blank">
    <img src="./public/images/screenshots/7.png" alt="Full Application Overview - Complete Interface" width="100%" style="max-width: 800px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); margin: 20px 0; cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
</tr>
</table>

## Tech Stack

- Next.js 15 (App Router), React 18, TypeScript
- Tailwind CSS + shadcn/ui primitives
- React Query, Redux Toolkit (with persist)
- Socket.IO client
- WebRTC APIs
- next‑intl (i18n), SCSS

## Architecture Diagram

```mermaid
flowchart LR
    User[Browser / Client] --> App[Next.js App Router]
    App -->|REST /api| Backend[NestJS Backend]
    App -->|Socket.IO| Backend
    App --> WebRTC[[WebRTC Peer Connections]]
    App --> Cloudinary[(Cloudinary Assets)]
```

## Project Structure (high level)

- `app/[locale]` — routes, layouts, and pages (`/auth`, `/chat`, `/chat/[chatId]`)
- `features` — domain features (chat list, folders, media, calls, etc.)
- `entities`/`widgets` — complex UI building blocks
- `shared` — providers (Socket), hooks (WebRTC, live), libs (axios, services), UI
- `prisma` — shared enums/models for type‑safety on the client

## Getting Started

### Prerequisites

- Node.js 18+

### Environment

Create `.env.local` in `front/`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:9555/api
NEXT_PUBLIC_WS_BACKEND_URL=http://localhost:9555

# Optional cookie settings (for cross‑domain deployments)
NEXT_PUBLIC_COOKIE_DOMAIN=localhost
NEXT_PUBLIC_COOKIE_SECURE=false
```

### Install and run

```bash
npm install
# optional: generate Prisma types for shared enums
npm run prisma:generate
npm run dev
```

Frontend will be available at:

```
http://localhost:3000
```

## Integration Notes

- The backend must allow CORS from the frontend origin and set `credentials: true`.
- Ensure the `NEXT_PUBLIC_BACKEND_URL` includes the `/api` prefix to match server routes.
- `NEXT_PUBLIC_WS_BACKEND_URL` must point to the Socket.IO server URL.

## Why this project

DistaHilar was built as a portfolio project to demonstrate how I approach **production‑like frontend engineering** on a complex, real‑time product: from UI/UX and state management to WebRTC, i18n, and integration with a separate backend.

## My Role

- Solo developer for the frontend: architecture, implementation, state management, and integration with the backend.
- Focus on:
  - Clean, modular structure (`features`, `entities`, `widgets`, `shared`) for scalability.
  - Complex real‑time UI state (messages, folders, media, calls).
  - Strong UX: animations, keyboard navigation, responsive layout, dark/light themes.

## Key Technical Decisions

- **Feature‑oriented architecture**: split by domain (`features`, `entities`, `widgets`, `shared`) instead of pages to keep business logic and UI reusable and testable.
- **Real‑time messaging**: Socket.IO client with centralized event handling and React Query cache updates instead of scattered `useState`, which helps avoid race conditions and inconsistent UI.
- **WebRTC calls**: separation of signaling (Socket.IO) and media logic via custom hooks; this keeps peer connection lifecycle (offer/answer/ICE) isolated and easier to reason about.
- **i18n**: `next-intl` with locale‑aware routes (`/[locale]/...`) and shared translation messages for consistent localization across all screens.
- **Prisma enums on the client**: shared models for stronger type‑safety between frontend and backend.

## Performance & UX

- Virtualized lists for chats and messages (smooth scrolling even with many items).
- Optimistic UI for sending messages and emoji reactions to make the app feel responsive.
- Lazy loading of heavy routes and media viewer to reduce initial bundle size.
- Keyboard‑friendly navigation and focus management in modals.
- Accessible components with ARIA attributes where applicable and high‑contrast themes.

## Code Quality

- TypeScript with strict typing for better refactoring and fewer runtime errors.
- ESLint + Prettier for consistent code style.
- Clear separation between UI components and side‑effects (data fetching, sockets, WebRTC) via hooks and services.

## System Overview

- **Frontend**: Next.js 15 (App Router) with a mix of server and client components.
- **Backend**: NestJS API and Socket.IO server (see `../back`).
- **Real‑time**: Socket.IO for messaging, presence, and live updates.
- **Media**: Cloudinary for image and video assets.
- **Auth**: cookie‑based authentication with CORS configuration for cross‑domain setups.

## For Recruiters

- **Best places to quickly review the codebase**:
  - `app/[locale]/chat` — routing, layouts, and main chat screen composition.
  - `features/chat` — core messaging logic and state management.
  - `widgets/ModalAccountInfo`, `widgets/ModalChangePhone`, `widgets/ModalChangeUsername` — complex forms and UX details (validation, error handling, transitions).
  - `widgets/ReactScan` — utility widget integration.

## License and Attribution

This repository is for educational purposes only. It is not affiliated with Telegram and is not intended for commercial use. Design and functionality are inspired by the Telegram application.

---

## Русский

Русский | [English выше](#overview)

Нужен сервер? Загляните в [DistaHilar Backend](../back/README.md).

### Описание

Frontend DistaHilar — это современный веб‑интерфейс мессенджера, вдохновлённый Telegram и построенный на Next.js (App Router). Он поддерживает обмен сообщениями в реальном времени, папки чатов, реакции, предпросмотр медиа, звонки и «живые» комнаты на WebRTC, а также полноценную i18n.

Это личный, некоммерческий проект для образовательных целей. Идеи дизайна и функционала вдохновлены приложением Telegram; все товарные знаки принадлежат их правообладателям.

### Функциональность

- Авторизация и аккаунт
  - Вход/регистрация с клиентской валидацией и обработкой ошибок
  - Модальные окна: информация об аккаунте, смена телефона и юзернейма
- Сообщения в реальном времени
  - Обновления через Socket.IO для новых сообщений и состояний сообщений
  - Список чатов с поиском, счётчиками непрочитанных и превью
  - Диалоги:
    - Текст, изображения, видео, аудио, файлы
    - Ответы (цитаты) и закреплённые сообщения
    - Реакции эмодзи с выбором из пикера
  - Просмотр медиа:
    - Полноэкранный предпросмотр изображений/видео
    - Переключение по вложениям (карусель)
- Организация чатов
  - Папки чатов с интерфейсом управления для создания и группировки
- Звонки и «живые» комнаты
  - 1:1 звонки на WebRTC и экспериментальные live‑комнаты
- Интернационализация
  - Чеченская, английская и русская локали на next‑intl (маршруты с локалью)
- Интерфейс и темы
  - Tailwind CSS + shadcn/ui; светлая и тёмная темы

### Скриншоты

<table>
<tr>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/01.png" target="_blank">
    <img src="./public/images/screenshots/01.png" alt="Страница входа - Интерфейс авторизации" width="100%" style="max-width: 900px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); margin: 20px 0; cursor: pointer; transition: transform 0.2s;">
    </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/1.1.png" target="_blank">
    <img src="./public/images/screenshots/1.1.png" alt="Страница регистрации - Форма регистрации" width="100%" style="max-width: 900px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); margin: 20px 0; cursor: pointer; transition: transform 0.2s;">
    </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/02.png" target="_blank">
    <img src="./public/images/screenshots/02.png" alt="Главный интерфейс чата - Список бесед" width="100%" style="max-width: 450px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
</tr>
  <tr>
  <td align="center" width="33.33%">
  <a href="./public/images/screenshots/2.1.png" target="_blank">
    <img src="./public/images/screenshots/2.1.png" alt="Диалог - Переписка с сообщениями" width="100%" style="max-width: 450px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
  <td align="center" width="33.33%">
  <a href="./public/images/screenshots/2.2.png" target="_blank">
    <img src="./public/images/screenshots/2.2.png" alt="Интерфейс чата - Медиа и реакции" width="100%" style="max-width: 450px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/03.png" target="_blank">
    <img src="./public/images/screenshots/03.png" alt="Интерфейс чата - Ввод сообщений и вложения" width="100%" style="max-width: 450px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
</tr>
<tr>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.1.png" target="_blank">
    <img src="./public/images/screenshots/3.1.png" alt="Просмотр медиа - Предпросмотр изображений" width="100%" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.2.png" target="_blank">
    <img src="./public/images/screenshots/3.2.png" alt="Настройки чата - Информация об аккаунте" width="100%" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.3.png" target="_blank">
    <img src="./public/images/screenshots/3.3.png" alt="Папки чатов - Интерфейс организации" width="100%" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
</tr>
<tr>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.4.png" target="_blank">
    <img src="./public/images/screenshots/3.4.png" alt="Выбор эмодзи - Выбор реакции" width="100%" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.5.png" target="_blank">
    <img src="./public/images/screenshots/3.5.png" alt="Опции сообщения - Ответ и закрепление" width="100%" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.6.png" target="_blank">
    <img src="./public/images/screenshots/3.6.png" alt="Настройки темы - Тёмный и светлый режим" width="100%" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
</tr>
<tr>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/3.7.png" target="_blank">
    <img src="./public/images/screenshots/3.7.png" alt="Настройки языка - Интернационализация" width="100%" style="max-width: 250px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/4.png" target="_blank">
    <img src="./public/images/screenshots/4.png" alt="Интерфейс WebRTC звонка - Видеозвонок" width="100%" style="max-width: 250px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/5.png" target="_blank">
    <img src="./public/images/screenshots/5.png" alt="Живая комната - Групповой видеозвонок" width="100%" style="max-width: 250px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
</tr>
<tr>
<td align="center" width="33.33%">
  <a href="./public/images/screenshots/6.png" target="_blank">
    <img src="./public/images/screenshots/6.png" alt="Интерфейс поиска - Поиск чатов и сообщений" width="100%" style="max-width: 250px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.12); cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
<td align="center">
  <a href="./public/images/screenshots/7.png" target="_blank">
    <img src="./public/images/screenshots/7.png" alt="Обзор приложения - Полный интерфейс" width="100%" style="max-width: 800px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); margin: 20px 0; cursor: pointer; transition: transform 0.2s;">
  </a>
</td>
</tr>
</table>

### Технологии

- Next.js 15 (App Router), React 18, TypeScript
- Tailwind CSS + shadcn/ui
- React Query, Redux Toolkit (+ persist)
- Socket.IO client
- WebRTC
- next‑intl, SCSS

### Архитектура

```mermaid
flowchart LR
    User[Браузер / Клиент] --> App[Next.js App Router]
    App -->|REST /api| Backend[NestJS Backend]
    App -->|Socket.IO| Backend
    App --> WebRTC[[WebRTC peer-to-peer]]
    App --> Cloudinary[(Cloudinary Assets)]
```

### Структура

- `app/[locale]` — маршруты и layout’ы (`/auth`, `/chat`, `/chat/[chatId]`)
- `features` — функциональные модули (список чатов, папки, медиа, звонки и т.д.)
- `entities`/`widgets` — составные части интерфейса
- `shared` — провайдеры (Socket), хуки (WebRTC, live), библиотеки (axios, сервисы), UI
- `prisma` — общие enum’ы/модели для типобезопасности на клиенте

### Быстрый старт

1. Установите зависимости:

```bash
npm install
```

2. (Опционально) сгенерируйте Prisma‑типы:

```bash
npm run prisma:generate
```

3. Запустите dev‑сервер:

```bash
npm run dev
```

Интерфейс доступен по адресу `http://localhost:3000`.

### Переменные окружения

См. пример `.env.local` выше: `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_WS_BACKEND_URL`, а также опциональные `NEXT_PUBLIC_COOKIE_DOMAIN`, `NEXT_PUBLIC_COOKIE_SECURE` для кросс‑доменной работы.

### Интеграция с backend

- Разрешите CORS и cookie (`credentials: true`) со стороны сервера.
- Убедитесь, что `NEXT_PUBLIC_BACKEND_URL` содержит префикс `/api`.
- `NEXT_PUBLIC_WS_BACKEND_URL` должен указывать на Socket.IO сервер.

### Зачем этот проект

DistaHilar создан как портфолио‑проект, чтобы показать, как я подхожу к **разработке фронтенда, близкого к продакшену**, на примере сложного, realtime‑приложения: от UI/UX и управления состоянием до WebRTC, i18n и интеграции с отдельным backend‑сервисом.

### Моя роль

- Соло‑разработчик фронтенда: архитектура, реализация, управление состоянием, интеграция с backend.
- Фокус:
  - Чистая, модульная структура (`features`, `entities`, `widgets`, `shared`) с прицелом на масштабирование.
  - Сложное состояние realtime‑интерфейса (сообщения, папки, медиа, звонки).
  - Продуманный UX: анимации, клавиатурная навигация, адаптивная верстка, тёмная/светлая темы.

### Ключевые технические решения

- **Фиче‑ориентированная архитектура**: разделение по доменам (`features`, `entities`, `widgets`, `shared`), а не только по страницам, чтобы бизнес‑логика и компоненты были переиспользуемыми и тестируемыми.
- **Сообщения в реальном времени**: клиент Socket.IO с централизованной обработкой событий и обновлением кэша React Query вместо разрозненных `useState`, что помогает избежать состязаний и несогласованного UI.
- **WebRTC‑звонки**: разделение сигналинга (Socket.IO) и медиа‑логики через кастомные хуки; жизненный цикл peer‑соединения (offer/answer/ICE) изолирован и проще для поддержки.
- **i18n**: `next-intl` с маршрутами по локали (`/[locale]/...`) и единым набором переводов для разных экранов.
- **Prisma enums на клиенте**: общие модели/enum’ы для более строгой типизации и синхронизации фронта с бэкендом.

### Производительность и UX

- Виртуализированные списки чатов и сообщений (плавный скролл при большом количестве элементов).
- Оптимистичный UI при отправке сообщений и добавлении реакций — интерфейс ощущается «живым» и быстрым.
- Lazy‑загрузка тяжёлых маршрутов и просмотрщика медиа для уменьшения стартового бандла.
- Удобная навигация с клавиатуры и управление фокусом в модальных окнах.
- Компоненты с учётом доступности (ARIA‑атрибуты там, где это важно) и контрастные темы.

### Качество кода

- TypeScript со строгой типизацией для безопасных рефакторингов и меньшего числа рантайм‑ошибок.
- ESLint + Prettier для единообразного стиля кода.
- Чёткое разделение презентационного слоя и сайд‑эффектов (запросы, сокеты, WebRTC) через хуки и сервисы.

### Обзор системы

- **Frontend**: Next.js 15 (App Router) — сочетание server и client‑компонентов.
- **Backend**: NestJS API и сервер Socket.IO (см. `../back`).
- **Realtime**: Socket.IO для сообщений, присутствия и live‑обновлений.
- **Медиа**: Cloudinary для хранения и доставки изображений и видео.
- **Авторизация**: cookie‑based auth с настроенным CORS для кросс‑доменной работы.

### Для рекрутеров

- **Куда быстро заглянуть в коде**:
  - `app/[locale]/chat` — маршрутизация, layout’ы и композиция основного экрана чата.
  - `features/chat` — основная логика обмена сообщениями и управление состоянием.
  - `widgets/ModalAccountInfo`, `widgets/ModalChangePhone`, `widgets/ModalChangeUsername` — сложные формы и UX‑детали (валидация, обработка ошибок, переходы).
  - `widgets/ReactScan` — интеграция вспомогательного виджета.

### Лицензия и атрибуция

Репозиторий предназначен только для обучения и не связан с Telegram. Проект не является коммерческим. Дизайн и функционал вдохновлены приложением Telegram.

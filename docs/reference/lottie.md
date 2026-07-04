# Lottie Animation Catalog

Built-in Lottie animations organized by theme, for loading states, feedback, empty states, and UI polish. The table below is the canonical list.

## Usage

```tsx
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { lottie } from '@middag-io/react/lottie';

// Play a loading animation
<DotLottieReact src={lottie.loading[0]} loop autoplay />

// Success feedback
<DotLottieReact src={lottie.success[1]} autoplay />

// Empty state illustration
<DotLottieReact src={lottie.emptyState[0]} loop autoplay />
```

## Dependency

```bash
npm install @lottiefiles/dotlottie-react
```

## Themes

Each theme provides 2-3 animation variants. Access by index: `lottie.{theme}[0]`, `lottie.{theme}[1]`, etc.

| Theme        | Key                   | Variants                                       | Use case                      |
|--------------|-----------------------|------------------------------------------------|-------------------------------|
| Loading      | `lottie.loading`      | spinner-1, spinner-2, spinner-3                | Page/data loading states      |
| Success      | `lottie.success`      | check-1, check-2, check-3                      | Action confirmation feedback  |
| Error        | `lottie.error`        | warning-1, warning-2, warning-3                | Error/failure states          |
| Empty State  | `lottie.emptyState`   | empty-1, empty-2, empty-3                      | No data/results placeholders  |
| Not Found    | `lottie.notFound`     | 404-1, 404-2, 404-3                            | 404 pages                     |
| Search       | `lottie.search`       | search-1, search-2, search-3                   | Search in progress/no results |
| Upload       | `lottie.upload`       | upload-1, upload-2, upload-3                   | File upload states            |
| Notification | `lottie.notification` | bell-1, bell-2, bell-3                         | Alert/notification indicators |
| Email        | `lottie.email`        | mail-1, mail-2, mail-3                         | Email sending/received        |
| Settings     | `lottie.settings`     | gear-1, gear-2, gear-3                         | Configuration/processing      |
| User         | `lottie.user`         | profile-1, profile-2, profile-3                | User profile/onboarding       |
| Dashboard    | `lottie.dashboard`    | analytics-1, analytics-2, analytics-3          | Analytics/data visualization  |
| Calendar     | `lottie.calendar`     | schedule-1, schedule-2                         | Scheduling/date selection     |
| Security     | `lottie.security`     | lock-1, lock-2, lock-3                         | Auth/security states          |
| Payment      | `lottie.payment`      | wallet-1, wallet-2, wallet-3                   | Payment/transaction states    |
| Cloud        | `lottie.cloud`        | cloud-1, cloud-2                               | Cloud sync/storage            |
| Connection   | `lottie.connection`   | network-1, network-2, network-3                | Network/connectivity          |
| Celebration  | `lottie.celebration`  | confetti-1, confetti-2, confetti-3             | Achievement/milestone         |
| Onboarding   | `lottie.onboarding`   | welcome-1, welcome-2, welcome-3                | First-time user experience    |
| Maintenance  | `lottie.maintenance`  | construction-1, construction-2, construction-3 | Under maintenance/coming soon |

## TypeScript

```ts
import { lottie, type LottieTheme } from '@middag-io/react/lottie';

// LottieTheme is a union of all theme keys
const theme: LottieTheme = 'loading';
const paths: string[] = lottie[theme];
```

## Live Preview

Run the mock SPA and navigate to `/lotties` to see all animations rendered with play/pause controls.

```bash
npm run mock
# Open http://localhost:5174/lotties
```

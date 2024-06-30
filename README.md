# Dictionary Web App

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The dictionary web-app utilizes a dashboard-like interface to provide a way to quickly and easily look up word definitions and keep track of favorite words. Login credentials, Favorites, Recents, and the most recent word is stored locally to persist across user sessions.

It includes a responsive design to display a sidebar on the desktop, and a bottom nav bar on mobile devices. It can display one of two themes, light & dark, detected from the user's OS preferences and changeable by the user from the nav bar.

## Getting Started

### API Key

To use the app, you will need an api key for the Merriam-Webster Dictionary API. API Keys are free for developer accounts, which can be registered here: [https://dictionaryapi.com/](https://dictionaryapi.com/)

> The Merriam-Webster Dictionary API is free as long as it is for non-commercial use, usage does not exceed 1000 queries per day per API key, and use is limited to two reference APIs.

**An api key is not required to build or run the app.** The web app will ask you login using an API key when it first loads.

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

The project uses Context Providers and view model hooks to provide DI and a clean separation of concerns. The contexts provide a common data source and logic for all pages/components (via their view models).

- **Context Providers**: Located under the app/providers folder, these provide services that can be used throughout the app, ex: Theme selector, Storage provider, API Client, etc. They are inserted into the app's top-most `layout.tsx` file and are utilized exclusively by either other Context Providers or the View Models.
- **View Models**: View Logic separation is achieved by using React hooks. Each view's view model is colocated in the same folder as the view with the name: `useViewModel.tsx`. It is the responsibility of the view model to manipulate state and contain all of the business logic necessary for each view. View models define two sets of state returned as a tuple `[ State, Actions ]`. This follows the same convention used by native React hooks like `useState` and `useReducer`.
  - `ViewState`: The state manipulated by the view model and consumed by the view.
  - `ViewActions`: All of the actions that can be taken on the state produced by the view model.
- **Views**: Views never store their own state or contain business logic. Instead, they are either stateless (consume state from their props) or use view models to manage their state.
- **SCSS Modules**: CSS modules are used for all styling. The organization of the modules is to colocate each module next to the page/view it styles. In this way, all styles for a page/view are easily accessible. Aside from `global.scss`, which sets common vars along with common styling necessary for the whole app.

## Unit Tests

Due to time contraints, the entirety of the project is not unit tested. Instead, example Test Suites have been created to demonstrate my approach Unit Testing:

- app/api/schema/DictionaryAPIResponseSchema.spec.ts -> Demonstrates Schema validation Unit Tests.
- app/auth/useViewModel.spec.tsx -> Demontrates Unit Testing view models.
- app/providers/theme/Provider.spec.tsx -> Demonstrates how Context Providers are Unit Tested.

Unit Tests are placed next to the file they're testing, while the `__tests__` directory is used primarily for json and common mocks. Organizing it this way makes it easy and obvious what is/is-not tested.

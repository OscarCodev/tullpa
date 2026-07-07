## 1. DigitalMenu Frontend State Conversion

- [x] 1.1 Convert category rendering in `components/DigitalMenu.tsx` to use local `categories` state initialized with `initialCategories`.
- [x] 1.2 Convert dish rendering in `components/DigitalMenu.tsx` to use local `dishes` state initialized with `initialDishes`.

## 2. Realtime Subscription Implementation

- [x] 2.1 Implement a `useEffect` hook in `components/DigitalMenu.tsx` to subscribe to changes on the `categories` and `dishes` tables.
- [x] 2.2 Add handler logic to handle `INSERT` events, adding new categories/dishes to the state.
- [x] 2.3 Add handler logic to handle `UPDATE` events, updating modified categories/dishes in state.
- [x] 2.4 Add handler logic to handle `DELETE` events, filtering out deleted categories/dishes from state.
- [x] 2.5 Ensure clean subscription teardown when the component is unmounted.

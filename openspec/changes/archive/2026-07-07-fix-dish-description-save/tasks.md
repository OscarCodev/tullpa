## 1. Local TypeScript definitions and component state alignment

- [x] 1.1 Update the local `Dish` interface in `components/MenuCategoryCRUD.tsx` to use `desc` instead of `description`.
- [x] 1.2 Update the `dishModal` state shape in `components/MenuCategoryCRUD.tsx` to use `desc` instead of `description`.
- [x] 1.3 Update the initialization of `dishModal` in `components/MenuCategoryCRUD.tsx` to use `desc`.

## 2. CRUD component query payload and UI mappings

- [x] 2.1 Update the `fetchData` mapping function in `components/MenuCategoryCRUD.tsx` to use `d.desc` and align with type changes.
- [x] 2.2 Update the `handleSaveDish` function payload object in `components/MenuCategoryCRUD.tsx` to set the `desc` key.
- [x] 2.3 Update UI fields (the form textarea value and `onChange` callback) to reference `dishModal.desc` instead of `dishModal.description`.
- [x] 2.4 Update the table item renderer inside `components/MenuCategoryCRUD.tsx` to read `dish.desc` and display it instead of `dish.description`.

## 3. Test Alignment

- [x] 3.1 Update the mock data in `__tests__/MenuCategoryCRUD.test.tsx` to use the property `desc` instead of `description`.
- [x] 3.2 Update expectations/assertions in `__tests__/MenuCategoryCRUD.test.tsx` (e.g., checking rendered description or mock payload matches) to use `desc`.

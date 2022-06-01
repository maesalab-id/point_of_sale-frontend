import { useCallback, useMemo, useReducer } from "react";

export const useListSelectionController = () => {
  const selectedItemReducer = useCallback((state, action) => {
    switch (action.type) {
      case "toggle": {
        if (action.data.value) {
          return selectedItemReducer(state, {
            type: "add",
            data: action.data,
          });
        } else {
          return selectedItemReducer(state, {
            type: "remove",
            data: action.data,
          });
        }
      }
      case "add":
        return [...state, action.data.name];
      case "remove":
        return [...state.filter((item) => item !== action.data.name)];
      case "all": {
        const items = action.items;
        if (action.data && items) {
          return [...items.map((item) => item.id)];
        } else {
          return [];
        }
      }
      case "exclude": {
        const items = action.items;
        if (action.data && items) {
          return [
            ...items
              .filter((item) => action.data.indexOf(item.id) !== -1)
              .map((item) => item.id),
          ];
        } else {
          return [];
        }
      }
      default:
        return state;
    }
  }, []);

  const [ids, dispatchSelectedItem] = useReducer(selectedItemReducer, []);

  const modifier = useMemo(
    () => ({
      toggle: (data) => {
        dispatchSelectedItem({
          type: "toggle",
          data,
        });
      },
      select: (data) => {
        dispatchSelectedItem({
          type: "add",
          data,
        });
      },
      unselect: (data) => {
        dispatchSelectedItem({
          type: "remove",
          data,
        });
      },
      clearSelection: () => {
        dispatchSelectedItem({
          type: "all",
        });
      },
    }),
    [dispatchSelectedItem]
  );

  return [ids, modifier, dispatchSelectedItem];
};

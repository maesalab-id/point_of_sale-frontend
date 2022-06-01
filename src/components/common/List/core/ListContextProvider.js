import { ListContext } from "./ListContext";
import { useListController } from "./useListController";

export const ListContextProvider = ({ children, ...options }) => {
  return (
    <ListContext.Provider value={useListController(options)}>
      {children}
    </ListContext.Provider>
  );
};

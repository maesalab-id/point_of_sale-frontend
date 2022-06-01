import { ListContext } from "./ListContext";
import { useListController } from "./useListController";

export const ListContextProvider = ({ options, children }) => {
  return (
    <ListContext.Provider value={useListController(options)}>
      {children}
    </ListContext.Provider>
  );
};

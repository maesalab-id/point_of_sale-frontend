import { useContext } from "react";
import { ListContext } from "./ListContext";

export const useListContext = () => {
  const context = useContext(ListContext);
  return context;
};

import { Layout } from "./Layout"
import ListProvider from "components/list"
import { useLocation, useNavigate } from "react-router-dom"
import { useMemo } from "react";

export const filterField = ["category_id"];

export const Transactions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [filter, filterSearch] = useMemo(() => {
    const url = new URLSearchParams(location["search"]);
    const filter = {};
    for (let f of filterField) {
      filter[f] = url.get(f) || "";
    }
    return [filter, url];
  }, [location["search"]]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ListProvider
      filter={filter}
      onFilterChange={(value) => {
        for (let v of filterField) {
          if (value[v]) filterSearch.set(v, value[v]);
          else filterSearch.delete(v);
        }
        navigate({
          search: filterSearch.toString()
        }, { replace: true });
      }}
    >
      <Layout />
    </ListProvider>
  )
}
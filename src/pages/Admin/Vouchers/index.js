import { Box, Divider } from "components";
import ListProvider from "components/list";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "./Header";
import List from "./List";
import { Toolbar } from "./Toolbar";

export const filterField = ["search"];

export const Vouchers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = useMemo(() => {
    const url = searchParams;
    const filter = {};
    for (let f of filterField) {
      filter[f] = url.get(f) || "";
    }
    return filter;
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ListProvider
      filter={filter}
      onFilterChange={(value, { dispatchSelectedItem }) => {
        for (let v of filterField) {
          if (value[v]) searchParams.set(v, value[v]);
          else searchParams.delete(v);
        }
        setSearchParams(searchParams);
        dispatchSelectedItem({
          type: "all",
          data: false,
        });
      }}
    >
      <Box>
        <Box sx={{ pt: 4 }}>
          <Header />
        </Box>
        <Divider />
        <Box sx={{ mt: 3, px: 3, mb: 3 }}>
          <Toolbar />
        </Box>
        <Box sx={{ mb: 4 }}>
          <List />
        </Box>
      </Box>
    </ListProvider>
  );
};

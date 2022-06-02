import { NonIdealState, Spinner } from "@blueprintjs/core";
import { Box } from "components/Grid";
import { useListContext } from "./core";
import { RecordContextProvider } from "./core/RecordContextProvider";
import { ListBodyItemBase } from "./ListBodyItemBase";

export const ListBody = (props) => {
  const { hasBulkActions, children } = props;
  const { items, isError, isLoading } = useListContext();

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Spinner size={50} />
      </Box>
    );
  }

  if (!Array.isArray(items) || isError) {
    return (
      <Box sx={{ my: 4 }}>
        <NonIdealState icon="graph-remove" title="Something went wrong" />
      </Box>
    );
  }

  if (Array.isArray(items) && items.length === 0) {
    return (
      <Box sx={{ my: 4 }}>
        <NonIdealState icon="antenna" title="No list available" />
      </Box>
    );
  }

  return items.map((item) => (
    <RecordContextProvider key={item["id"]} record={item}>
      <ListBodyItemBase hasBulkActions={hasBulkActions}>
        {children}
      </ListBodyItemBase>
    </RecordContextProvider>
  ));
};

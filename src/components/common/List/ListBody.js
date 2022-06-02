import { NonIdealState, Spinner } from "@blueprintjs/core";
import { Box } from "components/Grid";
import { useListContext } from "./core";
import { RecordContextProvider } from "./core/RecordContextProvider";
import { ListBodyItemBase } from "./ListBodyItemBase";

export const ListBody = (props) => {
  const { hasBulkActions, children } = props;
  const { items, isLoading } = useListContext();

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Spinner size={50} />
      </Box>
    );
  }
  if (items.length === 0) {
    return (
      <Box sx={{ my: 3 }}>
        <NonIdealState title="No user available" />
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

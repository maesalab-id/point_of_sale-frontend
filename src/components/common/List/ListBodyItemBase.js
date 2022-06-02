import { Checkbox } from "@blueprintjs/core";
import { Box, Flex } from "components/Grid";
import { ListGroup } from "components/ListGroup";
import { useListContext } from "./core";
import { useRecordContext } from "./core/useRecordContext";

export const ListBodyItemBase = (props) => {
  const { hasBulkActions, children } = props;
  const { data } = useRecordContext();
  const { toggleSelection, selectedIds } = useListContext();
  return (
    <ListGroup.Item
      sx={{
        "& .action-button": {
          opacity: 0.5,
        },
        "&:hover .action-button": {
          opacity: 1,
        },
      }}
    >
      <Flex>
        {hasBulkActions && (
          <Box sx={{ width: 40, flexShrink: 0 }}>
            <Checkbox
              checked={selectedIds.indexOf(data["id"]) !== -1}
              onChange={(e) => {
                toggleSelection({
                  name: data["id"],
                  value: e.target.checked,
                });
              }}
            />
          </Box>
        )}
        {children}
      </Flex>
    </ListGroup.Item>
  );
};

import { Button, Checkbox } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { Box, Flex } from "components/Grid";
import { ListGroup } from "components/ListGroup";
import _isNil from "lodash.isnil";
import { useListContext } from "./core";

export const ListHeader = (props) => {
  const { bulkActions = null } = props;
  const hasBulkAction = !_isNil(bulkActions);
  const {
    refetch,
    items,
    selectionStatus,
    dispatchSelectedItem,
    selectedIds,
    isFetching,
  } = useListContext();
  return (
    <ListGroup.Header>
      <Flex sx={{ alignItems: "center" }}>
        {hasBulkAction && (
          <Box>
            <Checkbox
              disabled={selectionStatus.disabled}
              checked={selectionStatus.checked}
              indeterminate={selectionStatus.indeterminate}
              onChange={(e) => {
                dispatchSelectedItem({
                  type: "all",
                  items,
                  data: e.target.checked,
                });
              }}
            />
          </Box>
        )}
        {hasBulkAction && selectedIds.length > 0 && bulkActions}
        <Box sx={{ flexGrow: 1 }} />
        {selectedIds.length === 0 && (
          <Box>
            <Tooltip2
              content="Refresh"
              renderTarget={({ isOpen, ref, ...tooltipProps }) => (
                <Button
                  {...tooltipProps}
                  active={isOpen}
                  elementRef={ref}
                  loading={isFetching}
                  minimal={true}
                  icon="refresh"
                  onClick={() => {
                    refetch();
                  }}
                />
              )}
            />
          </Box>
        )}
      </Flex>
    </ListGroup.Header>
  );
};

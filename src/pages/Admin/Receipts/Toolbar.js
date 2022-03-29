import { Button, ControlGroup, InputGroup } from "@blueprintjs/core"
import { Box, Flex, useList } from "components"
import { filterField } from ".";

export const Toolbar = () => {
  const { filter, setFilter } = useList();
  return (
    <Flex>
      <Flex sx={{ flexGrow: 1 }}>
        <Box sx={{ mr: 2 }}>
          <ControlGroup>
            <InputGroup
              leftIcon="search"
              placeholder="Filter by order number"
              value={filter["receipt_number"] || ""}
              onChange={(e) => {
                setFilter(f => ({ ...f, receipt_number: e.target.value }));
              }}
            />
          </ControlGroup>
        </Box>
        <Box>
          {filterField.map(f => !!filter[f]).indexOf(true) !== -1
            && <Button
              title="Clear Filter"
              minimal={true}
              intent="warning"
              icon="filter-remove"
              onClick={() => {
                const ff = {};
                filterField.forEach(f => ff[f] = undefined);
                setFilter(filter => ({
                  ...filter,
                  ...ff
                }));
              }}
            />}
        </Box>
      </Flex>
    </Flex>
  )
}
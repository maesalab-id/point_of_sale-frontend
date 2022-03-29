import { Button, ControlGroup, InputGroup } from "@blueprintjs/core"
import { Box, Flex, useList } from "components"
import { toaster } from "components/toaster";
import { useState } from "react";
import { filterField } from ".";
import { DialogAdd } from "./Dialog.Add";

export const Toolbar = () => {
  const [dialogOpen, setDialogOpen] = useState(null);
  const { filter, setFilter } = useList();
  return (
    <Flex>
      <Flex sx={{ flexGrow: 1 }}>
        <Box sx={{ mr: 2 }}>
          <ControlGroup>
            <InputGroup
              leftIcon="search"
              placeholder="Filter by order number"
              value={filter["order_number"] || ""}
              onChange={(e) => {
                setFilter(f => ({ ...f, order_number: e.target.value }));
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
      <Box>
        <Button
          intent="primary"
          text="Make Order"
          onClick={() => {
            setDialogOpen("add");
          }}
        />
        <DialogAdd
          isOpen={dialogOpen === "add"}
          onClose={() => { setDialogOpen(null) }}
          onSubmitted={() => {
            setFilter(f => ({ ...f, type: undefined }));
            toaster.show({
              intent: "success",
              message: "Order has been created"
            });
          }}
        />
      </Box>
    </Flex>
  )
}
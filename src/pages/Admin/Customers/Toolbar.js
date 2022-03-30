import { Button, ControlGroup, InputGroup } from "@blueprintjs/core"
import { Box, Flex, useList } from "components"
import { toaster } from "components/toaster";
import { useState } from "react";
import { DialogAdd } from "./Dialog.Add";

export const Toolbar = () => {
  const [dialogOpen, setDialogOpen] = useState(null);
  const { filter, setFilter } = useList();
  return (
    <Flex>
      <Box sx={{ flexGrow: 1 }}>
        <ControlGroup>
          <InputGroup
            leftIcon="search"
            placeholder="Filter by name or phone or address"
            value={filter["search"] || ""}
            onChange={(e) => {
              setFilter(f => ({ ...f, search: e.target.value }));
            }}
          />
        </ControlGroup>
      </Box>
      <Box>
        <Button
          intent="primary"
          text="Add customer"
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
              message: "Customer created"
            });
          }}
        />
      </Box>
    </Flex>
  )
}
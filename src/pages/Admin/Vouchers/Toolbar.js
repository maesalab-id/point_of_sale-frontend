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
            placeholder="Filter by name"
            value={filter["name"] || ""}
            onChange={(e) => {
              setFilter(f => ({ ...f, name: e.target.value }));
            }}
          />
        </ControlGroup>
      </Box>
      <Box>
        <Button
          intent="primary"
          text="Add voucher"
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
              message: "Voucher created"
            });
          }}
        />
      </Box>
    </Flex>
  )
}
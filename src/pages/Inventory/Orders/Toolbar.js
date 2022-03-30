import { Button, ControlGroup, InputGroup, Tag, Icon } from "@blueprintjs/core";
import { Box, DateRangePicker, Flex, useList } from "components";
import { useState } from "react";
import _get from "lodash.get";
import moment from "moment";
import { filterField } from ".";
import { DialogAdd } from "./Dialog.Add";
import { toaster } from "components/toaster";

export const Toolbar = () => {
  const { filter, setFilter } = useList()
  const [dialogOpen, setDialogOpen] = useState(null);

  return (
    <Flex>
      <Flex sx={{ flexGrow: 1, alignItems: "center" }}>
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
        <Box sx={{ mr: 2 }}>
          <DateRangePicker
            value={[
              _get(filter, "start"),
              _get(filter, "end")
            ]}
            onChange={([start, end]) => {
              setFilter(f => ({
                ...f,
                start: start.isValid() ? start.endOf("day").format("DD-MM-YYYY") : undefined,
                end: end.isValid() ? end.endOf("day").format("DD-MM-YYYY") : undefined
              }))
            }}
          >
            <Box>
              <Tag>{filter["start"] ? moment(_get(filter, "start"), "DD-MM-YYYY").format("dddd, LL") : "not set"}</Tag>
              <Box sx={{ display: "inline-block", px: 2 }}>
                <Icon icon="arrow-right" />
              </Box>
              <Tag>{filter["end"] ? moment(_get(filter, "end"), "DD-MM-YYYY").format("dddd, LL") : "not set"}</Tag>
            </Box>
          </DateRangePicker>
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
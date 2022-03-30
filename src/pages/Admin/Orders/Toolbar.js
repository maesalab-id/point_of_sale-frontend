import { Button, ControlGroup, InputGroup, Tag, Icon } from "@blueprintjs/core";
import { Box, DateRangePicker, Divider, FetchAndSelect, Flex, useClient, useList } from "components";
import { filterField } from ".";
import _get from "lodash.get";
import moment from "moment";

export const Toolbar = () => {
  const { filter, setFilter } = useList();
  const client = useClient();
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
        <Divider sx={{ mr: 2 }} />
        <Flex sx={{ mr: 2, alignItems: "center" }}>
          <Box sx={{ mr: 2 }}>Date Range:</Box>
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
        </Flex>
        <Divider sx={{ mr: 2 }} />
        <Box sx={{ mr: 2 }}>
          <FetchAndSelect
            loaded={true}
            service={client["vendors"]}
            placeholder="Vendor"
            id="f-vendor_id"
            name="vendor_id"
            value={_get(filter, "vendor_id")}
            onChange={async ({ value }) => {
              await setFilter(f => ({
                ...f,
                "vendor_id": value
              }));
            }}
            onPreFetch={(q, query) => {
              return {
                ...query,
                "name": q ? {
                  $iLike: `%${q}%`
                } : undefined,
                $select: ["id", "name"]
              }
            }}
            onFetched={(items) => {
              return items.map((item) => {
                return {
                  label: item["name"],
                  value: `${item["id"]}`,
                }
              })
            }}
          />
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
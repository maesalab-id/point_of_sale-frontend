import { ControlGroup, InputGroup, Tag, Icon, Button } from "@blueprintjs/core";
import {
  Box,
  DateRangePicker,
  Divider,
  FetchAndSelect,
  Flex,
  useClient,
} from "components";
import _get from "lodash.get";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { useListContext } from "components/common/List";
import { useEffect, useState } from "react";
import { DialogAdd } from "./Dialog.Add";

export const Toolbar = (props) => {
  const { enableAdd = false } = props;
  const { t } = useTranslation("orders-page");
  const client = useClient();
  const [dialogOpen, setDialogOpen] = useState(null);
  const {
    setFilters,
    filter,
    refetch,
    displayedFilter = {},
  } = useListContext();

  const { values, handleChange, setFieldValue } = useFormik({
    initialValues: filter,
  });

  useEffect(() => {
    if (filter !== values) setFilters(values, displayedFilter);
  }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex>
      <Flex sx={{ flexGrow: 1 }}>
        <Box sx={{ mr: 2 }}>
          <ControlGroup>
            <InputGroup
              name="order_number"
              leftIcon="search"
              placeholder={t("toolbar.filter.search.placeholder")}
              value={values["order_number"] || ""}
              onChange={handleChange}
            />
          </ControlGroup>
        </Box>
        <Divider sx={{ mr: 2 }} />
        <Flex sx={{ mr: 2, alignItems: "center" }}>
          <Box sx={{ mr: 2 }}>{t("common:filter.date_range.label")}:</Box>
          <DateRangePicker
            value={[_get(values, "start"), _get(values, "end")]}
            onChange={async ([start, end]) => {
              await setFieldValue(
                "start",
                start.isValid()
                  ? start.endOf("day").format("DD-MM-YYYY")
                  : undefined,
                false
              );
              await setFieldValue(
                "end",
                end.isValid()
                  ? end.endOf("day").format("DD-MM-YYYY")
                  : undefined
              );
            }}
          >
            <Box>
              <Tag>
                {values["start"]
                  ? moment(_get(values, "start"), "DD-MM-YYYY").format(
                      "dddd, LL"
                    )
                  : "not set"}
              </Tag>
              <Box sx={{ display: "inline-block", px: 2 }}>
                <Icon icon="arrow-right" />
              </Box>
              <Tag>
                {values["end"]
                  ? moment(_get(values, "end"), "DD-MM-YYYY").format("dddd, LL")
                  : "not set"}
              </Tag>
            </Box>
          </DateRangePicker>
        </Flex>
        <Divider sx={{ mr: 2 }} />
        <Box sx={{ mr: 2 }}>
          <FetchAndSelect
            loaded={true}
            clearable={true}
            service={client["vendors"]}
            placeholder={t("common:form.select_vendor.label")}
            id="f-vendor_id"
            name="vendor_id"
            value={_get(filter, "vendor_id")}
            onChange={async ({ value }) => {
              await setFieldValue("vendor_id", value);
            }}
            onPreFetch={(q, query) => {
              return {
                ...query,
                name: q
                  ? {
                      $iLike: `%${q}%`,
                    }
                  : undefined,
                $select: ["id", "name"],
              };
            }}
            onFetched={(items) => {
              return items.map((item) => {
                return {
                  label: item["name"],
                  value: `${item["id"]}`,
                };
              });
            }}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {enableAdd && (
          <Box>
            <Button
              intent="primary"
              text={t("toolbar.make_order")}
              onClick={() => {
                setDialogOpen("add");
              }}
            />
            <DialogAdd
              isOpen={dialogOpen === "add"}
              onClose={() => {
                setDialogOpen(null);
              }}
              onSubmitted={async () => {
                await setFilters({});
                await refetch();
              }}
            />
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

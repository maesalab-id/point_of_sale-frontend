import { ControlGroup, Icon, InputGroup, Tag } from "@blueprintjs/core";
import { Box, Flex, DateRangePicker, Divider } from "components";
import moment from "moment";
import _get from "lodash.get";
import { ExportButton } from "./ExportButton";
import { useListContext } from "components/common/List";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { useEffect } from "react";

export const Toolbar = () => {
  const { t } = useTranslation("receipts-page");

  const { setFilters, filter, displayedFilter = {} } = useListContext();

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
              name="receipt_number"
              leftIcon="search"
              placeholder={t("toolbar.filter.search.placeholder")}
              value={values["receipt_number"] || ""}
              onChange={handleChange}
            />
          </ControlGroup>
        </Box>
        <Divider sx={{ mr: 2 }} />
        <Flex sx={{ mr: 2, alignItems: "center" }}>
          <Box sx={{ mr: 2 }}>Date Range:</Box>
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
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          <ExportButton />
        </Box>
      </Flex>
    </Flex>
  );
};

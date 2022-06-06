import { Button, Classes, InputGroup } from "@blueprintjs/core";
import { Box, Flex, State, useClient } from "components";
import { toaster } from "components/toaster";
import { useEffect, useState } from "react";
import _get from "lodash.get";
import { useTranslation } from "react-i18next";
import { useListContext } from "components/common/List";
import { useFormik } from "formik";

export const Toolbar = () => {
  const client = useClient();
  const { setFilters, filter, displayedFilter = {} } = useListContext();

  const { t } = useTranslation("cashier-home-page");

  const [categories, setCategories] = useState(null);

  const { values, handleChange, setFieldValue } = useFormik({
    initialValues: filter,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (filter !== values) setFilters(values, displayedFilter);
  }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await client["categories"].find({
          query: {
            $limit: 100,
            $select: ["id", "name"],
          },
        });

        setCategories([
          ...res.data.map((category) => {
            return {
              label: _get(category, "name"),
              value: _get(category, "id"),
            };
          }),
        ]);
      } catch (err) {
        console.error(err);
        toaster.show({
          intent: "danger",
          message: err.message,
        });
      }
    };
    fetch();
  }, [t]); // eslint-disable-line  react-hooks/exhaustive-deps

  return (
    <Box sx={{ px: 3, mb: 3 }}>
      <Flex sx={{ overflowX: "auto" }}>
        <State initialValue={false}>
          {([search, setSearch]) => (
            <Flex sx={{ mr: 2, flexShrink: 0 }}>
              {!search && (
                <Button
                  minimal={true}
                  style={{ display: "flex" }}
                  icon={"search"}
                  onClick={() => setSearch((s) => !s)}
                />
              )}
              {search && (
                <InputGroup
                  name="name"
                  round={true}
                  value={values["name"]}
                  placeholder={t("toolbar.filter.search.placeholder")}
                  onChange={handleChange}
                  leftElement={
                    <Button
                      minimal={true}
                      icon="cross"
                      onClick={() => {
                        setSearch((s) => !s);
                        setFieldValue("name", "");
                      }}
                    />
                  }
                  rightElement={<Button minimal={true} icon="search" />}
                />
              )}
            </Flex>
          )}
        </State>
        {!categories && (
          <>
            <Box sx={{ mr: 2, flexShrink: 0 }}>
              <Button className={Classes.SKELETON} text="All Item" />
            </Box>
            <Box sx={{ mr: 2, flexShrink: 0 }}>
              <Button className={Classes.SKELETON} text="All Item" />
            </Box>
            <Box sx={{ mr: 2, flexShrink: 0 }}>
              <Button className={Classes.SKELETON} text="All Item" />
            </Box>
          </>
        )}
        {categories && (
          <Box sx={{ mr: 2, flexShrink: 0 }}>
            <Button
              intent={
                categories.findIndex(
                  ({ value }) => value == values["category_id"] // eslint-disable-line eqeqeq
                ) !== -1
                  ? "none"
                  : "primary"
              }
              minimal={
                categories.findIndex(
                  ({ value }) => value == values["category_id"] // eslint-disable-line eqeqeq
                ) !== -1
                  ? true
                  : false
              }
              text={t("toolbar.filter.all_item_button")}
              onClick={() => setFieldValue("category_id", "")}
            />
          </Box>
        )}
        {categories &&
          categories.map(({ label, value }, i) => (
            <Box key={i} sx={{ mr: 2, flexShrink: 0 }}>
              <Button
                intent={values["category_id"] == value ? "primary" : "none"} // eslint-disable-line eqeqeq
                minimal={values["category_id"] == value ? false : true} // eslint-disable-line eqeqeq
                text={label}
                onClick={() => setFieldValue("category_id", value)}
              />
            </Box>
          ))}
      </Flex>
    </Box>
  );
};

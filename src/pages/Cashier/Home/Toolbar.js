import { Button, Classes } from "@blueprintjs/core";
import { Box, useClient, useList } from "components";
import { toaster } from "components/toaster";
import { useEffect, useState } from "react";
import _get from "lodash.get";

export const Toolbar = () => {
  const client = useClient();
  const { filter, setFilter } = useList();

  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await client["categories"].find({
          query: {
            $limit: 100,
            $select: ["id", "name"]
          }
        });

        setCategories([{
          label: "All Item",
          value: undefined
        }, ...res.data.map((category) => {
          return {
            label: _get(category, "name"),
            value: _get(category, "id"),
          }
        })])

      } catch (err) {
        console.error(err);
        toaster.show({
          intent: "danger",
          message: err.message
        })
      }
    }
    fetch();
  }, []); // eslint-disable-line  react-hooks/exhaustive-deps
  return (
    <Box sx={{ px: 3, mb: 3, }}>
      <Box>
        {!categories && (
          <>
            <Box sx={{ mr: 2, display: "inline-block" }}>
              <Button className={Classes.SKELETON} text="All Item" />
            </Box>
            <Box sx={{ mr: 2, display: "inline-block" }}>
              <Button className={Classes.SKELETON} text="All Item" />
            </Box>
            <Box sx={{ mr: 2, display: "inline-block" }}>
              <Button className={Classes.SKELETON} text="All Item" />
            </Box>
          </>
        )}
        {categories && categories.map(({ label, value }, i) => (
          <Box key={i} sx={{ mr: 2, display: "inline-block" }}>
            <Button
              intent={filter["category_id"] == value ? "primary" : "none"} // eslint-disable-line eqeqeq
              minimal={filter["category_id"] == value ? false : true} // eslint-disable-line eqeqeq
              text={label}
              onClick={() => {
                setFilter(f => ({ ...f, category_id: value }));
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
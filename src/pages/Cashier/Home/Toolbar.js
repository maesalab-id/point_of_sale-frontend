import { Button, Classes, InputGroup } from "@blueprintjs/core";
import { Box, Flex, State, useClient, useList } from "components";
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
          value: ''
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
      <Flex sx={{ overflowX: "auto" }}>
        <State initialValue={false}>
          {([search, setSearch]) => (
            <Flex sx={{ mr: 2, flexShrink: 0, }}>
              <Button
                minimal={true}
                style={{ display: "flex" }}
                icon={search ? "cross" : "search"}
                onClick={() => {
                  setSearch(s => {
                    if (s) { setFilter(f => ({ ...f, name: "" })); }
                    return !s;
                  })
                }} />
              {search &&
                <InputGroup
                  value={filter["name"]}
                  onChange={(e) => {
                    setFilter(f => ({ ...f, name: e.target.value }));
                  }}
                  rightElement={
                    <Button minimal={true} icon="search" />
                  }
                />}
            </Flex>)}
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
        {categories && categories.map(({ label, value }, i) => (
          <Box key={i} sx={{ mr: 2, flexShrink: 0 }}>
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
      </Flex>
    </Box >
  )
}
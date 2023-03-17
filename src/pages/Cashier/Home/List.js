import { NonIdealState, Spinner } from "@blueprintjs/core";
import { Box, Flex } from "components";
import { Pagination, useListContext } from "components/common/List";
import { Item } from "./Item";

export const List = ({ onAdd = () => {} }) => {
  const { items, total, page, limit, setPage, isLoading } = useListContext();
  return (
    <>
      <Flex
        sx={{
          flexGrow: 1,
          flexWrap: "wrap",
          px: 2,
          py: 3,
          mb: 2,
          height: "100%",
          overflow: "auto",
        }}
      >
        {isLoading && (
          <Box sx={{ flexGrow: 1, height: "100%" }}>
            <Spinner />
          </Box>
        )}
        {!isLoading && items.length === 0 && <NonIdealState title="No Items" />}
        {!isLoading &&
          items.map((item, i) => (
            <Box
              key={i}
              sx={{
                px: 2,
                py: 2,
                width: `${100 / 3}%`,
              }}
            >
              <Item
                data={item}
                onClick={() => {
                  onAdd(item);
                }}
              />
            </Box>
          ))}
      </Flex>
      <Box sx={{ mb: 3, mt: 2 }}>
        <Pagination
          loading={items === null}
          total={total}
          limit={limit}
          page={page}
          onClick={(page) => {
            setPage(page);
          }}
        />
      </Box>
    </>
  );
};

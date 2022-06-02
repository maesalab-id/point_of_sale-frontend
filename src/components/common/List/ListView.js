import { Classes } from "@blueprintjs/core";
import { Container, ListGroup } from "components";
import {
  useListContext,
  Pagination,
  ListBodyItem,
} from "components/common/List";
import { ListHeader } from "./ListHeader";
import { ListBody } from "./ListBody";
import _isNil from "lodash.isnil";
import { Children, useMemo } from "react";

export const ListView = (props) => {
  const { bulkActions, children } = props;
  const { items, total, page, limit, setPage } = useListContext();

  const Child = Children.toArray(children);

  const childrenListBodyItem = Child.filter(
    (child) => child.type === ListBodyItem
  );

  const hasBulkActions = useMemo(() => !_isNil(bulkActions), [bulkActions]);

  return (
    <Container sx={{ px: 3 }}>
      <ListGroup
        sx={{
          mb: 3,
          [`.${Classes.CHECKBOX}`]: {
            m: 0,
          },
        }}
      >
        <ListHeader bulkActions={bulkActions} />
        <ListBody hasBulkActions={hasBulkActions}>
          {childrenListBodyItem}
        </ListBody>
      </ListGroup>
      <Pagination
        loading={items === null}
        total={total}
        limit={limit}
        page={page}
        onClick={(page) => {
          setPage(page);
        }}
      />
    </Container>
  );
};

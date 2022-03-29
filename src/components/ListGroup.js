import { Box } from "components";
import ListGroupHeader from "./ListGroup.Header";
import ListGroupItem from "./ListGroup.Item";

export const ListGroup = ({ children, sx, ...props }) => {
  return (
    <Box
      className="list-group"
      sx={{
        borderRadius: 8,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "gray.3",
        // bg: "white",
        "> .list-group-item:not(.list-group-header):hover": {
          bg: "gray.2",
        },
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

ListGroup.Header = ListGroupHeader;
ListGroup.Item = ListGroupItem;
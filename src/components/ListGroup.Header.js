import { Box } from "components";

const ListGroupHeader = ({ children, sx, ...props }) => {
  return (
    <Box
      className="list-group-item list-group-header"
      sx={{
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        bg: "white",
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

export default ListGroupHeader;
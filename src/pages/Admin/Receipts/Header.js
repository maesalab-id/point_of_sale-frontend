import { Classes } from "@blueprintjs/core";
import { Box } from "components";

export const Header = () => {
  return (
    <Box sx={{ ml: 3, mb: 4 }}>
      <Box as="h2" className={`${Classes.HEADING}`}>Receipts</Box>
    </Box>
  )
}

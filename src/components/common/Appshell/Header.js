import { Classes } from "@blueprintjs/core";
import { Box } from "components";

export const Header = (props) => {
  const { title } = props;
  return (
    <Box sx={{ ml: 3, mb: 4 }}>
      <Box as="h2" className={`${Classes.HEADING}`}>
        {title}
      </Box>
    </Box>
  );
};

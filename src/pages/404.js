import { NonIdealState } from "@blueprintjs/core";
import { Flex } from "components";

const FourOFour = () => {
  return (
    <Flex
      sx={{
        height: "100%",
        width: "100%",
        justifyContent: "center"
      }}
    >
      <NonIdealState
        icon="cell-tower"
        title="404"
      />
    </Flex>
  )
}
export default FourOFour;
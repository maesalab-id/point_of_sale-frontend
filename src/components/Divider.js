import { Classes } from "@blueprintjs/core"
import { Box } from "./Grid"

export const Divider = ({ vertical, sx }) => {
  return (
    <Box className={`${Classes.DIVIDER}`} sx={{ my: vertical ? 0 : 2, mx: vertical ? 2 : 0, ...sx }} />
  )
}
import { useTheme } from "@emotion/react";
import { Box } from "./";

export const Container = ({ children, sx, fluid = false, ...props }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        maxWidth: fluid ? undefined : theme.container,
        mx: "auto",
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
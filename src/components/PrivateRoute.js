import { Spinner } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useClient } from "./client"
import { Box } from "./Grid";

export const PrivateRoute = ({ children }) => {
  const client = useClient();
  const [isAuth, setIsAuth] = useState(null);
  useEffect(() => {
    const fetch = async () => {
      try {
        await client.reAuthenticate();
        setIsAuth(true);
      } catch (err) {
        console.error(err.message);
        setIsAuth(false);
      }
    }
    fetch();
  }, [client, client.account]);

  if (isAuth === null) return (
    <Box sx={{ px: 2, py: 4 }}>
      <Spinner />
    </Box>
  )
  if (isAuth === false) return (<Navigate to="/login" />)
  return (children);
}
import {
  // BrowserRouter,
  HashRouter,
  Route,
  Routes
} from "react-router-dom";
import Login from "pages/Login";
import FourOFour from "pages/404";
import { Root } from "pages";
import { PrivateRoute } from "components/PrivateRoute";

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/*" element={
          <PrivateRoute>
            <Root />
          </PrivateRoute>
        } />
        <Route path="*" element={<FourOFour />} />
      </Routes>
    </HashRouter>
  )
}

export default Router;
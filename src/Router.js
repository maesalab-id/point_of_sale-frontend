import {
  BrowserRouter,
  // HashRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Login from "pages/Login";
import FourOFour from "pages/404";
import { Root } from "pages";
import { PrivateRoute } from "components/PrivateRoute";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/*" element={
          <PrivateRoute>
            <Root />
          </PrivateRoute>
        } />
        <Route path="*" element={<FourOFour />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;
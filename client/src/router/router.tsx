import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Login from "../pages/login";
import App from "../App";
import PrivateRoute from "../components/private-route";
import TodoList from "../pages/todo-list";
import Signup from "../pages/signup";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route
        index
        element={
          // <PrivateRoute>
          <TodoList />
          // </PrivateRoute>
        }
      />
    </Route>
  )
);

export default router;

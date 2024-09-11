import { Outlet } from "react-router-dom";
import Layout from "./layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Layout>
      <Outlet />
      <ToastContainer />
    </Layout>
  );
};

export default App;

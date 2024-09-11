import { FaCalendar } from "react-icons/fa";
import Button from "../components/button";
import { useMemo } from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const id = useMemo(() => sessionStorage.getItem("userId"), []);
  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between w-full h-20 px-4 py-4 bg-primary">
        <a className="flex items-center gap-2" href="/">
          <FaCalendar className="text-xl text-white" />
          <h3 className="text-xl font-semibold text-white">Task Manager</h3>
        </a>
        {!id ? (
          <div className="flex items-center gap-2">
            <a href="/login">
              <Button variant="secondary" className="px-4 text-base">
                Login
              </Button>
            </a>
            <a href="/signup">
              <Button variant="primary" className="px-4 text-base">
                Signup
              </Button>
            </a>
          </div>
        ) : (
          <Button variant="danger" className="px-4 text-base">
            Logout
          </Button>
        )}
      </div>
      {children}
    </div>
  );
};

export default Layout;

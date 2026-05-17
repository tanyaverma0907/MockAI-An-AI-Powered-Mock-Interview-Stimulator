import { Outlet } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import { Footer } from "../components/home/Footer";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;

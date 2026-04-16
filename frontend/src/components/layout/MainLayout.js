import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-layout__content">{children}</main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;

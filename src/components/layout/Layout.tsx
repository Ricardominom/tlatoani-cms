import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
      />
    </div>

  );
}

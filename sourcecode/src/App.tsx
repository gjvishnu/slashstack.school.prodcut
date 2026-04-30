import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Body } from "./components/layouts/body";

function App() {
  return (
    <>
      <Body />
      <ToastContainer
        autoClose={3000}
        newestOnTop
        pauseOnHover
        position="top-right"
        theme="light"
      />
    </>
  );
}

export default App;

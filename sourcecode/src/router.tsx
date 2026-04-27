import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Test } from "./components/test";

export const router = createBrowserRouter([
    {
        path :"/",
        element : <App/>,
        children:[{index : true , element : <Test/>}]
    }
])
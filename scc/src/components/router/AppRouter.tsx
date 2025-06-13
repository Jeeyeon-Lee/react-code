import React from "react";
import {Outlet, Route, Routes} from "react-router-dom";
import MainContent from "@pages/view/main/MainContent.tsx";
import Sidebar from "@components/layout/Sidebar.tsx";
import ConsultContent from "@pages/view/consult/ConsultContent.tsx";
import SystemContent from "@pages/view/system/SystemContent.tsx";

function AppRouter() {
    return (
        <Routes>
            <Route path="/main" exact={true} element={<MainContent/>}></Route>
            <Route path="/scc" exact={true} element={<ConsultContent/>}></Route>
            <Route path="/system" exact={true} element={<SystemContent/>}></Route>
        </Routes>
    );
};

export default AppRouter;

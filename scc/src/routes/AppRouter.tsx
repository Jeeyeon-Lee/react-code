import {Route, Routes} from "react-router-dom";
import MainContent from "@pages/bo/scc/chat/MainContent.tsx";
import ConsultContent from "@pages/bo/scc/mon/ConsultContent.tsx";
import SystemContent from "@pages/bo/base/system/SystemContent.tsx";
import CodeContent from "@pages/bo/base/code/CodeContent.tsx";
import MenuContent from "@pages/bo/base/menu/MenuContent.tsx";

function AppRouter() {
    return (
        <Routes>
            <Route path="/main" exact={true} element={<MainContent/>  }></Route>
            <Route path="/scc" exact={true} element={<ConsultContent/>}></Route>
            <Route path="/system" exact={true} element={<SystemContent/>}></Route>
            <Route path="/code" exact={true} element={<CodeContent/>}></Route>
            <Route path="/menu" exact={true} element={<MenuContent/>}></Route>
        </Routes>
    );
};

export default AppRouter;

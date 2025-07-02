import {Route, Routes} from "react-router-dom";
import MainContent from "@pages/bo/scc/chat/MainContent.tsx";
import ConsultContent from "@pages/bo/scc/mon/ConsultContent.tsx";
import CodeContent from "@pages/bo/base/code/CodeContent.tsx";
import MenuContent from "@pages/bo/base/menu/MenuContent.tsx";
import BbsContent from "@pages/bo/base/bbs/BbsContent.tsx";

function AppRouter() {
    return (
        <Routes>
            <Route path="/main" exact={true} element={<MainContent/>  }></Route>
            <Route path="/code" exact={true} element={<CodeContent/>}></Route>
            <Route path="/menu" exact={true} element={<MenuContent/>}></Route>
            <Route path="/notProcess" exact={true} element={<ConsultContent/>}></Route>
            <Route path="/bbs/:bbsCd" exact={true} element={<BbsContent/>}></Route>
        </Routes>
    );
};

export default AppRouter;

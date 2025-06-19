// 전역 CSS (라이브러리 스타일, 리셋 등)
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginForm from "@pages/cmm/login/LoginForm.tsx";
import AuthProvider from "@pages/cmm/login/AuthProvider.tsx";
import queryClient from "@query/queryClient.ts";
import {QueryClientProvider} from "@tanstack/react-query";

createRoot(document.getElementById('root')!).render(

    /* 클라이언트 : zustand 사용 / 서버 : react-query(tanstac query) */
    <QueryClientProvider client={queryClient}>{/*react query 서버 상태관리*/}
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginForm/>}></Route>
                <Route path='/*' element={
                    <AuthProvider>
                        <App></App>
                    </AuthProvider>
                }></Route>
            </Routes>
        </BrowserRouter>
    </QueryClientProvider>
);
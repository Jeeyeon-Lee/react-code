// 전역 CSS (라이브러리 스타일, 리셋 등)
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginForm from "@pages/login/LoginForm.tsx";
import AuthProvider from "@pages/login/AuthProvider.tsx";

createRoot(document.getElementById('root')!).render(
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
);
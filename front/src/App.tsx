import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { AsideLayout } from "./components/AsideLayout";
import { HardwareStore } from "./components/HardwareStore";
import { Login } from "./components/Login.js";
import { Protector } from "./components/Protector.js";
import { RentHardware } from "./components/RentHardware.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Logout } from "./components/Logout.js";
import { AdminPanel } from "./components/AdminPanel";
import { AdminProtector } from "./components/AdminProtector.js";

function App() {
    console.log(import.meta.env.VITE_API_URL);
    return (
        <>
            <main className="flex">
                <Routes>
                    <Route path="/" element={<Protector />}></Route>
                    <Route element={<AsideLayout />}>
                        <Route
                            path="/hardware-store"
                            element={
                                <Protector>
                                    <HardwareStore />
                                </Protector>
                            }
                        />
                        <Route
                            path="/rent-hardware"
                            element={
                                <Protector>
                                    <RentHardware />
                                </Protector>
                            }
                        />
                        <Route
                            path="/admin-panel"
                            element={
                                <AdminProtector>
                                    <AdminPanel />
                                </AdminProtector>
                            }
                        />
                    </Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/logout" element={<Logout />}></Route>
                </Routes>
            </main>
            <ToastContainer closeButton={true} draggable={false}></ToastContainer>
        </>
    );
}

export default App;

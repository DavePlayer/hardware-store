import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { AsideLayout } from "./components/AsideLayout";
import { HardwareStore } from "./components/HardwareStore";
import { Login } from "./components/Login.js";
import { Protector } from "./components/Protector.js";
import { RentHardware } from "./components/RentHardware.js";

function App() {
    return (
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
                </Route>
                <Route path="/login" element={<Login />}></Route>
            </Routes>
        </main>
    );
}

export default App;

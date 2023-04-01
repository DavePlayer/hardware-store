import { Routes, Route } from "react-router-dom";
import { AsideLayout } from "./components/AsideLayout";
import { HardwareStore } from "./components/HardwareStore";

function App() {
  return (
    <main className="flex">
      <Routes>
        <Route path="/" element={<h1>/</h1>}></Route>
        <Route element={<AsideLayout />}>
          <Route path="/hardware-store" element={<HardwareStore />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;

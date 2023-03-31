import { Routes, Route } from "react-router-dom";
import { Aside } from "./components/Aside";

function App() {
  return (
    <main className="flex">
      <Routes>
        <Route path="/" element={<h1>/</h1>}></Route>
        <Route element={<Aside />}>
          <Route path="/hardware-store" element={<h1>/</h1>}></Route>
        </Route>
      </Routes>
    </main>
  );
}

export default App;

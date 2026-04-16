import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import SubmitPage from "./pages/SubmitPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<SubmitPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

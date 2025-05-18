import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import {
  CreateForumPage,
  EditForumPage,
  HomePage,
  SignInPage,
  SignUpPage,
  ViewForumPage,
} from "./pages";
import { ProtectedRoute } from "./components";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/view-forum/:id" element={<ViewForumPage />} />
          <Route path="/forums/new" element={<CreateForumPage />} />
          <Route path="/forums/:id" element={<EditForumPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

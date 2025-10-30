import HomePage from './HomePage.jsx';
import { Route, Routes } from "react-router-dom";
// import PostPage from "./route/PostPage.jsx";
// import Login from "./route/Login.jsx";
import SignUp from "./route/SignUp.jsx";
// import FindQuestions from "./route/FindQuestions.jsx";
import Plans from "./route/Plans.jsx";
import Success from "./route/Success.jsx";
import Cancel from "./route/Cancel.jsx";
// import ProfilePage from "./route/ProfilePage.jsx";
import { useEffect, useState, createContext, useContext, lazy, Suspense } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./util/firebase.js";
import Dashboard from "./route/Dashboard.jsx";
import Loader from "./Components/Loader.jsx";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);
const PostPage = lazy(() => import("./route/PostPage.jsx"));
const FindQuestions = lazy(() => import("./route/FindQuestions.jsx"));
const Login = lazy(() => import("./route/Login.jsx"));
const ProfilePage = lazy(() => import("./route/ProfilePage.jsx"));

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/post" element={<PostPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/questions" element={<FindQuestions />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/profile" element={<ProfilePage user={currentUser} />} />
            <Route path="/dashboard" element={<Dashboard user={currentUser} />} />
            <Route path="/post/:id" element={<PostPage />} />

  
          </Routes>
        </Suspense>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;

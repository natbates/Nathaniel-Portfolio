import "../styles/app.css";
import { createContext, useContext, useState } from "react";
import ContentHolder from "./contentHolder";
import AuthProvider from "./authContext";
import { BrowserRouter as Router } from "react-router-dom"; // Use BrowserRouter here instead

export const ThemeContext = createContext(undefined);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        {/* Only use BrowserRouter here at the top level */}
        <Router>
          <ContentHolder />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

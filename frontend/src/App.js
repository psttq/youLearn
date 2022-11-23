import "./App.css";

import React from "react";
import { Route, Routes } from "react-router-dom";
import { MainPage } from "./components/pages/MainPage";
import { SetPage } from "./components/pages/SetPage";
import { MainMenu } from "./components/Menu";
import { LoginPage } from "./components/pages/LoginPage";
import { RegisterPage } from "./components/pages/RegisterPage";
import { ProfilePage } from "./components/pages/ProfilePage";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<MainMenu />}>
                    <Route path="sets" element={<SetPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;

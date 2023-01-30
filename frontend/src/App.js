import "./App.css";

import React from "react";
import { Route, Routes } from "react-router-dom";
import { MainPage } from "./pages/MainPage";
import { CardsDashboardPage } from "./pages/CardsDashboardPage";
import { MainMenu } from "./components/Menu";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import CreateCardPage from "./pages/CreateCardPage";
import MainCardPage from "./pages/MainCardPage";
import TestMainPage from "./pages/TestMainPage";
import TestEditPage from "./pages/TestEditPage";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<MainMenu />}>
                    <Route path="sets" element={<CardsDashboardPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="create" element={<CreateCardPage />} />
                    <Route path="card/edit/:id" element={<MainCardPage />} />
                    <Route path="test/:id" element={<TestMainPage />} />
                    <Route path="test/edit/:id" element={<TestEditPage />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;

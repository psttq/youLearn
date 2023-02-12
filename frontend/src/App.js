import "./App.css";

import React from "react";
import {Route, Routes} from "react-router-dom";
import {MainPage} from "./pages/MainPage";
import {CardsDashboardPage} from "./pages/CardsDashboardPage";
import {MainMenu} from "./components/Menu";
import {LoginPage} from "./pages/LoginPage";
import {RegisterPage} from "./pages/RegisterPage";
import {ProfilePage} from "./pages/ProfilePage";
import CreateCardPage from "./pages/CreateCardPage";
import MainCardPage from "./pages/MainCardPage";
import TestMainPage from "./pages/TestMainPage";
import TestEditPage from "./pages/TestEditPage";
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query'
import {Provider} from "react-redux";
import {store} from "./redux/store";
import MySetsPage from "./pages/MySetsPage";


function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 0
            },
        },
    })
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        <Route path="/" element={<MainMenu/>}>
                            <Route path="sets" element={<CardsDashboardPage/>}/>
                            <Route path="mysets" element={<MySetsPage/>}/>
                            <Route path="profile" element={<ProfilePage/>}/>
                            <Route path="create" element={<CreateCardPage/>}/>
                            <Route path="card/:id" element={<MainCardPage/>}/>
                            <Route path="test/:id" element={<TestMainPage/>}/>
                            <Route path="test/edit/:id" element={<TestEditPage/>}/>
                        </Route>
                    </Routes>
                </div>
            </Provider>
        </QueryClientProvider>
    );
}

export default App;

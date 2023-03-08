import "./App.css";

import React, {useEffect} from "react";
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
import {MySetsPage} from "./pages/MySetsPage";
import EditCardPage from "./pages/EditCardPage";
import CurrentPage from "./pages/CurrentPage";
import ResultsPage from "./pages/ResultsPage";
import {API_URL} from "./config";
import {useLocation, useNavigate} from "react-router";
import axios from "axios";
import Logout from "./pages/logout";
import UsersPage from "./pages/UsersPage_ADMIN";
import AllResultsPage from "./pages/AllResultsPage";


function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 0
            },
        },
    });
    let location = useLocation();

    const whitelist = ['/login', '/register', '/']
    const navigate = useNavigate();
    useEffect(() => {
        axios.post(`${API_URL}/checkauth`, {}).then(res =>{
            if(res.status === 200){
                if(!res.data.auth)
                    if(!(location.pathname in whitelist))
                        navigate("/");
            }
            else{
                if(!(location.pathname in whitelist))
                    navigate("/");
            }
        }).catch(()=>{
            if(!(location.pathname in whitelist))
                navigate("/");
        })
    }, []);


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
                            <Route path="current" element={<CurrentPage/>}/>
                            <Route path="results" element={<ResultsPage/>}/>
                            <Route path="create" element={<CreateCardPage/>}/>
                            <Route path="card/:id" element={<MainCardPage/>}/>
                            <Route path="card/results/:id" element={<AllResultsPage/>}/>
                            <Route path="attempt/:id" element={<TestMainPage/>}/>
                            <Route path="test/edit/:id" element={<TestEditPage/>}/>
                            <Route path="card/edit/:id" element={<EditCardPage/>}/>
                            <Route path="admin/users" element={<UsersPage/>}/>
                            <Route path="logout" element={<Logout/>}/>
                        </Route>
                    </Routes>
                </div>
            </Provider>
        </QueryClientProvider>
    );
}

export default App;

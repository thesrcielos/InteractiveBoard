import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import GoogleCallback from "../components/GoogleCallback";
import SignUp from "../components/SignUp";
import {PrivateRoute} from './PrivateRoute';
import Board from '../components/Board';

const AppRoutes = () =>{
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/google/callback" element={<GoogleCallback/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route element={<PrivateRoute/>}>
                <Route path="/home" element={<Board/>}/>
            </Route>
        </Routes>
    );
}

export default AppRoutes;
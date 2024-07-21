import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TodoList from "../components/TodoList";
import Login from "../components/Login";
import Register from "../components/Register";
import ProtectedRoutes from "./ProtectedRoutes";

const UserRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoutes />}>
          <Route index element={<TodoList />} />{" "}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default UserRouter;

import { HomeIcon, UsersIcon } from "lucide-react"
import { lazy } from "react";
import type { Route } from "../utils/types/routes"

const Home = lazy(() => import("../pages/Home"));
const Users = lazy(() => import("../pages/Users"));
const Login = lazy(() => import("../pages/Login"));

export const protected_routes: Array<Route> = [
    {
        path: "/",
        name: "Home",
        exact: true,
        icon: HomeIcon,
        page: Home
    },
    {
        path: "/users",
        name: "Users",
        exact: true,
        icon: UsersIcon,
        page: Users
    },
]

export const public_routes: Array<Route> = [
    {
        path: "/login",
        name: "Login",
        exact: true,
        icon: null,
        page: Login
    },
]
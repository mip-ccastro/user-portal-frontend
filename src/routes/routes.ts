import { HomeIcon, UsersIcon, User } from "lucide-react"
import { lazy } from "react";
import type { Route } from "../utils/types/routes"

const Home = lazy(() => import("../pages/Home"));
const Users = lazy(() => import("../pages/Users"));
const Profile = lazy(() => import("../pages/Profile"));
const Login = lazy(() => import("../pages/Login"));

export const protected_routes: Array<Route> = [
    {
        path: "/",
        name: "Home",
        exact: true,
        icon: HomeIcon,
        page: Home,
        inMenu: true
    },
    {
        path: "/users",
        name: "Users",
        exact: true,
        icon: UsersIcon,
        page: Users,
        inMenu: true
    },
    {
        path: "/profile",
        name: "Profile",
        exact: true,
        icon: User,
        page: Profile,
        inMenu: false
    },
]

export const public_routes: Array<Route> = [
    {
        path: "/login",
        name: "Login",
        exact: true,
        icon: null,
        page: Login,
        inMenu: false
    },
]
import { HomeIcon, UsersIcon, User, LayoutTemplate, Contact2, Files } from "lucide-react"
import { lazy } from "react";
import type { Route } from "../utils/types/routes"

const Home = lazy(() => import("../pages/Home"));
const Users = lazy(() => import("../pages/Users"));
const Profile = lazy(() => import("../pages/Profile"));
const Login = lazy(() => import("../pages/Login"));
const Templates = lazy(() => import("../pages/Templates"));
const Template = lazy(() => import("../pages/Template"));
const Recipients = lazy(() => import("../pages/Recipients"));
const Forms = lazy(() => import("../pages/Forms"));
const Form = lazy(() => import("../pages/Form"));

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
    {
        path: "/templates",
        name: "Templates",
        exact: true,
        icon: LayoutTemplate,
        page: Templates,
        inMenu: true
    },
    {
        path: "/template/:id",
        name: "Template",
        exact: true,
        icon: LayoutTemplate,
        page: Template,
        inMenu: false
    },
    {
        path: "/recipients",
        name: "Recipients",
        exact: true,
        icon: Contact2,
        page: Recipients,
        inMenu: true
    },
    {
        path: "/forms",
        name: "Forms",
        exact: true,
        icon: Files,
        page: Forms,
        inMenu: true
    },
    {
        path: "/form/:id",
        name: "Form",
        exact: true,
        icon: Files,
        page: Form,
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
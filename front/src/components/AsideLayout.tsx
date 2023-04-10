import React from "react";
import { Links } from "./AsideLayout/Links";
import { UserInfo } from "./AsideLayout/UserInfo";
import { Logout } from "./AsideLayout/Logout";
import { Outlet } from "react-router-dom";

export function AsideLayout() {
  return (
    <>
      <aside className="w-1/6 p-4 h-[100vh] bg-aside-default flex flex-col">
        <UserInfo />
        <Links />
        <Logout />
      </aside>
      <Outlet />
    </>
  );
}

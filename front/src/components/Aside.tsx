import React from "react";
import { Links } from "./Aside/Links";
import { UserInfo } from "./Aside/UserInfo";
import { Logout } from "./Aside/Logout";

export function Aside() {
  return (
    <aside className="w-1/6 p-4 h-[100vh] bg-aside-default flex flex-col">
      <UserInfo />
      <Links />
      <Logout />
    </aside>
  );
}

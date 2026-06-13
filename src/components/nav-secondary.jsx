"use client";

import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {Link, useLocation} from "react-router-dom";

export function NavSecondary({items, ...props}) {
  const location = useLocation();
  const {t} = useAppTranslation("dashboard");

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1.5">
          {items.map((item) => {
            const isActive = location.pathname === item.url;
            const translatedTitle = t("nav." + item.titleKey) || item.title;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={translatedTitle}>
                  <Link to={item.url}>
                    {item.icon}
                    <span>{translatedTitle}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

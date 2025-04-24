import React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from './sidebar';
import { AppSidebar } from '../app-sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="ps-10 py-7">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
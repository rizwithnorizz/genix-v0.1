import React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from './sidebar';
import { AppSidebar } from '../app-sidebar';

const Layout = ({ children }: { children: React.ReactNode}) => {
  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className ="sticky z-10 bg-background/95 supports - [backdrop-filter]:bg-background/60 backdrop-blur top-0 flex shrink-0 items center gap-2 border-b h-16 px-3">
              <SidebarTrigger />
          </header>
          <main className = "p-5">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
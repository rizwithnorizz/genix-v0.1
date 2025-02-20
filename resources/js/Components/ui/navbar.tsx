import React from 'react'
import { SidebarTrigger } from './sidebar';
import { NavUser } from '../nav-user';
import { User } from '@/types';

const user: User = {
    id: 1,
    name: "Kyoto",
    email: "Kyoto@gmail.com",
    avatar: "/logo.png",  
};



const Navbar = () => {
    return (
        <header className ="sticky z-10 bg-background/95 supports - [backdrop-filter]:bg-background/60 backdrop-blur top-0 flex shrink-0 items center gap-2 border-b h-16 px-3">
            <SidebarTrigger />

            <div className='ml-auto'>
                <NavUser 
                    user ={user} 
                    isNavbar
                    btnClassName="hover:bg-transparent focus visible:ring-0"
                />
            </div>
        </header>
    );
};

export default Navbar;
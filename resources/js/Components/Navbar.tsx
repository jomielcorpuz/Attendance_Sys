import React from 'react'
import { NavUser } from './nav-user';
import { User } from '@/types';
import { SidebarTrigger } from '@/components//ui/sidebar';

const user: User = {
    id: 1,
    name: 'John Doe',
    email: 'test1@gmail,com',
    avatar: '/images/avatar.png',
    roles: [],
};

const Navbar = () => {
    return <header className="sticky z-10 bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur top-0 flex shrink-0 items-center gap-2 border-b h-16 px-4 py-4 ">
        <SidebarTrigger />
        <div className="ml-auto">
            <NavUser
                user={user}
                isNavbar
                btnClassName='hover:bg-transparent focus-visible:ring-0' />
        </div>
    </header>
};

export default Navbar;

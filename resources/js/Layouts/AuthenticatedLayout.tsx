import { AppSidebar } from "@/Components/app-sidebar"
import { ChartAreaInteractive } from "@/Components/chart-area-interactive"
import { DataTable } from "@/Components/data-table"
import { SectionCards } from "@/Components/section-cards"
import { SiteHeader } from "@/Components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

import data from "../../../app/dashboard/data.json"
export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <main className=" bg-white">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

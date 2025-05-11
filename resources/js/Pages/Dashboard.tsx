import { AppSidebar } from "@/Components/app-sidebar"
import { ChartAreaInteractive } from "@/Components/chart-area-interactive"
import { DataTable } from "@/Components/data-table"
import { SectionCards } from "@/Components/section-cards"
import { SiteHeader } from "@/Components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import data from "../../../app/dashboard/data.json"
import Authenticated from "@/Layouts/AuthenticatedLayout"

export default function Dashboard() {
    return (
        <Authenticated>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">

                    <div className="grid gap-4 py-4 md:gap-6 md:py-6">

                        <SectionCards />
                        <div className="px-4 lg:px-6">
                            <ChartAreaInteractive />
                        </div>
                        <DataTable data={data} />
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}

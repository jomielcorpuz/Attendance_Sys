import { Button } from '@/components/ui/button'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import React from 'react'
import CreateWorkSheetDialog from './CreateDialog'
import { router } from '@inertiajs/react';



interface Worksheet {
    id?: number;
    worksheet_name: string;
    cloudflare_username: string;
    googlepanel_username: string;
    cloudflare_credential_id: string;
    googlepanel_credential_id: string;
    no_of_domains: number;
    no_of_users_per_domain: number;
    total_users: number;
    workspace: string;
    tag: string;
    sheet_link: string;
    timestamp_cdt: Date;
    created_at: string
    details: string;
    created_by: string;
}

interface WorksheetProps {
    worksheet_data: {
        data: Worksheet[];
        links: any;
        meta: any;
    };
    pagination: any;
}
function Worksheet({ worksheet_data, pagination }: WorksheetProps) {

    const worksheets = worksheet_data.data || [];

    return (
        <Authenticated>

            <div className='p-8 flex items-end justify-end'>
                <CreateWorkSheetDialog worksheets={undefined} onSuccess={() => router.reload()} />
            </div>
        </Authenticated>
    )
}

export default Worksheet

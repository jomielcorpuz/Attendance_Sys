import { Button } from '@/components/ui/button'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import React from 'react'
import CreateWorkSheetDialog from './CreateDialog'

function Worksheet() {
    return (
        <Authenticated>

            <div className='p-8 flex items-end justify-end'>
                <CreateWorkSheetDialog />
            </div>
        </Authenticated>
    )
}

export default Worksheet

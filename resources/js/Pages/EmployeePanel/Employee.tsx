import Authenticated from '@/Layouts/AuthenticatedLayout'
import React from 'react'


interface Employee {
    id: number;
    name: string;
    nickname: string;
    email: string;
    age: number;
    start_date: string;
    gender: string;
    team_id: string;
    rate_per_hour: string;
    user_id: string;
    employee_number: string;
}

interface EmployeeProps {
    employee_data: {
        data: Employee[];
        links: any;
        meta: any;
    };
    pagination: any;
}
function Employee({ employee_data, pagination }: EmployeeProps) {
    const employee = employee_data.data || [];

    return (
        <Authenticated>
            <div className='p-6'>

            </div>

        </Authenticated>
    )
}

export default Employee

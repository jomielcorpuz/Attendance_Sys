import Authenticated from '@/Layouts/AuthenticatedLayout'
import React from 'react'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/Components/ui/breadcrumb";
import { Button } from '@/Components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, PencilLine, Trash2 } from 'lucide-react';
import { ACTIVE_STATUS_CLASS_MAP, ACTIVE_STATUS_TEXT_MAP } from '@/constants';
import PaginateRes from '@/Components/PaginateRes';

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
    status: "Active" | "Inactive" | "Scheduled" | "Settled";
    employee_number: string;
    created_at: Date;
    created_by: string;
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
    const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);

    const [selectedEmployeeID, setSelectedEmployeeID] = React.useState<number[]>([])
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedDelete, setSelectedDelete] = React.useState<Employee | null>(null);

    const handleRowClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedEmployee(null);
    };

    const handleSelectedEmployee = (employeeID: number) => {
        setSelectedEmployeeID(prev =>
            prev.includes(employeeID)
                ? prev.filter(id => id !== employeeID)
                : [...prev, employeeID]
        );
    };

    const handleDeleteClick = (employee: Employee) => {
        setSelectedDelete(employee);
        setDeleteDialogOpen(true);
    };
    return (
        <Authenticated>
            <div className='p-6'>
                <Separator orientation="vertical" className="mr-2 h-2 bg-gray-100" />
                <Breadcrumb className='mb-4'>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">
                                Platform
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Residents</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className='flex justify-between items-center mb-4'>
                    <div className=''>
                        <h2 className='font-semibold text-xl text-gray-800'>Hey Admin</h2>
                        <a>Here's your residents information</a>
                    </div>
                    <div className='flex justify-end space-x-4'>
                        <Button variant="outline" className=' hover:bg-gray-200 mr-4 '>

                            Export
                        </Button>
                    </div>

                </div>
            </div>
            <Card className="mt-6 lg:col-span-2 sm: col-span-1 ">
                <div className="p-4 ">
                    <h2 className="mb-4 font-semibold text-xl text-gray-800">employee cases</h2>
                    <div className="flex justify-start lg:max-w-[30%] mb-2 sm:w-[50%]">
                        <Input placeholder="Search" className="mr-2" />

                    </div>
                    <div className="overflow-auto">
                        <Table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                            <TableHeader>
                                <TableRow className='text-md '>
                                    <TableHead >
                                        <Checkbox
                                        />
                                    </TableHead>
                                    <TableHead >Full Name</TableHead>
                                    <TableHead className='flex justify-start items-center gap-2'> Nickname</TableHead>
                                    <TableHead> <div className='flex justify-start items-center gap-2'>  Team </div></TableHead>
                                    <TableHead className='flex justify-start items-center gap-2'> Salary rate</TableHead>
                                    <TableHead ><div className='flex justify-start items-center gap-2 text-nowrap'>Date Created</div></TableHead>
                                    <TableHead className='flex justify-start items-center gap-2'> Status</TableHead>
                                    <TableHead ><div className='flex justify-start items-center gap-2'>   Provider </div></TableHead>
                                    <TableHead ><div className='flex justify-center items-center gap-2'>  Actions</div ></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody >
                                {employee.length > 0 ? (
                                    employee.map((employee: Employee) => (
                                        <TableRow
                                            key={employee.id}
                                            className='transition-all duration-100 text-md'>
                                            <TableCell >

                                            </TableCell>
                                            <TableCell className="font-medium text-nowrap">{employee.name}</TableCell>
                                            <TableCell className='text-nowrap'>{employee.nickname}</TableCell>
                                            <TableCell className='text-nowrap'>{employee.team_id}</TableCell>
                                            <TableCell>{employee.rate_per_hour}</TableCell>
                                            <TableCell className="">
                                                {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(employee.created_at))}
                                            </TableCell>


                                            <TableCell>  <span className={"px-2 py-1 rounded-xl " + ACTIVE_STATUS_CLASS_MAP[employee.status]}>
                                                {ACTIVE_STATUS_TEXT_MAP[employee.status]}
                                            </span></TableCell>
                                            <TableCell>{employee.created_by}</TableCell>

                                            <TableCell className="flex justify-center items-center text-right space-x-4">
                                                <Button
                                                    type='button'
                                                    onClick={() => handleRowClick(employee)}
                                                    variant="ghost"
                                                    className='px-3 gap-1 transition-all duration-100 hover:scale-105' >
                                                    <Eye /> View
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className='px-3 gap-1 transition-all duration-100 hover:scale-105'>
                                                    <PencilLine /> Edit
                                                </Button>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteClick(employee)}
                                                                className='px-2 gap-1 transition-all duration-100 hover:scale-105'>
                                                                <Trash2 color="red" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-4">
                                            No employees found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>


                        </Table>
                    </div>
                    <PaginateRes pagination={pagination} />
                </div>
            </Card >

        </Authenticated>
    )
}

export default Employee

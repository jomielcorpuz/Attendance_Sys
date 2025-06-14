"use client"
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
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, PencilLine, Trash2 } from 'lucide-react';
import { ACTIVE_STATUS_CLASS_MAP, ACTIVE_STATUS_TEXT_MAP } from '@/constants';
import PaginateRes from '@/Components/PaginateRes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


interface Department {
    id: number;
    name: string;
    description?: string;
}

interface Employee {
    id: number;
    name: string;
    nickname: string;
    email: string;
    age: number;
    start_date: string;
    gender: string;
    team_id: string;
    department?: Department;
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
    pagination_employee: any;
    queryParams: any;
}


function Attendance({ employee_data, pagination_employee, queryParams: initialQueryParams }: EmployeeProps) {
    const employee = employee_data.data || [];

    const [activeTab, setActiveTab] = React.useState("employee");
    const [queryParams, setQueryParams] = React.useState(initialQueryParams || {});
    const [search, setSearch] = React.useState(queryParams.fullname || "");
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

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);      // Update the active tab
        setSearch("");     // Clear search input when switching tabs
        setQueryParams({});
    };
    const handleDeleteClick = (employee: Employee) => {
        setSelectedDelete(employee);
        setDeleteDialogOpen(true);
    };

    return (
        <Authenticated>

            <Tabs defaultValue='employee' className='p-4'>
                <TabsList className='p-2 space-x-2'>
                    <TabsTrigger value='employee' onClick={() => handleTabChange("employee")} className='text-md  data-[state=active]:text-gray-700 rounded-lg text-gray-700 hover:rounded-lg hover:bg-white hover:text-gray-700  transition-all  duration-150 '> Employee</TabsTrigger>
                    <TabsTrigger value='attendance' onClick={() => handleTabChange("attendance")} className='text-md data-[state=active]:text-gray-700 rounded-lg text-gray-700 hover:rounded-lg hover:bg-white hover:text-gray-700  transition-all  duration-150 '> Attendance</TabsTrigger>


                </TabsList>

                <TabsContent value='employee'>
                    <Card className="mt-6 lg:col-span-2 sm: col-span-1 ">
                        <div className="p-4 ">
                            <h2 className="mb-4 font-semibold text-xl text-gray-800">Employee List</h2>
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
                                            <TableHead> <div className='flex justify-start items-center gap-2'>  Department </div></TableHead>
                                            <TableHead> <div className='flex justify-start items-center gap-2'>  Team </div></TableHead>
                                            <TableHead> <div className='flex justify-start items-center gap-2'>  Status </div></TableHead>
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
                                                    <TableCell className='text-nowrap'>{employee.department?.name ?? '—'}</TableCell>
                                                    <TableCell className='text-nowrap'>{employee.team_id}</TableCell>


                                                    <TableCell>  <span className={"px-2 py-1 rounded-xl " + ACTIVE_STATUS_CLASS_MAP[employee.status]}>
                                                        {ACTIVE_STATUS_TEXT_MAP[employee.status]}
                                                    </span></TableCell>

                                                    <TableCell className="flex justify-center items-center text-right space-x-4">
                                                        <Button
                                                            type='button'
                                                            onClick={() => handleRowClick(employee)}
                                                            variant="ghost"
                                                            className='px-3 gap-1 border transition-all duration-100 hover:scale-105' >
                                                            Clock-In
                                                        </Button>

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
                            <PaginateRes pagination={pagination_employee} />
                        </div>
                    </Card >
                </TabsContent>
            </Tabs>


        </Authenticated>
    )
}

export default Attendance

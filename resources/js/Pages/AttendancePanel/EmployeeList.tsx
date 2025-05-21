import React, { useCallback, useEffect } from 'react'
import { Calendar, Ellipsis, EllipsisVertical, MapPin, PenLine, Pin, X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ACTIVE_STATUS_CLASS_MAP, ACTIVE_STATUS_TEXT_MAP, EVENT_STATUS_CLASS_MAP, EVENT_STATUS_TEXT_MAP } from '@/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Checkbox from '@/Components/Checkbox';
import PaginateRes from '@/Components/PaginateRes';




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



function EmployeeList() {
    const [employee, setEmployee] = React.useState<Employee[]>([]);
    const [nextUrl, setNextUrl] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const observerRef = React.useRef<HTMLDivElement | null>(null);
    const [activeTab, setActiveTab] = React.useState("all");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortValue, setSortValue] = React.useState("all");
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);
    const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
    const [pagination, setPagination] = React.useState<any | null>(null);


    const handleTabChange = (tab: string) => {
        setActiveTab(tab);      // Update active tab
        setSearchQuery("");          // Clear search input
        setEmployee([]);          // Reset events list when switching tabs
        setNextUrl(null);       // Reset pagination URL so it fetches again
        fetchEmployee();          // Trigger fetch for the new tab
    };

    const handleRowClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsPanelOpen(true);
    };


    // Filter events based on active tab and search input
    const filteredEvents = employee
        .filter((employee) => activeTab === "all" || employee.status.toLowerCase() === activeTab.toLowerCase())
        .filter((employee) => employee.name.toLowerCase().includes(searchQuery.toLowerCase()));


    const fetchEmployee = async (url = "/api/employee", append = false) => {
        const queryParams = new URLSearchParams();
        queryParams.set("per_page", "10");
        if (searchQuery) queryParams.set("name", searchQuery);
        if (activeTab !== "all") queryParams.set("status", activeTab);

        const finalUrl = url.includes("?") ? url + "&" + queryParams.toString() : url + "?" + queryParams.toString();

        setLoading(true);
        try {
            const response = await fetch(finalUrl, { headers: { Accept: "application/json" } });
            const data = await response.json();

            if (data?.data && Array.isArray(data.data)) {
                setEmployee((prev) => (append ? [...prev, ...data.data] : data.data));
            }

            if (data?.pagination_employee) {
                setPagination(data.pagination_employee);
            }

            setNextUrl(
                data.pagination_employee?.links?.find((link: any) =>
                    link.label.toLowerCase().includes("next")
                )?.url || null
            );
        } catch (error) {
            console.error("Error fetching employee:", error);
        } finally {
            setLoading(false);
        }
    };




    // Fetch initial events when component mounts
    useEffect(() => {
        fetchEmployee();
    }, []);

    // Infinite Scroll: Fetch next page when in view
    const loadMore = useCallback(() => {
        if (!nextUrl || loading) return; // Stop if no more pages or still loading
        fetchEmployee(nextUrl, true,);
    }, [nextUrl, loading]);


    useEffect(() => {
        if (!nextUrl) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [nextUrl, loadMore]);



    const handleSort = (value: string) => {

    }

    return (
        <div>
            <Tabs
                defaultValue='all' className='py-8'>
                <TabsList className='w-full justify-start bg-white gap-2'>
                    {["all", "Ongoing", "Planned", "Completed", "Cancelled"].map((status) => (
                        <TabsTrigger
                            key={status}
                            value={status}
                            onClick={() => handleTabChange(status.toLowerCase())} // Call handleTabChange
                            className="rounded-full data-[state=active]:bg-blue-400 data-[state=active]:text-white"
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)} {/* Capitalize */}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="all" className='py-8'>
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
                            {pagination && <PaginateRes pagination={pagination} />}


                        </div>
                    </Card >
                </TabsContent>






            </Tabs>
        </div>

    )
}

export default EmployeeList

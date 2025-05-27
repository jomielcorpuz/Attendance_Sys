import { Button } from '@/components/ui/button'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import React, { useEffect, useState } from 'react'
import CreateWorkSheetDialog from './CreateDialog'
import { router } from '@inertiajs/react';
import { BookCheck, Briefcase, BriefcaseBusiness, Eye, Layers, NotepadText, PencilLine, Trash2, X } from 'lucide-react';
import SummaryCard from '@/Components/summary-card';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Checkbox from '@/Components/Checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PaginateRes from '@/Components/PaginateRes';
import { ACTIVE_STATUS_CLASS_MAP, ACTIVE_STATUS_TEXT_MAP } from '@/constants';
import { FilterMenuCheckboxes } from '@/Components/filter-column';


const summaryWorksheets = [

    { title: "Total Task", value: "100", icon: Briefcase },
    { title: "Active Task", value: "12", icon: NotepadText },
    { title: "Pending Task", value: "50", icon: Layers },
    { title: "Completed Task", value: "5", icon: BookCheck },

]

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
    status: "Active" | "Inactive" | "Scheduled" | "Settled";
    created_by: string;
}

interface WorksheetProps {
    worksheet_data: {
        data: Worksheet[];
        links: any;
        meta: any;
    };
    pagination: any;
    queryParams: any;
}


function Worksheet({ worksheet_data, pagination, queryParams: initialQueryParams }: WorksheetProps) {

    const worksheets = worksheet_data.data || [];
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);
    const [selectedEmployee, setSelectedEmployee] = React.useState<Worksheet | null>(null);
    const [selectedEmployeeID, setSelectedEmployeeID] = React.useState<number[]>([])
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedDelete, setSelectedDelete] = React.useState<Worksheet | null>(null);


    const [queryParams, setQueryParams] = React.useState(initialQueryParams || {});
    const [perPage, setPerPage] = React.useState(queryParams.per_page || 10);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const [search, setSearch] = useState(queryParams.search || "");
    const [filters, setFilters] = React.useState({
        client_id: "",
        id: "",
    });

    const getSearchParamKey = () => {
        switch (activeFilter) {
            case "workspace":
                return "workspace";
            case "tag":
                return "tag";
            case "client":
                return "client";
            case "cloudflare":
                return "cloudflare";
            case "googlepanel":
                return "googlepanel";
            default:
                return null;
        }
    };

    const filterTypes = ["workspace", "tag", "client", "cloudflare", "googlepanel"];

    const items = filterTypes.map((type) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        checked: activeFilter === type,
        onCheckedChange: (checked: boolean | "indeterminate" | undefined) => {
            if (checked === true) {
                setActiveFilter(type);
            } else {
                setActiveFilter(null);
            }
        },
    }));



    const handleRowClick = (worksheet: Worksheet) => {
        setSelectedEmployee(worksheet);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedEmployee(null);
    };

    const handleDeleteClick = (worksheet: Worksheet) => {
        setSelectedDelete(worksheet);
        setDeleteDialogOpen(true);
    };


    const handleFilterChange = (filterName: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: value,
        }));
    };

    // Fetch data when filters change
    useEffect(() => {
        router.get(route("worksheetpanel.worksheet"), {
            ...queryParams,
            ...filters,
        }, { replace: true, preserveState: true });
    }, [filters]);

    const handleSort = (column: string) => {
        setQueryParams((prev: any) => {
            const newQueryParams = { ...prev };

            if (newQueryParams.sort_field === column) {
                newQueryParams.sort_direction = newQueryParams.sort_direction === "asc" ? "desc" : "asc";
            } else {
                newQueryParams.sort_field = column;
                newQueryParams.sort_direction = "asc";
            }

            router.get(route("worksheetpanel.worksheet"), { ...newQueryParams, ...filters }, {
                replace: true,
                preserveState: true,
                preserveScroll: true,
            });

            return newQueryParams;
        });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setQueryParams((prev: any) => ({
                ...prev,
                search,
                filter_column: activeFilter || "", // empty string if no filter
            }));
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, activeFilter]);



    useEffect(() => {
        router.get(route("worksheetpanel.worksheet"), { ...queryParams, ...filters }, {
            replace: true,
            preserveState: true
        });
    }, [queryParams]);

    const handlePerPageChange = (value: number) => {
        setPerPage(value);
        setQueryParams((prev: any) => ({ ...prev, per_page: value }));
    };

    return (
        <Authenticated>

            <div className='px-8 py-4 flex items-end justify-end'>
                <CreateWorkSheetDialog worksheets={undefined} onSuccess={() => router.reload()} />


            </div>
            <div className='px-8 py-4 grid gap-6 lg:grid-cols-4 sm:grid-cols-1' >
                {summaryWorksheets.map((item) => (
                    <SummaryCard key={item.title} title={item.title} value={item.value} icon={item.icon} />
                ))}
            </div>

            <Card className="mx-8 my-4 lg:col-span-2 sm: col-span-1 ">
                <div className="p-4 ">
                    <h2 className="mb-4 font-semibold text-xl text-gray-800">Worksheet List</h2>
                    {/* Search Input */}
                    <div className='flex space-x-6'>
                        <div className="relative w-full">
                            <Input
                                type="text"
                                placeholder="Search households..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border p-2 rounded pr-10" // Add padding to the right to make space for the button
                            />
                            {search && (
                                <Button
                                    onClick={() => setSearch("")}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 rounded-full p-[5px] h-5 w-5"
                                >
                                    <X className="p-0.5 text-white-" />
                                </Button>
                            )}
                        </div>


                        <FilterMenuCheckboxes items={items} />

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
                                {worksheets.length > 0 ? (
                                    worksheets.map((worksheet: Worksheet) => (
                                        <TableRow
                                            key={worksheet.id}
                                            className='transition-all duration-100 text-md'>
                                            <TableCell >

                                            </TableCell>
                                            <TableCell className="font-medium text-nowrap">{worksheet.worksheet_name}</TableCell>
                                            <TableCell className='text-nowrap'>{worksheet.cloudflare_username}</TableCell>
                                            <TableCell className='text-nowrap'>{worksheet.googlepanel_username}</TableCell>
                                            <TableCell>{worksheet.tag}</TableCell>
                                            <TableCell className="">
                                                {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(worksheet.created_at))}
                                            </TableCell>


                                            <TableCell>  <span className={"px-2 py-1 rounded-xl " + ACTIVE_STATUS_CLASS_MAP[worksheet.status]}>
                                                {ACTIVE_STATUS_TEXT_MAP[worksheet.status]}
                                            </span></TableCell>
                                            <TableCell>{worksheet.created_by}</TableCell>

                                            <TableCell className="flex justify-center items-center text-right space-x-4">
                                                <Button
                                                    type='button'
                                                    onClick={() => handleRowClick(worksheet)}
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
                                                                onClick={() => handleDeleteClick(worksheet)}
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

export default Worksheet

import { Button } from '@/components/ui/button'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import React, { useEffect, useState } from 'react'
import { router } from '@inertiajs/react';
import { BookCheck, Briefcase, BriefcaseBusiness, Eye, Layers, NotepadText, PencilLine, ShieldAlert, ShieldCheck, ShieldPlus, Trash2, X } from 'lucide-react';
import SummaryCard from '@/Components/summary-card';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Checkbox from '@/Components/Checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PaginateRes from '@/Components/PaginateRes';
import { ACTIVE_STATUS_CLASS_MAP, ACTIVE_STATUS_TEXT_MAP, CREDENTIAL_STATUS_CLASS_MAP, CREDENTIAL_STATUS_TEXT_MAP } from '@/constants';
import { FilterMenuCheckboxes } from '@/Components/filter-column';
import AddCredentialsDialog from './CreateDialog';


const summaryCredentials = [

    { title: "Total ", value: "100", icon: ShieldPlus },
    { title: "Active ", value: "80", icon: ShieldCheck },
    { title: "Suspended ", value: "20", icon: ShieldAlert },

]

interface Credentials {
    id?: number;
    name: string;
    client_id: number;
    username: string;
    password: string;
    assigned: number;
    available: number;
    category: string;
    remarks: string;
    description: string;
    organization_name: string;
    label: string;
    created_at: string
    status: "Active" | "Inactive" | "Updated" | "Suspended";
    created_by: string;
}

interface CredentialsProps {
    credentials_data: {
        data: Credentials[];
        links: any;
        meta: any;
    };
    pagination: any;
    queryParams: any;
}


function Credentials({ credentials_data, pagination, queryParams: initialQueryParams }: CredentialsProps) {

    const credentials = credentials_data.data || [];
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);
    const [selectedEmployee, setSelectedEmployee] = React.useState<Credentials | null>(null);
    const [selectedEmployeeID, setSelectedEmployeeID] = React.useState<number[]>([])
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedDelete, setSelectedDelete] = React.useState<Credentials | null>(null);


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



    const handleRowClick = (credentials: Credentials) => {
        setSelectedEmployee(credentials);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedEmployee(null);
    };

    const handleDeleteClick = (credentials: Credentials) => {
        setSelectedDelete(credentials);
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
        router.get(route("credentialspanel.credentials"), {
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

            router.get(route("credentialspanel.credentials"), { ...newQueryParams, ...filters }, {
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
        router.get(route("credentialspanel.credentials"), { ...queryParams, ...filters }, {
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
                <AddCredentialsDialog credentials={undefined} onSuccess={() => router.reload()} />


            </div>
            <div className='px-8 py-4 grid gap-6 lg:grid-cols-4 sm:grid-cols-1' >
                {summaryCredentials.map((item) => (
                    <SummaryCard key={item.title} title={item.title} value={item.value} icon={item.icon} />
                ))}
            </div>

            <Card className="mx-8 my-4 lg:col-span-2 sm: col-span-1 ">
                <div className="p-4 ">
                    <h2 className="mb-4 font-semibold text-xl text-gray-800">credentials List</h2>
                    {/* Search Input */}
                    <div className='flex space-x-6'>
                        <div className="relative w-full">
                            <Input
                                type="text"
                                placeholder="Search"
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
                                    <TableHead >credentials Name</TableHead>
                                    <TableHead className='flex justify-start items-center gap-2'>Cloudflare</TableHead>
                                    <TableHead> <div className='flex justify-start items-center gap-2'>Admin Panel</div></TableHead>
                                    <TableHead className='flex justify-start items-center gap-2'>Tag</TableHead>
                                    <TableHead ><div className='flex justify-start items-center gap-2 text-nowrap'>Status</div></TableHead>
                                    <TableHead ><div className='flex justify-start items-center gap-2 text-nowrap'>Date Created</div></TableHead>
                                    <TableHead ><div className='flex justify-start items-center gap-2'>   Provider </div></TableHead>
                                    <TableHead ><div className='flex justify-center items-center gap-2'>  Actions</div ></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody >
                                {credentials.length > 0 ? (
                                    credentials.map((credential: Credentials) => (
                                        <TableRow
                                            key={credential.id}
                                            className='transition-all duration-100 text-md'>
                                            <TableCell >

                                            </TableCell>
                                            <TableCell className="font-medium text-nowrap">{credential.name}</TableCell>
                                            <TableCell>{credential.label}</TableCell>
                                            <TableCell className='text-nowrap'>
                                                {credential.username}
                                                <div>

                                                    <Button
                                                        type='button'
                                                        onClick={() => handleRowClick(credential)}
                                                        variant="ghost"
                                                        className='px-3 gap-1 transition-all duration-100 hover:scale-105' >
                                                        <Eye /> View
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className='text-nowrap'>{credential.password}</TableCell>
                                            <TableCell>{credential.assigned}</TableCell>
                                            <TableCell>{credential.available}</TableCell>
                                            <TableCell>{credential.status}</TableCell>


                                            <TableCell>  <span className={"px-2 py-1 rounded-xl " + CREDENTIAL_STATUS_CLASS_MAP[credential.status]}>
                                                {CREDENTIAL_STATUS_TEXT_MAP[credential.status]}
                                            </span></TableCell>

                                            <TableCell className="">
                                                {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(credential.created_at))}
                                            </TableCell>
                                            <TableCell>{credential.created_by}</TableCell>

                                            <TableCell className="flex justify-center items-center text-right space-x-4">

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
                                                                onClick={() => handleDeleteClick(credential)}
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
                                            No Credentials Found
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

export default Credentials

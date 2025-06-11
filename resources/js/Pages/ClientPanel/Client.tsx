import { Button } from '@/Components/ui/button'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import React, { useEffect, useState } from 'react'
import { router } from '@inertiajs/react';
import { BookCheck, Briefcase, BriefcaseBusiness, Check, Copy, Eye, Layers, NotepadText, PencilLine, ShieldAlert, ShieldCheck, ShieldPlus, Trash2, X } from 'lucide-react';
import SummaryCard from '@/Components/summary-card';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Checkbox from '@/Components/Checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PaginateRes from '@/Components/PaginateRes';

import { FilterMenuCheckboxes } from '@/Components/filter-column';

import { motion, AnimatePresence } from "framer-motion"
import { Toaster } from '@/Components/ui/sonner';
import { toast } from 'sonner';
import ConfirmDeleteDialog from '@/Components/ConfirmDeleteDialog';
import AddClientDialog from './AddClientDialog';
import { CLIENT_STATUS_CLASS_MAP, CLIENT_STATUS_TEXT_MAP } from '@/constants';

const summaryCredentials = [

    { title: "Total ", value: "100", icon: ShieldPlus },
    { title: "Active ", value: "80", icon: ShieldCheck },
    { title: "Suspended ", value: "20", icon: ShieldAlert },

]

interface Clients {
    id?: number;
    name: string;
    description: string;
    created_at: string
    status: "Active" | "Inactive" | "Banned";
    created_by: string;
}

interface ClientsProps {
    clients_data: {
        data: Clients[];
        links: any;
        meta: any;
    };
    pagination: any;
    queryParams: any;
}


function Client({ clients_data, pagination, queryParams: initialQueryParams }: ClientsProps) {

    const clients = clients_data.data || [];
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);
    const [selectedEmployee, setSelectedEmployee] = React.useState<Clients | null>(null);
    const [selectedEmployeeID, setSelectedEmployeeID] = React.useState<number[]>([])
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedDelete, setSelectedDelete] = React.useState<Clients | null>(null);
    const [copiedField, setCopiedField] = useState<{ id: string; field: "username" | "password" } | null>(null);



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



    const handleCopy = async (
        text: string,
        id: string | number,
        field: "username" | "password"
    ) => {
        try {
            await navigator.clipboard.writeText(text);

            // Convert id to string consistently
            setCopiedField({ id: String(id), field });

            // Show a toast notification for successful copy
            toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} copied to clipboard!`);

            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            toast.error("Failed to copy to clipboard.");
        }
    };


    const handleConfirmDelete = () => {
        if (selectedDelete) {
            router.delete(route('client.delete', selectedDelete.id), {
                preserveScroll: true,
                onError: () => {
                    setDeleteDialogOpen(false);
                },
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setSelectedDelete(null);
                },
            });
        }
    };


    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedEmployee(null);
    };

    const handleDeleteClick = (client: Clients) => {
        setSelectedDelete(client);
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
        router.get(route("clientpanel.client"), {
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

            router.get(route("clientpanel.client"), { ...newQueryParams, ...filters }, {
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
        router.get(route("clientpanel.client"), { ...queryParams, ...filters }, {
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
                <AddClientDialog clients={undefined} onSuccess={() => router.reload()} />


            </div>
            <div className='px-8 py-4 grid gap-6 lg:grid-cols-4 sm:grid-cols-1' >
                {summaryCredentials.map((item) => (
                    <SummaryCard key={item.title} title={item.title} value={item.value} icon={item.icon} />
                ))}
            </div>

            <Card className="mx-8 my-4 lg:col-span-2 sm: col-span-1 ">
                <div className="p-4 ">
                    <h2 className="mb-4 font-semibold text-xl text-gray-800">Client List</h2>
                    {/* Search Input */}
                    <div className='flex justify-end space-x-6'>
                        <div className="relative ">
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
                    <div className="my-4 overflow-auto">
                        <Table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                            <TableHeader>
                                <TableRow className='text-md '>
                                    <TableHead >
                                        <Checkbox
                                        />
                                    </TableHead>
                                    <TableHead >Name</TableHead>
                                    <TableHead> <div className='flex justify-start items-center gap-2'>Platform</div></TableHead>
                                    <TableHead className='flex justify-start items-center gap-2'>Username</TableHead>
                                    <TableHead ><div className='flex justify-start items-center gap-2 text-nowrap'>Password</div></TableHead>
                                    <TableHead ><div className='flex justify-start items-center gap-2 text-nowrap'>Assigned</div></TableHead>
                                    <TableHead ><div className='flex justify-start items-center gap-2'>Available</div></TableHead>
                                    <TableHead ><div className='flex justify-center items-center gap-2'>Status</div ></TableHead>
                                    <TableHead ><div className='flex justify-center items-center gap-2'>Remarks</div ></TableHead>
                                    <TableHead ><div className='flex justify-center items-center gap-2'>Actions</div ></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody >
                                {clients.length > 0 ? (
                                    clients.map((clients: Clients) => (
                                        <TableRow
                                            key={clients.id}
                                            className='transition-all duration-100 text-md'>
                                            <TableCell >

                                            </TableCell>
                                            <TableCell className="font-medium text-nowrap">{clients.name}</TableCell>
                                            <TableCell>{clients.description}</TableCell>


                                            <TableCell>  <span className={"px-2 py-1 rounded-xl " + CLIENT_STATUS_CLASS_MAP[clients.status]}>
                                                {CLIENT_STATUS_TEXT_MAP[clients.status]}
                                            </span></TableCell>

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
                                                                onClick={() => handleDeleteClick(clients)}
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
                                            No Client Found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>


                        </Table>
                    </div>
                    <PaginateRes pagination={pagination} />
                </div>
            </Card >


            < ConfirmDeleteDialog
                open={deleteDialogOpen}
                title="Confirm Deletion"
                message={`Are you sure you want to delete "${selectedDelete?.name}" client?`
                }
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteDialogOpen(false)}
            />


        </Authenticated>
    )
}

export default Client

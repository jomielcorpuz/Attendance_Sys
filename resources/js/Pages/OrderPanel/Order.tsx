import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Input } from '@/components/ui/input';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import CreateOrderDialog from './CreateDialog';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Order {
    id: number;
    order_name: string;
    website_url: string;
    master_inbox_domain: string;
    registrar_name: string;
    created_at: string;
}

// Add clients to the OrderProps interface
interface OrderProps extends PageProps {
    order_data: {
        data: Order[];
        meta: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
            links: any[];
        };
    };
    clients: Array<{
        id: number;
        name: string;
        [key: string]: any;
    }>;
    filters: any;
    sort_field: string;
    sort_direction: string;
}

// Pass clients to CreateOrderDialog
<CreateOrderDialog clients={[]} />
export default function Order({ order_data, filters, sort_field, sort_direction }: OrderProps) {
    const orders = order_data.data || [];

    const ordersByStatus = {
        Filed: orders.filter((order: Order & { status?: string }) => order.status === 'Filed'),
        'In Progress': orders.filter((order: Order & { status?: string }) => order.status === 'In Progress'),
        Completed: orders.filter((order: Order & { status?: string }) => order.status === 'Completed')
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const { source, destination } = result;
        const orderId = result.draggableId;

        if (source.droppableId !== destination.droppableId) {
            // Update order status in the backend
            router.put(`/orders/${orderId}/status`, {
                status: destination.droppableId
            });
        }
    };

    return (
        <Authenticated>
            <Head title="Orders" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Orders</h2>
                                <CreateOrderDialog clients={[]} onSuccess={() => {}} />
                            </div>

                            <DragDropContext onDragEnd={handleDragEnd}>
                                <div className="grid grid-cols-3 gap-4">
                                    {Object.entries(ordersByStatus).map(([status, statusOrders]) => (
                                        <div key={status} className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-4">{status}</h3>
                                            <Droppable droppableId={status}>
                                                {(provided) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className="space-y-2"
                                                    >
                                                        {statusOrders.map((order, index) => (
                                                            <Draggable
                                                                key={order.id}
                                                                draggableId={String(order.id)}
                                                                index={index}
                                                            >
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className="bg-white p-4 rounded shadow"
                                                                    >
                                                                        <h4 className="font-medium">{order.order_name}</h4>
                                                                        <p className="text-sm text-gray-500">{order.website_url}</p>
                                                                        <div className="mt-2 text-sm">
                                                                            <span className="text-blue-600">{(order as Order & { priority?: string }).priority}</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div> 
                                                )}
                                            </Droppable>
                                        </div>
                                    ))}
                                </div>
                            </DragDropContext>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
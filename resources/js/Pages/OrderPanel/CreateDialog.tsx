import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/Components/ui/form";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

// Add client_id to the form schema
const formSchema = z.object({
    // Removed client_id: z.number().min(1, "Client is required"),
    order_name: z.string().min(1, "Order name is required"),
    description: z.string().optional(), // Added description
    // priority: z.enum(['Low', 'Medium', 'High']).optional(), // Reverted to enum
    google_sheet_url: z.string().optional(), // Added Google Sheet URL
    file_date: z.string().optional(), // Added File Date
    // Removed: website_url, master_inbox_domain, master_inbox_address, master_inbox_password, forward_to_website, registrar_name, registrar_username, registrar_password
    status: z.string().default('Filed')
});

function CreateOrderDialog({ clients, onSuccess }: { clients: { id: number; name: string; }[]; onSuccess?: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // Removed client_id: 0,
            order_name: '',
            description: '', // Added default value
            // priority: 'Low', // Added default value
            google_sheet_url: '', // Added default value
            file_date: '', // Added default value
            // Removed default values for removed fields
            status: 'Filed'
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setProcessing(true);
        
        try {
            router.post('/orders', data, {
                onError: (errors) => {
                    Object.keys(errors).forEach((field) => {
                        form.setError(field as keyof z.infer<typeof formSchema>, {
                            type: "manual",
                            message: errors[field],
                        });
                    });
                    setProcessing(false);
                },
                onSuccess: () => {
                    form.reset();
                    setIsOpen(false);
                    setProcessing(false);
                    if (onSuccess) onSuccess();
                },
            });
        } catch (err) {
            console.error("Error during submission:", err);
            setProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Order
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Create New Order</DialogTitle>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Removed client_id FormField */}
                        <FormField
                            control={form.control}
                            name="order_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Order Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter order name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Added Description Field */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Added Priority Field with Dropdown */}
                        {/* Removed Priority Field with Dropdown */}
                        {/*
                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Priority</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                                            value={field.value || ''} // Ensure value is controlled
                                        >
                                            <option value="" disabled>Select priority</option> // Added a disabled default option
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        */}
                        {/* Added Google Sheet URL Field */}
                        <FormField
                            control={form.control}
                            name="google_sheet_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Google Sheet URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Google Sheet URL" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Added File Date Field */}
                        <FormField
                            control={form.control}
                            name="file_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>File Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Removed unnecessary fields */}
                        <DialogFooter>
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Create Order
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateOrderDialog;
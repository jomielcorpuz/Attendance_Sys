import React, { useEffect } from 'react';

import { Loader2, Plus, SquarePen } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
    name: z.string().min(1, "Client name is required"),
    description: z.string().min(1, "Client description is required"),
    status: z.string().min(1, "Status description is required")
});

interface Client {
    id?: number;
    name: string;
    status: string;
    description: string;
}

function AddClientDialog({ clients, onSuccess }: { clients?: Client; onSuccess?: () => void }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            status: ''
        }
    });

    const { isDirty } = form.formState; // Track if form has been changed

    // Populate form if editing
    useEffect(() => {
        if (clients) {
            form.reset(clients);
        } else {
            form.reset({
                name: '',
                description: ''
            });
        }
    }, [clients, isOpen]);

    const onSubmit = (data: any) => {
        const url = clients ? `/clients/${clients.id}` : "/clients";
        const method = clients ? 'put' : 'post';

        setProcessing(true);
        router[method](url, data, {
            onError: (errors) => {
                Object.keys(errors).forEach((field) => {
                    form.setError(field as keyof z.infer<typeof formSchema>, { type: "manual", message: errors[field] });
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
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {clients ? (
                    <Button variant="outline"><SquarePen color='blue' /> Edit</Button>
                ) : (
                    <Button><Plus /> Add Client</Button>
                )}
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>{clients ? "Edit Worksheet" : "Add Worksheet"}</DialogTitle>
                <Separator />
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Client Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>

                                        <SelectItem value="Active" >Active</SelectItem>
                                        <SelectItem value="Inactive" >Inactive</SelectItem>
                                        <SelectItem value="Banned" >Banned</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Details</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Form>
                <DialogFooter className='w-full'>
                    <div className='w-full flex flex-col space-y-4'>
                        <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={!isDirty} className='disabled:bg-gray-400 '>

                            {processing ? (
                                <>
                                    <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                                    Saving...
                                </>
                            ) : clients ? ("Update") : ("Save")}
                        </Button>
                        <Button type="button" variant='outline' onClick={() => setIsOpen(false)}>Cancel</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AddClientDialog;

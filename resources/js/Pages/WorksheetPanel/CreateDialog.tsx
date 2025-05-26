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
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';

const formSchema = z.object({
    worksheet_name: z.string().min(1, "Worksheet name is required"),
    cloudflare_username: z.string().min(1, "Cloudflare is required"),
    googlepanel_username: z.string().min(1, "Google Admin Panel name is required"),
    no_of_domains: z.string().min(1, "Worksheet name is required"),
    no_of_users_per_domain: z.string().min(1, "Worksheet name is required"),
    total_users: z.string().min(1, "Worksheet name is required"),
    workspace: z.string().optional(),
    tag: z.string().min(1, "Worksheet name is required"),
    sheet_link: z.string().min(1, "Worksheet name is required"),
    timestamp_cdt: z.date(),
    details: z.string().optional(),
});

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
    timestamp_cdt: string;
    created_at: string
    details: string;
    created_by: string;
}

function CreateWorkSheetDialog({ worksheet, onSuccess }: { worksheet?: Worksheet; onSuccess?: () => void }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
        }
    });

    const { isDirty } = form.formState; // Track if form has been changed

    // Populate form if editing
    useEffect(() => {
        if (worksheet) {
            form.reset(worksheet);
        } else {
            form.reset({
                worksheet_name: '',
                details: ''
            });
        }
    }, [worksheet, isOpen]);

    const onSubmit = (data: any) => {
        const url = worksheet ? `/worksheet/${worksheet.id}` : "/worksheet";
        const method = worksheet ? 'put' : 'post';

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
                {worksheet ? (
                    <Button variant="outline"><SquarePen color='blue' /> Edit</Button>
                ) : (
                    <Button><Plus /> Add Worksheet</Button>
                )}
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>{worksheet ? "Edit Worksheet" : "Add Worksheet"}</DialogTitle>
                <Separator />
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="worksheet_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Worksheet Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
                        <div className='col-span-2'>

                        </div>


                        <FormField
                            control={form.control}
                            name="cloudflare_username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cloudflare </FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="googlepanel_username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Google Admin Panel</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='no_of_domains'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No. of Domains</FormLabel>
                                    <FormControl>
                                        <Input type='number' placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="no_of_users_per_domain"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No. of Users</FormLabel>
                                    <FormControl>
                                        <Input type='number' placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tag"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tag</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="workspace"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Workspace</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="sheet_link"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Google Sheet</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="details"
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
                            ) : worksheet ? ("Update") : ("Save")}
                        </Button>
                        <Button type="button" variant='outline' onClick={() => setIsOpen(false)}>Cancel</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CreateWorkSheetDialog;

import React, { useEffect, useState } from 'react';

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
import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddClientCredDialog from './AddClientCredDialog';


const formSchema = z.object({
    name: z.string().min(1, "Credential name is required"),
    client_id: z.coerce.number().nullable().optional(),
    client_name: z.string().nullable().optional(),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    available: z.coerce.number().min(1, "Available slots is required"),
    assigned: z.coerce.number().optional(),
    status: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    remarks: z.string().optional(),
    description: z.string().optional(),
    organization_name: z.string().optional(),
    platform: z.string().optional(),
    label: z.string().optional(),
}).superRefine((data, ctx) => {
    if (
        ["Edu Panel", "Google Admin Panel"].includes(data.category) &&
        (!data.client_id || data.client_id <= 0)
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["client_id"],
            message: "Client is required for this category.",
        });
    }
});

interface Credential {
    id?: number;
    name: string;
    client_id: number;
    client_name?: string; // ✅ for UI display only
    username: string;
    password: string;
    assigned: number;
    available: number;
    status: "Active" | "Inactive" | "Updated" | "Suspended";
    category: string;
    remarks: string;
    description: string;
    organization_name: string;
    label: string;
    platform: string;
    created_at: string;
    created_by: string;
}

function AddCredentialsDialog({ credentials, onSuccess }: { credentials?: Credential; onSuccess?: () => void }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);
    const [showPlatform, setShowPlatform] = React.useState(false);
    const [showClientField, setShowClientField] = React.useState(false);





    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            client_id: undefined,
            client_name: "",
            username: "",
            password: "",
            assigned: 0,
            available: 0,
            status: "",
            category: "",
            remarks: "",
            description: "",
            organization_name: "",
            label: "",
            platform: "",
        }
    });

    const assignedDomains = form.watch("assigned");
    const slotsAvailable = form.watch("available");



    const { isDirty } = form.formState; // Track if form has been changed

    // Populate form if editing
    useEffect(() => {
        if (credentials) {
            form.reset({
                name: credentials.name ?? '',
                username: credentials.username ?? '',
                password: credentials.password ?? '',
                assigned: credentials.assigned ?? 0,
                available: credentials.available ?? 0,
                category: credentials.category ?? '',
                remarks: credentials.remarks ?? '',
                status: credentials.status ?? '',
                description: credentials.description ?? '',
                organization_name: credentials.organization_name ?? '',
                label: credentials.label ?? '',
                platform: credentials.platform ?? '',
                client_id: credentials.client_id ?? undefined,
                client_name: credentials.client_name ?? '',
            });
        } else {
            form.reset({
                name: '',
                username: '',
                password: '',
                assigned: 0,
                available: 0,
                category: '',
                remarks: '',
                status: '',
                description: '',
                organization_name: '',
                label: '',
                platform: '',
                client_id: undefined,
                client_name: '',
            });
        }
    }, [credentials, isOpen]);


    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setProcessing(true);
        console.log("📝 Submitting Credential Data:", data);

        try {
            // You can compute or format data here, like:
            // const formattedDate = format(new Date(data.date), "yyyy-MM-dd");


            const finalData = {
                ...data,
                client_id:
                    data.category === "Edu Panel" || data.category === "Google Admin Panel"
                        ? data.client_id
                        : null,
                client_name:
                    data.category === "Edu Panel" || data.category === "Google Admin Panel"
                        ? data.client_name
                        : "",
            };


            console.log("📦 Final Data to Send:", finalData);

            const url = credentials ? `/credentials/${credentials.id}` : "/credentials";
            const method = credentials ? 'put' : 'post';

            router[method](url, finalData, {
                onError: (errors) => {
                    console.error("❌ Submission Errors:", errors);
                    Object.keys(errors).forEach((field) => {
                        form.setError(field as keyof z.infer<typeof formSchema>, {
                            type: "manual",
                            message: errors[field],
                        });
                    });
                    setProcessing(false);
                },
                onSuccess: () => {
                    console.log("✅ Credential submission successful!");
                    form.reset();
                    handleCloseDialog?.(); // Closes dialog and resets
                    setProcessing(false);
                    if (onSuccess) onSuccess(); // Optional callback
                },
            });

        } catch (err) {
            console.error("❗ Unexpected error during submission:", err);
            setProcessing(false);
        }
    };

    const handleCloseDialog = () => {
        form.reset();
        setIsOpen(false);
        setShowPlatform(false);
        setShowClientField(false);
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {credentials ? (
                    <Button variant="outline"><SquarePen color='blue' /> Edit</Button>
                ) : (
                    <Button><Plus /> Add Credential</Button>
                )}
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>{credentials ? "Edit Credential" : "Add Credential"}</DialogTitle>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Credential Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            // Always set the category
                                            form.setValue("category", value);

                                            // Show/hide client field
                                            setShowClientField(value === "Google Admin Panel" || value === "Edu Panel");

                                            // Show manual input for platform only if "Logins"
                                            setShowPlatform(value === "Logins");

                                            // Set platform only when category is not "Logins"
                                            if (value === "Logins") {
                                                form.setValue("platform", "");
                                            } else {
                                                form.setValue("platform", value);
                                            }

                                            // Clear errors
                                            form.clearErrors("category");
                                            form.clearErrors("platform");
                                        }}
                                        defaultValue={form.getValues("platform")}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Cloudflare">Cloudflare</SelectItem>
                                            <SelectItem value="Google Admin Panel">Google Admin Panel</SelectItem>
                                            <SelectItem value="Edu Panel">Edu Panel</SelectItem>
                                            <SelectItem value="Logins">Logins</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />

                                    {/* Input for Platform */}
                                    {showPlatform && (
                                        <FormItem>
                                            <FormLabel>Platform</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Instanty / Bison / Namecheap"
                                                    value={form.getValues("platform")}
                                                    onChange={(e) => form.setValue("platform", e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}

                                    {showClientField && (
                                        <FormItem>
                                            <FormLabel>Client</FormLabel>
                                            <div className="flex items-center gap-2">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Selected client"
                                                        value={form.getValues("client_name") || ""}
                                                        onChange={() => { }} // Optional: disable direct input
                                                        readOnly
                                                    />
                                                </FormControl>
                                                <AddClientCredDialog
                                                    onSelectClient={(client) => {
                                                        form.setValue("client_id", client.id);
                                                        form.setValue("client_name", client.name);
                                                    }}
                                                />
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}

                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>




                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="assigned"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assigned</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="available"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Available</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="" {...field} />
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
                                                <SelectItem value="Suspended" >Suspended</SelectItem>
                                                <SelectItem value="Dead" >Dead</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                        </div>



                        <FormField
                            control={form.control}
                            name="remarks"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Remarks</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Remarks about the credential."
                                            className="resize-none overflow-hidden "
                                            style={{ height: "auto" }}
                                            onInput={(e) => {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = "auto"; // Reset height
                                                target.style.height = `${target.scrollHeight}px`; // Adjust height dynamically
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <DialogFooter className="gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseDialog} // Custom function to close + reset
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                onClick={form.handleSubmit(onSubmit)}
                                className="px-6"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : credentials ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>




            </DialogContent>
        </Dialog>
    );
}

export default AddCredentialsDialog;

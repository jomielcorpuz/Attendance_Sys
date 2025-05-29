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


const formSchema = z.object({
    worksheet_name: z.string().min(1, "Credential name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    available: z.coerce.number().min(1, "Available slots is required"),
    assigned: z.coerce.number().optional();
    status: z.string().optional(),
    category: z.string().optional(),
    remarks: z.string().optional(),
    description: z.string().optional(),
    organization_name: z.string().optional(),
    label: z.string().min(1, "Tag is required"),
});


interface Credential {
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
    created_by: string;
}

function AddCredentialsDialog({ credentials, onSuccess }: { credentials?: Credential; onSuccess?: () => void }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);

    const [cdtTime, setCdtTime] = useState(() =>
        format(toZonedTime(new Date(), "America/Chicago"), "EEE, MMM dd yyyy hh:mm:ss aaaa zzz")
    );
    const cdtNow = toZonedTime(new Date(), "America/Chicago");
    const formattedCDT = format(cdtNow, "yyyy-MM-dd hh:mm:ss aaaa zzz");


    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const chicagoTime = toZonedTime(now, "America/Chicago");
            const formatted = format(chicagoTime, "EEE, MMM dd yyyy hh:mm:ss aaaa ");
            setCdtTime(formatted);
        }, 1000);

        return () => clearInterval(interval); // Cleanup when component unmounts or dialog closes
    }, []);

    useEffect(() => {
        const now = new Date();
        const chicagoTime = toZonedTime(now, "America/Chicago");
        form.setValue("timestamp_cdt", chicagoTime);
    }, []);


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
        }
    });

    const noOfDomains = form.watch("no_of_domains");
    const noOfUsersPerDomain = form.watch("no_of_users_per_domain");

    useEffect(() => {
        if (
            typeof noOfDomains === "number" &&
            typeof noOfUsersPerDomain === "number" &&
            noOfDomains > 0 &&
            noOfUsersPerDomain > 0
        ) {
            const total = noOfDomains * noOfUsersPerDomain;
            form.setValue("total_users", total, { shouldValidate: true });
        }
    }, [noOfDomains, noOfUsersPerDomain]);


    const { isDirty } = form.formState; // Track if form has been changed

    // Populate form if editing
    useEffect(() => {
        if (credentials) {
            form.reset({
                worksheet_name: credentials.worksheet_name ?? '',
                cloudflare_username: credentials.cloudflare_username ?? '',
                googlepanel_username: credentials.googlepanel_username ?? '',
                no_of_domains: credentials.no_of_domains ?? 0,
                no_of_users_per_domain: credentials.no_of_users_per_domain ?? 0,
                total_users: credentials.total_users ?? 0,
                workspace: credentials.workspace ?? '',
                tag: credentials.tag ?? '',
                sheet_link: credentials.sheet_link ?? '',
                timestamp_cdt: credentials.timestamp_cdt ? new Date(credentials.timestamp_cdt) : new Date(),
                // details: credentials.details ?? ''
            });
        } else {
            form.reset({
                worksheet_name: '',
                cloudflare_username: '',
                googlepanel_username: '',
                no_of_domains: 0,
                no_of_users_per_domain: 0,
                total_users: 0,
                workspace: '',
                tag: '',
                sheet_link: '',
                timestamp_cdt: new Date(),
                //details: ''
            });
        }
    }, [credentials, isOpen]);


    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setProcessing(true);
        console.log("📝 Submitting Credential Data:", data);

        try {
            // You can compute or format data here, like:
            // const formattedDate = format(new Date(data.date), "yyyy-MM-dd");

            // Step 1: Get Chicago time as a Date
            const chicagoDate = toZonedTime(new Date(), "America/Chicago");

            // Step 2: Set raw Date in form (because Zod expects Date)
            form.setValue("timestamp_cdt", chicagoDate);

            // Step 3: Format it for submission (MySQL-compatible)
            const formattedCDT = format(chicagoDate, "yyyy-MM-dd HH:mm:ss");

            const finalData = {
                ...data,
                timestamp_cdt: formattedCDT,
                // Additional formatting or computed fields can be set here
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
                            name="worksheet_name"
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
                                        <FormLabel>Users per Domain</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="total_users"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Users</FormLabel>
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

                            {/* DATE */}
                            <FormItem>
                                <FormLabel>Current Time (CDT)</FormLabel>
                                <FormControl>
                                    <Input value={cdtTime} readOnly className="bg-muted cursor-not-allowed" />
                                </FormControl>
                            </FormItem>
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

                        {/* <FormField
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
                        /> */}
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

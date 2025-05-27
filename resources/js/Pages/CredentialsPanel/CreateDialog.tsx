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
    purok_name: z.string().min(1, "Purok name is required"),
    details: z.string().min(1, "Purok description is required")
});

interface Purok {
    id?: number;
    purok_name: string;
    details: string;
}

function AddCredentialsDialog({ purok, onSuccess }: { purok?: Purok; onSuccess?: () => void }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            purok_name: '',
            details: ''
        }
    });

    const { isDirty } = form.formState; // Track if form has been changed

    // Populate form if editing
    useEffect(() => {
        if (purok) {
            form.reset(purok);
        } else {
            form.reset({
                purok_name: '',
                details: ''
            });
        }
    }, [purok, isOpen]);

    const onSubmit = (data: any) => {
        const url = purok ? `/purok/${purok.id}` : "/purok";
        const method = purok ? 'put' : 'post';

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
                {purok ? (
                    <Button variant="outline"><SquarePen color='blue' /> Edit</Button>
                ) : (
                    <Button><Plus /> Add Worksheet</Button>
                )}
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>{purok ? "Edit Worksheet" : "Add Worksheet"}</DialogTitle>
                <Separator />
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="purok_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Purok Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Name" {...field} />
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
                            ) : purok ? ("Update") : ("Save")}
                        </Button>
                        <Button type="button" variant='outline' onClick={() => setIsOpen(false)}>Cancel</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AddCredentialsDialog;

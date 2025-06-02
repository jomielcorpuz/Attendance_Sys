import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, UserRoundPlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/Components/ui/command';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface AddClientDialogProps {
    onSelectClient: (client: Client) => void;
}

interface Client {
    id: number;
    name: string;
    email?: string;
    company?: string;
}

export default function AddClientCredDialog({ onSelectClient }: AddClientDialogProps) {
    const [clients, setClients] = useState<Client[]>([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');

    useEffect(() => {
        axios.get('/api/clients')
            .then((res) => {
                if (Array.isArray(res.data.data)) {
                    setClients(res.data.data);
                }
            })
            .catch(() => setClients([]));
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline">
                    <UserRoundPlus className="mr-1" /> Select Client
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Select a Client</DialogTitle>
                <Separator />
                <Command>
                    <CommandInput placeholder="Search client..." />
                    <CommandList>
                        <CommandEmpty>No client found.</CommandEmpty>
                        <CommandGroup>
                            {clients.map((client) => (
                                <CommandItem
                                    key={client.id}
                                    value={client.name}
                                    onSelect={() => {
                                        setValue(client.name);
                                        onSelectClient(client);
                                        setOpen(false);
                                    }}
                                >
                                    {client.name}
                                    <Check className={cn('ml-auto', value === client.name ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
}

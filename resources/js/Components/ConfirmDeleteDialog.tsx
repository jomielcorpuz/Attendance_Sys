import { Dialog, DialogTitle, DialogContent, DialogOverlay, DialogPortal, DialogHeader, DialogDescription, DialogFooter, } from '@/Components/ui/dialog';

import { CircleAlert, Trash, Trash2, CheckCircle } from 'lucide-react';
import { ReactNode } from 'react';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from './ui/button';

interface ConfirmDeleteDialogProps {
    open: boolean;
    title: string;
    message: ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDeleteDialog({ open, title, message, onConfirm, onCancel }: ConfirmDeleteDialogProps) {
    const [confirmed, setConfirmed] = useState(false);

    const handleConfirm = () => {
        setConfirmed(true);
        onConfirm();

        setTimeout(() => {
            setConfirmed(false);
            onCancel(); // Close the dialog after animation
        }, 1500); // Adjust duration to match your animation
    };

    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent className="text-center">
                <DialogHeader className="flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                        {!confirmed ? (
                            <motion.div
                                key="trash"
                                initial={{ opacity: 0, rotate: -15 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Trash2 color="red" size={80} className="my-6 bg-red-100 rounded-full p-4" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="check"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <CheckCircle color="green" size={80} className="my-6 bg-green-100 rounded-full p-4" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <DialogTitle className="text-lg">
                        {confirmed ? "Deleted Successfully!" : title}
                    </DialogTitle>
                </DialogHeader>

                <div className="my-4 text-gray-600 min-h-[3rem] text-sm text-muted-foreground">
                    <AnimatePresence mode="wait">
                        {!confirmed ? (
                            <motion.div
                                key="message"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {message}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="deleted"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-green-600"
                            >
                                The item has been deleted successfully.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {!confirmed && (
                    <DialogFooter className="w-full flex justify-between items-center gap-4">
                        <Button variant="outline" onClick={onCancel} className="w-full px-6">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirm} className="w-full px-6">
                            Yes, Delete it!
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ConfirmDeleteDialog;

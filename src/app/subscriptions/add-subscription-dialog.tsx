// src/app/subscriptions/add-subscription-dialog.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddSubscriptionForm from "./add-subscription-form";

type Props = {
  onSaved?: () => void;
};

export function AddSubscriptionDialog({ onSaved }: Props) {
  const [open, setOpen] = React.useState(false);

  const handleSaved = () => {
    setOpen(false);
    onSaved?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="inline-flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Enter the details for your new subscription. All fields are required and validated.
          </DialogDescription>
        </DialogHeader>
        <AddSubscriptionForm onSaved={handleSaved} />
      </DialogContent>
    </Dialog>
  );
} 
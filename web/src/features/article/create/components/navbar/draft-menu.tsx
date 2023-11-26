'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDraft } from '@/hooks';
import { LucideArchive } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export const DraftMenu = () => {
  const { draft } = useDraft();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDraft = (id: string) => {
    router.push('?draftId=' + id);
    setOpen(false);
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size={'sm'} variant={'dark'}>
            <LucideArchive className="mr-2 h-4 w-4" />
            <span>Draft</span>
          </Button>
        </DialogTrigger>
        <DialogOverlay className="bg-black/20 z-50" />
        <DialogContent className="p-0 h-screen w-full sm:h-96 sm:max-w-lg overflow-hidden">
          <Command>
            <CommandInput placeholder="Find your draft" className="pr-8" />
            <CommandList className="max-h-full">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Draft">
                {draft.map((item) => (
                  <CommandItem
                    key={item.id}
                    className="text-md flex text-start"
                  >
                    <span
                      onClick={() => handleDraft(item.id)}
                      className="w-full cursor-pointer truncate"
                    >
                      {item.title}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
};
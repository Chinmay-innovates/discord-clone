'use client'

import axios from "axios"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"


import { useModal } from "@/hooks/use-modal-store"
import { useOrigin } from "@/hooks/use-origin"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Check, Copy, RefreshCw } from "lucide-react"
import { useState } from "react"

export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite";
    const { server } = data;

    const [iscopied, setIscopied] = useState(false);
    const [isLoading, setIsloading] = useState(false);


    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setIscopied(true);
        setTimeout(() => {
            setIscopied(false);
        }, 1000);
    }
    const onNew = async () => {
        try {
            setIsloading(true);
            const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);
            onOpen("invite", { server: res.data });
        } catch (err) {
            console.log(err)
        } finally {
            setIsloading(false);
        }
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>

                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server invite link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteUrl}

                        />
                        <Button
                            disabled={isLoading}
                            size='icon' onClick={onCopy}>
                            {iscopied ?
                                <Check className="size-4" />
                                : <Copy className="size-4" />}
                        </Button>
                    </div>
                    <Button
                        disabled={isLoading}
                        onClick={onNew}
                        size='sm'
                        variant='link'
                        className="text-xs text-zinc-500 mt-4"
                    >
                        Generate a new link
                        <RefreshCw className="size-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
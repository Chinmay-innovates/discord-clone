'use client'

import axios from "axios";
import qs from "query-string"
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ShieldCheck,
    ShieldAlert,
    MoreVertical,
    ShieldQuestion,
    Shield,
    Check,
    Gavel,
    Loader2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import { MemberRole } from "@prisma/client";
import { useModal } from "@/hooks/use-modal-store"
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";




const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="size-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="size-4 ml-2 text-rose-500" />,
}
export const MembersModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const router = useRouter()
    const [loadingId, setLoadingId] = useState("");

    const isModalOpen = isOpen && type === "members";
    const { server } = data as { server: ServerWithMembersWithProfiles };


    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                }
            });

            const response = await axios.delete(url);
            router.refresh();
            onOpen("members", { server: response.data });
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingId("");
        }
    }

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                }
            });

            const response = await axios.patch(url, { role });
            router.refresh();
            onOpen("members", { server: response.data });

        } catch (error) {
            console.log(error)
        } finally {
            setLoadingId("");
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                        <DialogDescription className="text-center text-zinc-500 ">
                            {server?.members?.length} Members
                        </DialogDescription>
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map((member) => (
                        <div key={member.id}
                            className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1 gap-x-1">
                                <div className="text-xs font-semibold flex items-center">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !== member.profileId && loadingId !== member.id && (

                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="size-4 text-zinc-500" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger
                                                    className="flex items-center"
                                                >
                                                    <ShieldQuestion className="size-4 mr-2" />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal >
                                                    <DropdownMenuSubContent >
                                                        <DropdownMenuItem
                                                            onClick={() => onRoleChange(member.id, "GUEST")}
                                                        >
                                                            <Shield className="size-4 mr-2" />
                                                            Guest
                                                            {member.role === "GUEST" && (
                                                                <Check className="size-4 ml-auto" />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => onRoleChange(member.id, "MODERATOR")}
                                                        >
                                                            <ShieldCheck className="size-4 mr-2" />
                                                            Moderator
                                                            {member.role === "MODERATOR" && (
                                                                <Check className="size-4 ml-auto" />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => onKick(member.id)}
                                            >
                                                <Gavel className="size-4 mr-2" />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className="animate-spin size-4 text-zinc-500 ml-auto" />
                            )}
                        </div>
                    ))}
                </ScrollArea>

            </DialogContent>
        </Dialog>
    )
}


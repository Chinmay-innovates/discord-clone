'use client'

import { ChannelType, MemberRole } from "@prisma/client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings2 } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({
    label,
    sectionType,
    channelType,
    role,
    server
}: ServerSectionProps) => {
    const { onOpen } = useModal()

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold   
            text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition
            ">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === "channels" && (
                <ActionTooltip
                    label="Create Channel"
                    side="top">
                    <button
                        onClick={() => onOpen('createChannel', { channelType })}
                        className="
                    group-hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition
                    " >
                        <Plus className="size-4" />
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip label="Manage Members" side="top">
                    <button
                        onClick={() => onOpen('members', { server })}
                        className="
                    group-hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition
                    " >
                        <Settings2 className="size-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>

    );
};

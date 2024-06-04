'use client'

import { Member } from "@prisma/client";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member;
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member | undefined;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>
}

export const ChatItem = ({
    content,
    currentMember,
    deleted,
    fileUrl,
    id,
    isUpdated,
    member,
    socketUrl,
    timestamp
}: ChatItemProps) => {

    return (
        <div>ChatItem</div>
    );
};
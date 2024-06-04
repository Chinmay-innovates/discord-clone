'use client'

import { Member, MemberRole, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { UseChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";
import { ChatItem } from "./chat-item";
import { format } from "date-fns";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MES_W_MEM_W_PRO = Message & {
    member: Member & {
        profile: Profile
    }
}

interface ChatMessagesProps {
    name: string;
    member: Member | undefined;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    paramValue: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    type: "channel" | "conversation";
}

export const ChatMessages = ({
    apiUrl,
    chatId,
    member,
    name,
    paramKey,
    paramValue,
    socketQuery,
    socketUrl,
    type,
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = UseChatQuery({
        apiUrl,
        paramKey,
        paramValue,
        queryKey
    })
    // if (status === "loading") {
    //     return (
    //         <div className="flex flex-col flex-1 justify-center items-center">
    //             <Loader2 className="size-7 text-zinc-500 animate-spin my-4" />
    //             <p className="text-xs text-zinc-500 dark:text-zinc-400">
    //                 Loading messages...</p>
    //         </div>
    //     )
    // }
    // if (status === "error") {
    //     return (
    //         <div className="flex flex-col flex-1 justify-center items-center">
    //             <ServerCrash className="size-7 text-zinc-500 my-4" />
    //             <p className="text-xs text-zinc-500 dark:text-zinc-400">
    //                 Something went wrong!</p>
    //         </div>
    //     )
    // }
    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto ">
            <div className="flex-1" />
            <ChatWelcome
                type={type}
                name={name}
            />
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MES_W_MEM_W_PRO) => (
                            <ChatItem
                                key={message.id}
                                id={message.id}
                                member={message.member}
                                currentMember={member}
                                content={message.content}
                                deleted={message.deleted}
                                isUpdated={message.updatedAt !== message.createdAt}
                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                fileUrl={message.fileUrl}
                                socketQuery={socketQuery}
                                socketUrl={socketUrl}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};
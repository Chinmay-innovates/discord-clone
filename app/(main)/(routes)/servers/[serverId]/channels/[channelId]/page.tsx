import { RedirectToSignIn } from "@clerk/nextjs";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Member } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  },
  member_props?: Member
}

const ChannelIdPage = async ({
  params,
  member_props
}: ChannelIdPageProps) => {
  const profile = await currentProfile();

  if (!profile)
    return RedirectToSignIn

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId
    }
  })
  const member = await db.channel.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    }
  });

  if (!channel || !member) return redirect('/');



  return (
    <div
      className="bg-white dark:bg-[#313338] flex flex-col h-full"
    >
      <ChatHeader
        name={channel?.name}
        serverId={channel?.serverId}
        type="channel"
      />
      <ChatMessages
        member={member_props}
        name={channel.name}
        chatId={channel.id}
        type="channel"
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
        paramKey="channelId"
        paramValue={channel.id}
        key={channel.id}
        
      />
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
      />
    </div>
  )
}

export default ChannelIdPage
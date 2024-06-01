import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
  src?: string;
  className?: string;
}

export const UserAvatar = ({
className,
src
}: UserAvatarProps) => {

  return (
    <Avatar className={cn(
      "size-7 md:size-10",
      className
    )}>
      <AvatarImage src={src} />
    </Avatar>

  );
};
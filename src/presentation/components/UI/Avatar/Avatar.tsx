"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cn } from "@/utils";

type AvatarRootProps = React.ComponentProps<typeof AvatarPrimitive.Root>;
type AvatarImageProps = React.ComponentProps<typeof AvatarPrimitive.Image>;
type AvatarFallbackProps = React.ComponentProps<
  typeof AvatarPrimitive.Fallback
>;

type AvatarComponent = React.FC<AvatarRootProps> & {
  Image: React.FC<AvatarImageProps>;
  Fallback: React.FC<AvatarFallbackProps>;
};

const Avatar: AvatarComponent = ({ className, ...props }) => {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
};

Avatar.displayName = "Avatar";

const AvatarImage: React.FC<AvatarImageProps> = ({ className, ...props }) => {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
};
AvatarImage.displayName = "Avatar.Image";

const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  className,
  ...props
}) => {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
};
AvatarFallback.displayName = "Avatar.Fallback";

Avatar.Image = AvatarImage;
Avatar.Fallback = AvatarFallback;

export { Avatar };

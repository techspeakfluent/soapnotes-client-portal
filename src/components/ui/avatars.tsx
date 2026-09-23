import { Avatar, Center, Image, type AvatarRootProps } from "@chakra-ui/react";
import type { IPortalOrganization } from "@/shared/interface/portal";

interface PersonAvatarProps extends AvatarRootProps {
  name: string;
  src?: string | null;
}

export function PersonAvatar({ name, src, ...rest }: PersonAvatarProps) {
  return (
    <Avatar.Root size="sm" bg="primary.50" color="primary.400" {...rest}>
      {src ? <Avatar.Image src={src} alt="" /> : null}
      <Avatar.Fallback name={name} />
    </Avatar.Root>
  );
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter((word) => /^[A-Za-z0-9]/.test(word))
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join("");

export function PracticeLogo({
  organization,
}: {
  organization: IPortalOrganization;
}) {
  if (organization.logo_url) {
    return (
      <Image
        src={organization.logo_url}
        alt={organization.name}
        maxH="2.25rem"
        maxW="8rem"
        objectFit="contain"
      />
    );
  }
  return (
    <Center
      boxSize="2.25rem"
      borderRadius="0.5rem"
      bg="primary.300"
      color="white"
      textStyle="small-bold"
      flexShrink={0}
      aria-hidden
    >
      {initialsOf(organization.name)}
    </Center>
  );
}

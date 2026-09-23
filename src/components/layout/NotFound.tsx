import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@/components/icons";
import { EmptyState, SectionCard } from "@/components/ui";
import { RouteConstants } from "@/shared/constants/routes";

export function NotFound() {
  return (
    <SectionCard>
      <EmptyState
        icon={MagnifyingGlassIcon}
        title="We couldn't find that page"
        description="The link may be out of date. Your dashboard has everything in one place."
        action={
          <Button asChild variant="primary" mt="0.5rem">
            <Link to={RouteConstants.dashboard.home.path}>Go to dashboard</Link>
          </Button>
        }
        py="3rem"
      />
    </SectionCard>
  );
}

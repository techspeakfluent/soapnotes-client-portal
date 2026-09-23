import type { IPortalClient } from "@/shared/interface/portal";

const organization: IPortalClient["organization"] = {
  id: "org-northshore",
  name: "Northshore Speech & Language Therapy Collective",
  slug: "northshore-slt",
  logo_url: "",
  currency_code: "CAD",
};

/** Long names and addresses on purpose — they're what break layouts. */
export const clientWithHistory: IPortalClient = {
  id: "client-1001",
  first_name: "Alexandra",
  middle_name: null,
  last_name: "Montgomery-Beauchamp",
  display_name: "Alexandra Montgomery-Beauchamp",
  email: null,
  phone: "+1 (604) 555-0182",
  address: "2210 Marine Drive, Unit 1804",
  city: "North Vancouver",
  state: "British Columbia",
  country: "Canada",
  postal_code: "V7P 1V9",
  dob: "1987-04-12T00:00:00.000Z",
  organization_id: organization.id,
  client_emails: [
    {
      id: "email-1",
      email: "alexandra.montgomery-beauchamp@northshore-family-services.ca",
      is_primary_email: true,
    },
    {
      id: "email-2",
      email: "alex.mb@gmail.com",
      is_primary_email: false,
    },
  ],
  organization,
};

export const newClient: IPortalClient = {
  id: "client-2002",
  first_name: "Sam",
  middle_name: null,
  last_name: "Okafor",
  display_name: "Sam Okafor",
  email: null,
  phone: null,
  address: null,
  city: null,
  state: null,
  country: null,
  postal_code: null,
  dob: null,
  organization_id: organization.id,
  client_emails: [
    { id: "email-3", email: "sam.okafor@example.com", is_primary_email: true },
  ],
  organization,
};

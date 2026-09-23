import { pdf } from "@react-pdf/renderer";
import { createElement } from "react";
import { InvoiceDocument } from "./InvoiceDocument";

type InvoiceDocumentProps = Parameters<typeof InvoiceDocument>[0];

// Imported on demand: react-pdf is large and only needed for a download.
export async function renderInvoicePdf(props: InvoiceDocumentProps) {
  // react-pdf types its input as its own Document element.
  return pdf(createElement(InvoiceDocument, props) as never).toBlob();
}

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { IPortalInvoiceDetail } from "@/shared/interface/portal";
import { colors } from "@/theme/tokens/colors";
import { formatDate } from "@/utils/format-date";
import { formatMoney } from "@/utils/format-money";
import { getInvoiceDisplayStatus } from "@/utils/invoice";
import { getStatusLabel } from "@/utils/status";
import { PAYMENT_METHOD_LABELS } from "../../constants";

// react-pdf renders outside Chakra, so it reads the raw token values.
const INK = colors.gray[500].value;
const MUTED = colors.gray[300].value;
const RULE = colors.gray[75].value;
const SAGE = colors.primary[300].value;

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: INK, fontFamily: "Helvetica" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  practice: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: SAGE,
    maxWidth: 280,
  },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", textAlign: "right" },
  muted: { color: MUTED },
  row: { flexDirection: "row", justifyContent: "space-between" },
  section: { marginBottom: 20 },
  label: {
    color: MUTED,
    fontSize: 8,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: RULE,
    paddingBottom: 6,
    marginBottom: 6,
    color: MUTED,
    fontSize: 8,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: RULE,
  },
  item: { flex: 1, paddingRight: 8 },
  qty: { width: 40, textAlign: "right" },
  amount: { width: 90, textAlign: "right" },
  totals: { marginLeft: "auto", width: 220, marginTop: 12 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  grand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    borderTopWidth: 1,
    borderColor: INK,
    paddingTop: 6,
    marginTop: 3,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: MUTED,
    fontSize: 8,
  },
});

interface InvoiceDocumentProps {
  invoice: IPortalInvoiceDetail;
  practiceName: string;
  clientName: string;
  clientEmail: string;
}

export function InvoiceDocument({
  invoice,
  practiceName,
  clientName,
  clientEmail,
}: InvoiceDocumentProps) {
  const money = (value?: number | null) =>
    formatMoney(value ?? 0, invoice.currency_code);
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = Number(invoice.tax_value ?? 0);
  const isPaid = Number(invoice.amount_due ?? 0) <= 0;

  return (
    <Document
      title={`${isPaid ? "Receipt" : "Invoice"} ${invoice.invoice_number}`}
      author={practiceName}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.practice}>{practiceName}</Text>
          <View>
            <Text style={styles.title}>{isPaid ? "Receipt" : "Invoice"}</Text>
            <Text style={[styles.muted, { textAlign: "right" }]}>
              No. {invoice.invoice_number}
            </Text>
          </View>
        </View>

        <View style={[styles.row, styles.section]}>
          <View>
            <Text style={styles.label}>Billed to</Text>
            <Text>{clientName}</Text>
            <Text style={styles.muted}>{clientEmail}</Text>
          </View>
          <View>
            <Text style={styles.label}>Issued</Text>
            <Text>{formatDate(invoice.invoice_date)}</Text>
            <Text style={[styles.label, { marginTop: 6 }]}>Due</Text>
            <Text>{formatDate(invoice.due_date)}</Text>
          </View>
          <View>
            <Text style={styles.label}>Status</Text>
            <Text>{getStatusLabel(getInvoiceDisplayStatus(invoice))}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.tableHead}>
            <Text style={styles.item}>Item</Text>
            <Text style={styles.qty}>Qty</Text>
            <Text style={styles.amount}>Price</Text>
            <Text style={styles.amount}>Amount</Text>
          </View>
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow} wrap={false}>
              <Text style={styles.item}>{item.product_name}</Text>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Text style={styles.amount}>{money(item.price)}</Text>
              <Text style={styles.amount}>
                {money(item.price * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.muted}>Subtotal</Text>
              <Text>{money(subtotal)}</Text>
            </View>
            {tax > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.muted}>Tax</Text>
                <Text>{money(tax)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.muted}>Total</Text>
              <Text>{money(invoice.total_price)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.muted}>Paid</Text>
              <Text>{money(invoice.amount_paid)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grand]}>
              <Text>Amount due</Text>
              <Text>{money(invoice.amount_due)}</Text>
            </View>
          </View>
        </View>

        {invoice.payments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Payments</Text>
            {invoice.payments.map((payment) => (
              <View key={payment.id} style={styles.tableRow}>
                <Text style={styles.item}>
                  {formatDate(payment.transaction_date)} ·{" "}
                  {payment.transaction_type === "REFUND"
                    ? "Refund"
                    : (PAYMENT_METHOD_LABELS[payment.payment_method] ??
                      "Payment")}
                </Text>
                <Text style={styles.amount}>
                  {money(payment.allocated_amount)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {invoice.memo && (
          <View style={styles.section}>
            <Text style={styles.label}>Notes</Text>
            <Text>{invoice.memo}</Text>
          </View>
        )}

        <Text style={styles.footer} fixed>
          {practiceName} · {isPaid ? "Receipt" : "Invoice"}{" "}
          {invoice.invoice_number}
        </Text>
      </Page>
    </Document>
  );
}

export async function sendWhatsAppMessage({ to, body }: { to: string; body: string }) {
  const sid = `mock-${Date.now()}`;
  // eslint-disable-next-line no-console
  console.log(`[MOCK WHATSAPP] → Para: ${to} | Msg: ${body}`);
  return { sid };
}

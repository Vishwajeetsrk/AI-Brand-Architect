export async function sendSlack(webhookUrl: string, message: string, channel?: string): Promise<{ sent: boolean; error?: string }> {
  try {
    const payload = { text: message, channel };
    const res = await fetch(webhookUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      return { sent: false, error: `Slack webhook error ${res.status}: ${text}` };
    }
    return { sent: true };
  } catch (err: any) {
    return { sent: false, error: err.message };
  }
}

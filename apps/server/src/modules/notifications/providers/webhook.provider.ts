export async function sendWebhook(url: string, payload: any, method: string = 'POST'): Promise<{ sent: boolean; statusCode?: number; error?: string }> {
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { sent: res.ok, statusCode: res.status };
  } catch (err: any) {
    return { sent: false, error: err.message };
  }
}

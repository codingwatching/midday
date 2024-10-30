export async function isValidLogoUrl(url: string): Promise<boolean> {
  if (!url) return false;

  try {
    const response = await fetch(url, {
      method: "HEAD",
    });

    return response.ok;
  } catch {
    return false;
  }
}
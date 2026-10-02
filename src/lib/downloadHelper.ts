// Helper function to download code archive reliably in-app without 404 or authentication iframe errors

export async function downloadSourceArchive(format: 'zip' | 'tar' = 'zip'): Promise<{ success: boolean; message?: string }> {
  try {
    // 1. Try base64 endpoint first for 100% reliable in-memory download
    const base64Res = await fetch('/api/download-code-base64');
    if (base64Res.ok) {
      const data = await base64Res.json();
      if (data.base64) {
        const byteCharacters = atob(data.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/zip' });
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = data.filename || 'adhigam-ias-source-code.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
        return { success: true };
      }
    }

    // 2. Direct binary streaming fallback
    const endpoint = format === 'zip' ? '/api/download-code' : '/api/download-code-tar';
    const streamRes = await fetch(endpoint);
    if (!streamRes.ok) {
      throw new Error(`Download request failed (${streamRes.status})`);
    }

    const blob = await streamRes.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = format === 'zip' ? 'adhigam-ias-source-code.zip' : 'adhigam-ias-source-code.tar.gz';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);

    return { success: true };
  } catch (err: any) {
    console.error('Download failed:', err);
    return { success: false, message: err?.message || 'Could not download source code.' };
  }
}

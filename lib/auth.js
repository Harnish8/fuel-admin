export async function isAuthenticated() {
  const token = localStorage.getItem('sessionToken');
  if (!token) {
    return false;
  }

  try {
    const response = await fetch('/api/validate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    return { isValid: data.isValid, role: data.role || null };
    // return response.ok && data.isValid;
  } catch (error) {
    return false;
  }
}
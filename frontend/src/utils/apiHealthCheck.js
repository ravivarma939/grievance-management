// Utility to check if external API is accessible
export const checkExternalAPI = async () => {
  try {
    const response = await fetch('http://localhost:3232/grievance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return { accessible: response.ok, status: response.status };
  } catch (error) {
    return { accessible: false, error: error.message };
  }
};



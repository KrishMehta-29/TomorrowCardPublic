/**
 * API client for the TomorrowCard application
 * Centralized location for all API calls to the backend
 */

// Base URL for API calls
const API_BASE_URL = 'http://127.0.0.1:5000'; // Change this based on your backend URL

/**
 * Upload resume and transcript files to the server
 * @param {File} resume - The resume file object
 * @param {File} transcript - The transcript file object
 * @returns {Promise} - Promise that resolves to the response data
 */
export const uploadFiles = async (resume, transcript) => {
  try {
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('transcript', transcript);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      // Explicitly don't send credentials to match the server's CORS policy
      credentials: 'omit',
      // Don't set Content-Type header as it will be set automatically with the correct boundary for multipart/form-data
      headers: {
        // Don't set Content-Type manually for multipart/form-data
      },
      mode: 'cors'
    });

    if (!response.ok) {
      // Try to parse error JSON, but fallback if it's not JSON
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || `Error: ${response.status} ${response.statusText}`;
      } catch (e) {
        errorMessage = `Error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

/**
 * Verify uploaded resume and transcript documents
 * @param {string} resumeFilename - Filename of the uploaded resume
 * @param {string} transcriptFilename - Filename of the uploaded transcript
 * @returns {Promise} - Promise that resolves to the verification results
 */
export const verifyDocuments = async (resumeFilename, transcriptFilename, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit', // Match the CORS policy
      mode: 'cors',
      body: JSON.stringify({
        resume_filename: resumeFilename,
        transcript_filename: transcriptFilename,
        id: id
      }),
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || `Error: ${response.status} ${response.statusText}`;
      } catch (e) {
        errorMessage = `Error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying documents:', error);
    throw error;
  }
};

/**
 * Predict features based on the resume
 * @param {string} resumeFilename - Filename of the uploaded resume
 * @returns {Promise} - Promise that resolves to the prediction results
 */
export const predictFeatures = async (resumeFilename) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit', // Match the CORS policy
      mode: 'cors',
      body: JSON.stringify({
        resume_filename: resumeFilename,
      }),
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || `Error: ${response.status} ${response.statusText}`;
      } catch (e) {
        errorMessage = `Error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error predicting features:', error);
    throw error;
  }
};



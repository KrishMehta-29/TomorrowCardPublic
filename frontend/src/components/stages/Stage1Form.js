import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { uploadFiles, verifyDocuments, getCurrentProcesses } from '../../api/api';

const Stage1Form = ({ onNext, setIsProcessing, setProcessingMessage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resume, setResume] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [processStatuses, setProcessStatuses] = useState({});
  const pollingIntervalRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!name || !email || !resume || !transcript) {
      setError('Please fill all fields and upload both files');
      return;
    }
    
    // Clear any previous errors
    setError('');
    setIsLoading(true);
    
    // Use the global processing state if available
    if (setIsProcessing) setIsProcessing(true);
    
    try {
      // Step 1: Upload the files
      setUploading(true);
      setStatusMessage('Uploading files...');
      if (setProcessingMessage) setProcessingMessage('Uploading files...');
      
      const uploadResponse = await uploadFiles(resume, transcript);
      setUploading(false);
      
      const { resume_filename, transcript_filename, id } = uploadResponse;
      
      // Step 2: Verify the documents
      setVerifying(true);
      setStatusMessage('Analyzing documents...');
      if (setProcessingMessage) setProcessingMessage('Analyzing documents...');
      
      // Start polling for verification status
      let pollingStopped = false;
      console.log('Starting polling with ID:', id);
      pollingIntervalRef.current = setInterval(async () => {
        if (pollingStopped) return;
        
        try {
          console.log('Polling for process status with ID:', id);
          const processResponse = await getCurrentProcesses(id);
          console.log('Process response received:', processResponse);
          
          if (processResponse && processResponse.processes) {
            console.log('Process statuses:', processResponse.processes);
            console.log('Number of processes:', Object.keys(processResponse.processes).length);
            setProcessStatuses(processResponse.processes);
          } else {
            console.warn('Invalid process response format:', processResponse);
          }
        } catch (error) {
          console.error('Error polling processes:', error);
        }
      }, 1000);
      
      // Make the verification API call
      const verifyResponse = await verifyDocuments(resume_filename, transcript_filename, id);
      
      // Stop polling when verification completes
      pollingStopped = true;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      setVerifying(false);
      
      // Step 3: Move to next stage with all the data
      if (setIsProcessing) setIsProcessing(false);
      onNext({
        name,
        email,
        resume_filename,
        transcript_filename,
        id,
        verification_results: verifyResponse.verification_results
      });
    } catch (error) {
      setError(error.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
      setUploading(false);
      setVerifying(false);
      setStatusMessage('');
      setProcessStatuses({});
      
      // Ensure polling is stopped on error
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      
      if (setIsProcessing) setIsProcessing(false);
    }
  };

  // Conditionally render based on verification state
  if (verifying && Object.keys(processStatuses).length > 0) {
    // Show only verification status when verifying
    return (
      <Box sx={{ py: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" component="h1" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
          Verifying Your Documents
        </Typography>
        
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            maxWidth: '500px',
            mx: 'auto'
          }}
        >
          {Object.entries(processStatuses).map(([key, process]) => {
            const isDone = process.status === 'DONE';
            return (
              <Box 
                key={key} 
                sx={{ 
                  p: 2,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  border: '2px solid',
                  borderColor: isDone ? 'success.main' : 'warning.main',
                  bgcolor: isDone ? 'rgba(76, 175, 80, 0.05)' : 'rgba(255, 152, 0, 0.05)',
                  backdropFilter: 'blur(8px)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    zIndex: 0,
                  }
                }}
              >
                {isDone ? (
                  <Box 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%', 
                      bgcolor: 'success.main', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}
                  >
                    ✓
                  </Box>
                ) : (
                  <CircularProgress size={36} sx={{ color: 'warning.main', flexShrink: 0 }} />
                )}
                
                <Typography 
                  variant="body1" 
                  sx={{
                    fontWeight: 500,
                    flex: 1,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {process.display}
                </Typography>
              </Box>
            );
          })}
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          Please wait while we verify your documents. This process may take a few seconds.
        </Typography>
      </Box>
    );
  }
  
  // Regular form display when not verifying
  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
        Get Started
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Please provide your information
      </Typography>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            '& .MuiAlert-icon': { alignItems: 'center' } 
          }}
        >
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            InputProps={{ sx: { backgroundColor: '#ffffff' } }}
          />
          
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            InputProps={{ sx: { backgroundColor: '#ffffff' } }}
          />
          
          <Stack direction="row" spacing={2}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<FileUploadOutlinedIcon />}
              fullWidth
              sx={{ 
                height: '56px', 
                justifyContent: 'flex-start',
                borderColor: resume ? 'primary.main' : 'divider',
                color: resume ? 'primary.main' : 'text.secondary',
                textAlign: 'left',
                px: 2
              }}
            >
              {resume ? resume.name : 'Upload Resume'}
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
              />
            </Button>
            
            <Button
              component="label"
              variant="outlined"
              startIcon={<FileUploadOutlinedIcon />}
              fullWidth
              sx={{ 
                height: '56px', 
                justifyContent: 'flex-start',
                borderColor: transcript ? 'primary.main' : 'divider',
                color: transcript ? 'primary.main' : 'text.secondary',
                textAlign: 'left',
                px: 2
              }}
            >
              {transcript ? transcript.name : 'Upload Transcript'}
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={(e) => setTranscript(e.target.files[0])}
              />
            </Button>
          </Stack>
          
          <Box sx={{ mt: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              fullWidth
              disabled={isLoading}
              sx={{ height: '56px', mt: 2 }}
            >
              {uploading ? 'Uploading...' : 'Continue'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Stage1Form;

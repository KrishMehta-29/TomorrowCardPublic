import React, { useState } from 'react';
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
import { uploadFiles, verifyDocuments } from '../../api/api';

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
      
      const verifyResponse = await verifyDocuments(resume_filename, transcript_filename);
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
      if (setIsProcessing) setIsProcessing(false);
    }
  };

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
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  {statusMessage}
                </Box>
              ) : 'Continue'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Stage1Form;

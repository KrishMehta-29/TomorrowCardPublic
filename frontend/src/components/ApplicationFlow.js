import React, { useState } from 'react';
import { Box, Container, useTheme, CircularProgress, Typography } from '@mui/material';
import Stage1Form from './stages/Stage1Form';
import Stage2Data from './stages/Stage2Data';
import Stage3Predictions from './stages/Stage3Predictions';
import Stage4Complete from './stages/Stage4Complete';

const ApplicationFlow = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [quoteData, setQuoteData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  const handleStage1Complete = (data) => {
    // Store the data from Stage1Form, including verification results
    setUserData(data);
    
    // Only move to the next stage once we have the data
    setActiveStep(1);
  };

  const handleStage2Complete = (data) => {
    setProfileData(data);
    setActiveStep(2);
  };

  const handleStage3Complete = (data) => {
    setQuoteData(data);
    setActiveStep(3);
  };

  const handleReset = () => {
    setActiveStep(0);
    setUserData(null);
    setProfileData(null);
    setQuoteData(null);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ 
        maxWidth: 600, 
        mx: 'auto',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {/* For steps other than Stage1, show the processing indicator */}
        {isProcessing && activeStep !== 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '300px' 
          }}>
            <CircularProgress size={40} sx={{ mb: 3 }} />
            <Typography variant="body1">{processingMessage}</Typography>
          </Box>
        )}
        
        {/* Always show Stage1Form when on step 0, even while processing */}
        {activeStep === 0 && (
          <Stage1Form 
            onNext={handleStage1Complete}
            setIsProcessing={setIsProcessing} 
            setProcessingMessage={setProcessingMessage}
          />
        )}

        {!isProcessing && activeStep === 1 && userData && (
          <Stage2Data 
            userData={userData} 
            onNext={handleStage2Complete}
            setIsProcessing={setIsProcessing} 
            setProcessingMessage={setProcessingMessage} 
          />
        )}

        {!isProcessing && activeStep === 2 && profileData && (
          <Stage3Predictions 
            profileData={profileData} 
            onNext={handleStage3Complete} 
          />
        )}

        {!isProcessing && activeStep === 3 && quoteData && (
          <Stage4Complete 
            quoteData={quoteData} 
            onReset={handleReset} 
          />
        )}
      </Box>
    </Container>
  );
};

export default ApplicationFlow;

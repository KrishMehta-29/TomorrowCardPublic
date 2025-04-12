import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Stack,
  Divider
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Stage4Complete = ({ quoteData, onReset }) => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CheckCircleOutlineIcon
          sx={{ 
            fontSize: 60, 
            mb: 2,
            color: '#4caf50',
            opacity: 0.9
          }} 
        />
        <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
          Application Complete
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
          We've received your information and will process your application shortly.
          You will receive an email with further instructions.
        </Typography>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Your Quote Summary
      </Typography>
      
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            Credit Limit
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {quoteData.creditLimit}
          </Typography>
        </Stack>
        
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            Interest Rate
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {quoteData.interestRate}
          </Typography>
        </Stack>
        
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            Annual Fee
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {quoteData.annualFee}
          </Typography>
        </Stack>
      </Stack>
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={500}>
          What happens next?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Our team will review your application and contact you within 1-2 business days.
        </Typography>
        
        <Button 
          onClick={onReset} 
          variant="outlined"
          sx={{ minWidth: '200px' }}
        >
          Start New Application
        </Button>
      </Box>
    </Box>
  );
};

export default Stage4Complete;

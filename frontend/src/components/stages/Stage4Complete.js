import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Stack,
  Divider,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Stage4Complete = ({ quoteData, onReset }) => {
  // Handle application completion
  const handleCompleteApplication = () => {
    // You could add API calls here to submit the final application
    
    // Then reset or show a completion message
    onReset();
  };
  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
        Your Credit Offer
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        After reviewing your application, we're happy to offer you a credit card with the following details:
      </Typography>
      
      <Card variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
            <AccountBalanceIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Card Details
            </Typography>
          </Box>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            sx={{ justifyContent: 'space-between', mb: 3, ml: 5 }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Credit Limit
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {quoteData.creditLimit}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Interest Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    textDecoration: 'line-through',
                    color: 'text.secondary',
                    mr: 1
                  }}
                >
                  {quoteData.interestRate?.standard || "24%"}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {quoteData.interestRate?.tomorrow || quoteData.interestRate || "12%"}
                </Typography>
              </Box>
              <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                TomorrowCard APR
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Annual Fee
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {quoteData.annualFee}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ ml: 5 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              {quoteData.approved ? "Approved" : "Pending Review"}
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Based on your verification results, you qualify for our premium rate of 12% APR, 
              which is 50% lower than the standard market rate for students.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={500}>
          Ready to complete your application?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Click below to submit your application. Our team will review it and contact you within 1-2 business days.
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button 
            onClick={handleCompleteApplication} 
            variant="contained"
            size="large"
            sx={{ minWidth: '220px', height: '56px' }}
          >
            Complete Application
          </Button>
          
          <Button 
            onClick={onReset} 
            variant="outlined"
            sx={{ minWidth: '150px' }}
          >
            Start Over
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Stage4Complete;

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
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Stage3Quote = ({ profileData, onNext }) => {
  // Check if prediction results exist in profileData
  const prediction = profileData?.prediction || {};
  
  // Extract prediction data or use defaults
  const collegeIncome = prediction.average_income_for_college || { val: 'Not available', reason: null };
  const majorIncome = prediction.average_income_for_major || { val: 'Not available', reason: null };
  const careerPath = prediction.predict_career_path || { val: 'Not available', reason: null };
  const internships = prediction.predict_internship_salary?.val || [];
  const internshipReason = prediction.predict_internship_salary?.reason || null;
  
  // Default quote data - this would be replaced with API data
  const quoteData = {
    approved: true,
    creditLimit: "$5,000",
    interestRate: "18.99%",
    annualFee: "$0",
    benefits: [
      "No foreign transaction fees",
      "Cash back on all purchases",
      "Travel insurance included",
      "24/7 customer support"
    ]
  };

  const handleContinue = () => {
    // Move to the final stage
    onNext(quoteData);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
        Your Quote
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Based on your profile analysis, here's what we predict for your future
      </Typography>
      
      <Stack spacing={4}>
        {/* Predictions Section */}
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Predictions
          </Typography>
          
          <Stack spacing={3}>
            {/* Career Path Prediction */}
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <SchoolIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Career Path
                    </Typography>
                    <Typography variant="body1">
                      {careerPath.val}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ ml: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {careerPath.reason}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          
            {/* Income Predictions */}
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <MonetizationOnIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Income Potential
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Based on College:
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {collegeIncome.val}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Based on Major:
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {majorIncome.val}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ ml: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {collegeIncome.reason}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
        
            {/* Internship & Compensation */}
            {internships.length > 0 && (
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <WorkIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Internship Compensation
                      </Typography>
                      <Stack spacing={2}>
                        {internships.map((internship, index) => (
                          <Box key={index}>
                            <Typography variant="subtitle1" fontWeight={500}>
                              {internship.title} at {internship.company}
                            </Typography>
                            <Typography variant="body1">
                              ${internship.avg_pay_usd_per_month.toLocaleString()} per month
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                  {internshipReason && (
                    <Box sx={{ ml: 5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {internshipReason}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </Stack>
        </Box>
        
        <Divider />
        
        {/* Card Offer Section */}
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Tomorrow Card Offer
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
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {quoteData.interestRate}
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
              </Box>
            </CardContent>
          </Card>
          
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, ml: 1 }}>
            Card Benefits
          </Typography>
          
          <Box sx={{ ml: 1 }}>
            <Stack spacing={1}>
              {quoteData.benefits.map((benefit, index) => (
                <Typography key={index} variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                  • {benefit}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            onClick={handleContinue} 
            variant="contained" 
            size="large"
            sx={{ minWidth: '220px', height: '56px', fontSize: '1rem' }}
          >
            Continue
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Stage3Quote;

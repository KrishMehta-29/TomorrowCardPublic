import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Stack,
  Card,
  CardContent
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const Stage3Predictions = ({ profileData, onNext }) => {
  // Check if prediction results exist in profileData
  const prediction = profileData?.prediction || {};
  
  // Extract prediction data or use defaults
  const collegeIncome = prediction.average_income_for_college || { val: 'Not available', reason: null };
  const majorIncome = prediction.average_income_for_major || { val: 'Not available', reason: null };
  const careerPath = prediction.predict_career_path || { val: 'Not available', reason: null };
  const internships = prediction.predict_internship_salary?.val || [];
  const internshipReason = prediction.predict_internship_salary?.reason || null;
  
  // Generate a random credit limit between $5,000 and $10,000
  const randomLimit = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
  // Round to nearest 500
  const roundedLimit = Math.round(randomLimit / 500) * 500;
  
  // Quote data with random credit limit and 12% APR (down from 24%)
  const quoteData = {
    approved: true,
    creditLimit: `$${roundedLimit.toLocaleString()}`,
    interestRate: {
      standard: "24%",
      tomorrow: "12%"
    },
    annualFee: "$0",
    benefits: [
      "No foreign transaction fees",
      "2% cash back on all purchases",
      "Travel insurance included",
      "24/7 customer support"
    ]
  };

  const handleContinue = () => {
    // Move to the quote stage
    onNext(quoteData);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
        Your Future Potential
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
                {(collegeIncome.reason || majorIncome.reason) && (
                  <Box sx={{ ml: 5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {collegeIncome.reason || majorIncome.reason}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
            
            {/* Internship Opportunities */}
            {internships.length > 0 && (
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <WorkIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Potential Internships
                      </Typography>
                      <Stack spacing={2} sx={{ mt: 1 }}>
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
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            onClick={handleContinue} 
            variant="contained" 
            size="large"
            sx={{ minWidth: '220px', height: '56px', fontSize: '1rem' }}
          >
            See My Credit Offer
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Stage3Predictions;

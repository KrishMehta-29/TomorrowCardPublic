import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Stack,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { predictFeatures } from '../../api/api';

const Stage2Data = ({ userData, onNext, setIsProcessing, setProcessingMessage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState('');
  
  // Extract verification results from userData
  const { verification_results, name, email, resume_filename } = userData;
  
  // Format verification results for display
  const formatVerificationData = () => {
    if (!verification_results) {
      return {
        personalInfo: {
          name: name || 'N/A',
          email: email || 'N/A',
        },
        educationInfo: {
          university: 'Not detected',
          degree: 'Bachelors of Science',
          gpa: 'Not available'
        },
        backgroundInfo: {},
        workExperience: [],
        coursework: []
      };
    }
    
    // Extract personal info
    const personalInfo = {
      name: name || 'N/A',
      email: email || 'N/A',
    };
    
    // Extract education info
    const educationInfo = {
      university: verification_results.school_and_class?.val || 'Not detected',
      degree: 'Bachelors of Science', // Hardcoded as requested
      gpa: verification_results.gpa?.val || 'Not available'
    };
    
    // Add education reasons if they exist
    if (verification_results.school_and_class?.reason) {
      educationInfo.schoolReason = verification_results.school_and_class.reason;
    }
    if (verification_results.gpa?.reason) {
      educationInfo.gpaReason = verification_results.gpa.reason;
    }
    
    // Extract background and credit check info
    const backgroundInfo = {
      background: verification_results.background?.val || null,
      backgroundReason: verification_results.background?.reason || null,
      credit: verification_results.credit?.val || null,
      creditScore: verification_results.credit?.score || null,
      creditReason: verification_results.credit?.reason || null
    };
    
    // Extract work experience info
    const workExperience = verification_results.employment?.val || [];
    
    // Extract coursework info
    const coursework = verification_results.class_vs_major?.val || [];
    const major = verification_results.class_vs_major?.major?.val || 'Not detected';
    const majorReason = verification_results.class_vs_major?.major?.reason || null;
    const courseReason = verification_results.class_vs_major?.reason || null;
    
    return {
      personalInfo,
      educationInfo,
      backgroundInfo,
      workExperience,
      coursework,
      major,
      majorReason,
      courseReason
    };
  };
  
  const profileData = formatVerificationData();

  const handleGetQuote = async () => {
    setIsLoading(true);
    setError('');
    
    // Use the global processing state if available
    if (setIsProcessing) setIsProcessing(true);
    if (setProcessingMessage) setProcessingMessage('Generating your quote...');
    
    try {
      // Call the predict API
      const response = await predictFeatures(resume_filename);
      setPredictionData(response.prediction_results);
      
      // Move to the next stage with combined data
      if (setIsProcessing) setIsProcessing(false);
      onNext({
        ...profileData,
        prediction: response.prediction_results
      });
    } catch (error) {
      setError(error.message || 'Failed to generate quote. Please try again.');
      setIsLoading(false);
      if (setIsProcessing) setIsProcessing(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
        Profile Analysis
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        We've analyzed your resume and transcript
      </Typography>
      
      <Stack spacing={4}>
        {/* Name & Email Section */}
        <Box sx={{ p: 0 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Personal Information
          </Typography>
          <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Name
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {profileData.personalInfo.name}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {profileData.personalInfo.email}
              </Typography>
            </Box>
          </Stack>
          
          <Divider sx={{ my: 3 }} />

          {/* University, Degree, GPA Section */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Education Information
          </Typography>
          <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                University
              </Typography>
              <Typography variant="body1" fontWeight={500} sx={{
                color: profileData.educationInfo.schoolReason ? 'error.main' : 'inherit'
              }}>
                {profileData.educationInfo.university}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Degree
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {profileData.educationInfo.degree}
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                GPA
              </Typography>
              <Typography variant="body1" fontWeight={500} sx={{
                color: profileData.educationInfo.gpaReason ? 'error.main' : 'inherit'
              }}>
                {profileData.educationInfo.gpa}
              </Typography>
              {profileData.educationInfo.gpaReason && (
                <Alert severity="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
                  {profileData.educationInfo.gpaReason}
                </Alert>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Major
              </Typography>
              <Typography variant="body1" fontWeight={500} sx={{
                color: profileData.majorReason ? 'error.main' : 'inherit'
              }}>
                {profileData.major || 'Not detected'}
              </Typography>
              {profileData.majorReason && (
                <Alert severity="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
                  {profileData.majorReason}
                </Alert>
              )}
            </Box>
          </Stack>
          
          <Divider sx={{ my: 3 }} />

          {/* Background & Credit Check Section */}
          {(profileData.backgroundInfo.background || profileData.backgroundInfo.credit) && (
            <>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Background & Credit Information
              </Typography>
              
              {profileData.backgroundInfo.background && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Background Check
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{
                    color: profileData.backgroundInfo.backgroundReason ? 'error.main' : 'inherit'
                  }}>
                    {profileData.backgroundInfo.background}
                  </Typography>
                  {profileData.backgroundInfo.backgroundReason && (
                    <Alert severity="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
                      {profileData.backgroundInfo.backgroundReason}
                    </Alert>
                  )}
                </Box>
              )}
              
              {profileData.backgroundInfo.credit && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Credit Check
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{
                    color: profileData.backgroundInfo.creditReason ? 'error.main' : 'inherit'
                  }}>
                    {profileData.backgroundInfo.credit}
                    {profileData.backgroundInfo.creditScore && (
                      <span> (Score: {profileData.backgroundInfo.creditScore})</span>
                    )}
                  </Typography>
                  {profileData.backgroundInfo.creditReason && (
                    <Alert severity="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
                      {profileData.backgroundInfo.creditReason}
                    </Alert>
                  )}
                </Box>
              )}
              
              <Divider sx={{ my: 3 }} />
            </>
          )}

          {/* Work Experience Section */}
          {profileData.workExperience && profileData.workExperience.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Work Experience
              </Typography>
              <Stack spacing={2} sx={{ mb: 3 }}>
                {profileData.workExperience.map((job, index) => (
                  <Box key={index}>
                    <Typography variant="body1" fontWeight={600} sx={{
                      color: job.reason ? 'error.main' : 'inherit'
                    }}>
                      {job.title}
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: job.reason ? 'error.main' : 'text.secondary'
                    }}>
                      {job.company}
                    </Typography>
                    {job.reason && (
                      <Alert severity="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
                        {job.reason}
                      </Alert>
                    )}
                  </Box>
                ))}
              </Stack>
              
              <Divider sx={{ my: 3 }} />
            </>
          )}

          {/* Coursework Section */}
          {profileData.coursework && profileData.coursework.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Coursework
              </Typography>
              {profileData.educationInfo.schoolReason && (
                <Alert severity="error" sx={{ mb: 2, fontSize: '0.875rem' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Courses Issues:
                  </Typography>
                  {profileData.educationInfo.schoolReason}
                </Alert>
              )}
              {profileData.courseReason && (
                <Alert severity="error" sx={{ mb: 2, fontSize: '0.875rem' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Course Verification Issue:
                  </Typography>
                  {profileData.courseReason}
                </Alert>
              )}
              <Box sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '120px 1fr 60px', 
                  columnGap: 2,
                  rowGap: 1
                }}>
                  {/* Header Row */}
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Course Code
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Course Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', textAlign: 'center' }}>
                    Grade
                  </Typography>
                  
                  {/* Course Rows - sorted by course code */}
                  {[...profileData.coursework]
                    .sort((a, b) => {
                      // Sort by course code, handling empty codes
                      if (!a.code) return 1;
                      if (!b.code) return -1;
                      return a.code.localeCompare(b.code);
                    })
                    .map((course, index) => (
                      <React.Fragment key={index}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {course.code || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: course.reason ? 'error.main' : 'inherit'
                        }}>
                          {course.course}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500, 
                          color: course.reason ? 'error.main' : 
                                 course.grade === 'P' ? 'success.main' : 
                                 course.grade?.includes('A') ? 'success.dark' : 
                                 'text.primary',
                          textAlign: 'center'
                        }}>
                          {course.grade || 'N/A'}
                        </Typography>
                      </React.Fragment>
                  ))}
                </Box>
              </Box>
              

            </>
          )}
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            onClick={handleGetQuote} 
            variant="contained" 
            size="large"
            disabled={isLoading}
            sx={{ minWidth: '180px', height: '56px', fontSize: '1rem' }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Generating Quote...
              </Box>
            ) : 'Get Quote'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Stage2Data;

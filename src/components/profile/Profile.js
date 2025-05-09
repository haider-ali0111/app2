import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Fade,
  CircularProgress,
  Divider,
  Tab,
  Tabs,
  Chip,
  CardActionArea
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Videocam as VideocamIcon,
  LocationOn,
  CalendarToday
} from '@mui/icons-material';
import { fetchUserMedia, deleteMedia } from '../../store/slices/mediaSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { userMedia, loading } = useSelector(state => state.media);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserMedia());
    }
  }, [dispatch, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteMedia = async (mediaId) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      await dispatch(deleteMedia(mediaId));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const filteredMedia = userMedia.filter(media => 
    tabValue === 0 ? media.type === 'image' : media.type === 'video'
  );

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={500}>
        <Box sx={{ py: 4 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              mb: 4,
              borderRadius: 4,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{
                  width: 120,
                  height: 120,
                  border: '4px solid',
                  borderColor: 'primary.main',
                }}
              >
                {user.name[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {user.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" />
                    <Typography variant="body2">
                      Joined {formatDate(user.createdAt)}
                    </Typography>
                  </Box>
                  {user.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn fontSize="small" />
                      <Typography variant="body2">
                        {user.location}
                      </Typography>
                    </Box>
                  )}
                </Box>
                {user.bio && (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mt: 2,
                      color: 'text.secondary',
                      maxWidth: 600,
                    }}
                  >
                    {user.bio}
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box sx={{ mb: 4 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    minWidth: 120,
                    fontWeight: 600,
                  },
                }}
              >
                <Tab
                  icon={<PhotoLibraryIcon />}
                  label="Images"
                  iconPosition="start"
                />
                <Tab
                  icon={<VideocamIcon />}
                  label="Videos"
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredMedia.map((media) => (
                  <Grid item key={media._id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                          '& .media-actions': {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <CardActionArea onClick={() => navigate(`/media/${media._id}`)}>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component={media.type === 'video' ? 'video' : 'img'}
                            height="200"
                            image={media.url}
                            alt={media.title}
                            sx={{ objectFit: 'cover' }}
                          />
                          <Box
                            className="media-actions"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              display: 'flex',
                              gap: 1,
                              opacity: 0,
                              transition: 'opacity 0.3s ease-in-out',
                            }}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 1)',
                                },
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/media/${media._id}`);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 1)',
                                },
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMedia(media._id);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="h2" noWrap>
                          {media.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 2,
                          }}
                        >
                          {media.caption}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {media.tags?.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderRadius: 1,
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                  color: 'white',
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {!loading && filteredMedia.length === 0 && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                  color: 'text.secondary',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No {tabValue === 0 ? 'images' : 'videos'} found
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/upload')}
                  sx={{
                    mt: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 4,
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                    transition: 'transform 0.2s ease-in-out',
                  }}
                >
                  Upload {tabValue === 0 ? 'Image' : 'Video'}
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default Profile; 
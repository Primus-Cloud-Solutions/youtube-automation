'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import DashboardHeader from '@/app/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ViralVideosPage() {
  const { user, subscription } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkPosition, setWatermarkPosition] = useState('bottomRight');
  const [textOverlay, setTextOverlay] = useState('');
  const [textOverlayPosition, setTextOverlayPosition] = useState('bottom');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoTags, setVideoTags] = useState('');
  const [privacyStatus, setPrivacyStatus] = useState('private');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasEnterpriseAccess, setHasEnterpriseAccess] = useState(false);

  // Check if user has enterprise access
  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/viral-video?action=get-feature-status&userId=${user.id}`);
        const data = await response.json();

        if (data.success) {
          setHasEnterpriseAccess(true);
          // Load categories
          const categoriesResponse = await fetch(`/api/viral-video?action=get-trending-categories&userId=${user.id}`);
          const categoriesData = await categoriesResponse.json();

          if (categoriesData.success) {
            setCategories(categoriesData.categories);
            if (categoriesData.categories.length > 0) {
              setSelectedCategory(categoriesData.categories[0].id);
            }
          }
        } else {
          setError('This feature requires an Enterprise subscription');
        }
      } catch (err) {
        console.error('Error checking access:', err);
        setError('Failed to check feature access');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user]);

  // Search for viral videos
  const searchVideos = async () => {
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResults([]);

    try {
      const response = await fetch(`/api/viral-video?action=search-viral-videos&userId=${user.id}&category=${selectedCategory}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.videos);
        if (data.videos.length === 0) {
          setError('No viral videos found for this category');
        }
      } else {
        setError(data.error || 'Failed to search for viral videos');
      }
    } catch (err) {
      console.error('Error searching videos:', err);
      setError('Failed to search for viral videos');
    } finally {
      setLoading(false);
    }
  };

  // Select a video for editing
  const selectVideo = (video) => {
    setSelectedVideo(video);
    setVideoTitle(`${watermarkText || 'My Brand'} - ${video.snippet.title}`);
    setVideoDescription(`This is an analysis of "${video.snippet.title}" by ${video.snippet.channelTitle}.\n\nOriginal video: https://youtube.com/watch?v=${video.id}\n\nThis video explores the trending topic: ${video.trendTopic}`);
    setVideoTags(`${video.trendTopic}, analysis, commentary`);
  };

  // Process and upload video
  const processVideo = async () => {
    if (!selectedVideo) {
      setError('Please select a video first');
      return;
    }

    if (!watermarkText) {
      setError('Please enter watermark text for branding');
      return;
    }

    if (!videoTitle || !videoDescription) {
      setError('Please enter video title and description');
      return;
    }

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      // In a real implementation, you would get the access token from the user's session
      // For now, we'll use a placeholder
      const accessToken = 'placeholder_access_token';

      const processingOptions = {
        category: selectedCategory,
        branding: {
          watermarkText,
          watermarkPosition
        },
        textOverlays: textOverlay ? [
          {
            text: textOverlay,
            position: textOverlayPosition,
            startTime: 5,
            duration: 10
          }
        ] : [],
        metadata: {
          title: videoTitle,
          description: videoDescription,
          tags: videoTags,
          privacyStatus
        }
      };

      const response = await fetch('/api/viral-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'process-viral-video',
          userId: user.id,
          accessToken,
          category: selectedCategory,
          options: processingOptions
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Video successfully processed and uploaded! Video ID: ${data.videoId}`);
        // Reset form
        setSelectedVideo(null);
        setVideoTitle('');
        setVideoDescription('');
        setVideoTags('');
      } else {
        setError(data.error || 'Failed to process video');
      }
    } catch (err) {
      console.error('Error processing video:', err);
      setError('Failed to process video');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <DashboardHeader />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (!hasEnterpriseAccess) {
    return (
      <div className="container mx-auto p-4">
        <DashboardHeader />
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Enterprise Feature</AlertTitle>
          <AlertDescription>
            This feature requires an Enterprise subscription. Please upgrade your plan to access viral video rebranding.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => window.location.href = '/pricing'}>View Pricing</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader />
      
      <h1 className="text-3xl font-bold mt-6 mb-4">Viral Video Rebranding</h1>
      <p className="text-gray-600 mb-6">
        Find viral videos, edit them with your branding, and upload them to your YouTube channel.
      </p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="search">
        <TabsList className="mb-4">
          <TabsTrigger value="search">Search Videos</TabsTrigger>
          <TabsTrigger value="edit" disabled={!selectedVideo}>Edit & Brand</TabsTrigger>
          <TabsTrigger value="upload" disabled={!selectedVideo}>Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Search for Viral Videos</CardTitle>
              <CardDescription>
                Find trending videos in your niche that you can rebrand and upload to your channel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3">
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={searchVideos} disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {searchResults.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((video) => (
                <Card key={video.id} className={`cursor-pointer ${selectedVideo?.id === video.id ? 'border-primary' : ''}`} onClick={() => selectVideo(video)}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base truncate">{video.snippet.title}</CardTitle>
                    <CardDescription>
                      {video.snippet.channelTitle} • {parseInt(video.statistics.viewCount).toLocaleString()} views
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="aspect-video bg-gray-100 mb-2 overflow-hidden">
                      <img 
                        src={video.snippet.thumbnails.high.url} 
                        alt={video.snippet.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Trend Score: {video.trendScore}</span>
                      <span className="text-sm">{video.trendTopic}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant={selectedVideo?.id === video.id ? "default" : "outline"} className="w-full">
                      {selectedVideo?.id === video.id ? "Selected" : "Select"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit & Brand Video</CardTitle>
              <CardDescription>
                Add your branding and customize the video before uploading.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="watermarkText">Watermark Text</Label>
                    <Input
                      id="watermarkText"
                      placeholder="Your brand name"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="watermarkPosition">Watermark Position</Label>
                    <Select value={watermarkPosition} onValueChange={setWatermarkPosition}>
                      <SelectTrigger id="watermarkPosition">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="topLeft">Top Left</SelectItem>
                        <SelectItem value="topRight">Top Right</SelectItem>
                        <SelectItem value="bottomLeft">Bottom Left</SelectItem>
                        <SelectItem value="bottomRight">Bottom Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="textOverlay">Text Overlay</Label>
                    <Input
                      id="textOverlay"
                      placeholder="Text to display on video"
                      value={textOverlay}
                      onChange={(e) => setTextOverlay(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="textOverlayPosition">Text Position</Label>
                    <Select value={textOverlayPosition} onValueChange={setTextOverlayPosition}>
                      <SelectTrigger id="textOverlayPosition">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="middle">Middle</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload to YouTube</CardTitle>
              <CardDescription>
                Configure your video details before uploading to YouTube.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="videoTitle">Video Title</Label>
                  <Input
                    id="videoTitle"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="videoDescription">Video Description</Label>
                  <Textarea
                    id="videoDescription"
                    rows={5}
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="videoTags">Tags (comma separated)</Label>
                  <Input
                    id="videoTags"
                    value={videoTags}
                    onChange={(e) => setVideoTags(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="privacyStatus">Privacy Status</Label>
                  <Select value={privacyStatus} onValueChange={setPrivacyStatus}>
                    <SelectTrigger id="privacyStatus">
                      <SelectValue placeholder="Select privacy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="unlisted">Unlisted</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={processVideo} disabled={processing} className="w-full">
                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Process & Upload Video
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

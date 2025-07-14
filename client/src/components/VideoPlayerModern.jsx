import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  SkipBack,
  SkipForward,
  Settings,
  Download,
  BookOpen,
  Clock,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const VideoPlayer = ({
  src,
  title = "NDT Training Module",
  description = "",
  onProgress,
  onComplete,
  className = "",
  poster = null,
  chapters = [],
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChapters, setShowChapters] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onProgress) {
        onProgress(video.currentTime, video.duration);
      }
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / video.duration) * 100;
        setBuffered(bufferedPercent);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) {
        onComplete();
      }
    };

    const handleError = () => {
      setError("Failed to load video. Please try again.");
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;
    video.currentTime = time;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds) => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const changePlaybackRate = (rate) => {
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentChapter = () => {
    return chapters.find(chapter => 
      currentTime >= chapter.startTime && currentTime < chapter.endTime
    );
  };

  const jumpToChapter = (chapter) => {
    videoRef.current.currentTime = chapter.startTime;
    setShowChapters(false);
  };

  if (error) {
    return (
      <div className={`bg-gray-900 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center text-white p-8">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-semibold mb-2">Video Load Error</h3>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-xl overflow-hidden shadow-2xl group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(true)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg">Loading NDT Training Video...</p>
          </div>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            onClick={togglePlay}
            className={`bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all duration-200 pointer-events-auto ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
          </button>
        </div>
      )}

      {/* Video Info Overlay */}
      <div className={`absolute top-4 left-4 right-4 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-gradient-to-r from-black/80 to-transparent p-4 rounded-lg">
          <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
          {description && (
            <p className="text-gray-300 text-sm">{description}</p>
          )}
          {getCurrentChapter() && (
            <div className="flex items-center space-x-2 mt-2">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">
                {getCurrentChapter().title}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div 
            className="w-full h-2 bg-white/20 rounded-full cursor-pointer group"
            onClick={handleSeek}
          >
            {/* Buffered */}
            <div 
              className="absolute h-2 bg-white/30 rounded-full"
              style={{ width: `${buffered}%` }}
            />
            {/* Progress */}
            <div 
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          {/* Chapter Markers */}
          {chapters.map((chapter, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full transform -translate-y-1/2 cursor-pointer hover:scale-150 transition-transform"
              style={{ left: `${(chapter.startTime / duration) * 100}%` }}
              onClick={() => jumpToChapter(chapter)}
              title={chapter.title}
            />
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            {/* Skip buttons */}
            <button
              onClick={() => skip(-10)}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => skip(10)}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Time */}
            <div className="flex items-center space-x-1 text-white text-sm">
              <Clock className="h-4 w-4" />
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Chapters */}
            {chapters.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowChapters(!showChapters)}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <BookOpen className="h-5 w-5" />
                </button>
                
                {showChapters && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-3 min-w-64 max-h-60 overflow-y-auto">
                    <h4 className="text-white font-semibold mb-2">Chapters</h4>
                    {chapters.map((chapter, index) => (
                      <button
                        key={index}
                        onClick={() => jumpToChapter(chapter)}
                        className="block w-full text-left p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                      >
                        <div className="font-medium">{chapter.title}</div>
                        <div className="text-xs text-gray-400">{formatTime(chapter.startTime)}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-blue-400 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
              
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-3 min-w-48">
                  <h4 className="text-white font-semibold mb-2">Playback Speed</h4>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={`block w-full text-left p-2 rounded transition-colors ${
                        playbackRate === rate 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {rate}x {rate === 1 && '(Normal)'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
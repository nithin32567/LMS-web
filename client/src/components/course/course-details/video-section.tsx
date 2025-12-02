import { Play } from 'lucide-react';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  content: string;
  order: number;
  duration?: number;
  videoUrl?: string;
}

interface VideoSectionProps {
  selectedLesson: Lesson | null;
}

const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

export const VideoSection = ({ selectedLesson }: VideoSectionProps) => {
  const videoId = selectedLesson?.videoUrl ? extractYouTubeVideoId(selectedLesson.videoUrl) : null;
  const videoEmbedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="bg-[#1f1f1f] border border-border rounded-lg overflow-hidden">
      {videoEmbedUrl ? (
        <div className="aspect-video w-full">
          <iframe
            src={videoEmbedUrl}
            title={selectedLesson?.title || 'Video Player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        <div className="aspect-video w-full flex items-center justify-center bg-muted/30">
          <div className="text-center">
            <Play className="size-12 text-foreground/40 mx-auto mb-2" />
            <p className="text-foreground/60">
              {selectedLesson ? 'No video available for this lesson' : 'Select a lesson to view video'}
            </p>
          </div>
        </div>
      )}
      {selectedLesson && (
        <div className="p-6 border-t border-border">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {selectedLesson.title}
          </h2>
          <p className="text-sm text-foreground/70 mb-3">
            {selectedLesson.description}
          </p>
          <div className="prose prose-invert max-w-none">
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">
              {selectedLesson.content}
            </p>
          </div>
          {selectedLesson.duration && (
            <div className="mt-4 text-xs text-foreground/60">
              Duration: {selectedLesson.duration} minutes
            </div>
          )}
        </div>
      )}
    </div>
  );
};


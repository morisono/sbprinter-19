import { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';

interface ImageUploaderProps {
  onImagesUploaded: (images: File[]) => void;
}

export const ImageUploader = ({ onImagesUploaded }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onImagesUploaded(files);
    }
  }, [onImagesUploaded]);

  return (
    <Card
      className={`w-full h-32 border-2 border-dashed transition-colors
        ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'}
        flex items-center justify-center cursor-pointer`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="text-center text-gray-500">
        {isDragging ? 'Drop images here' : 'Drag and drop images here'}
      </div>
    </Card>
  );
};
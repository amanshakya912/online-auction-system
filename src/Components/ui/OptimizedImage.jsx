import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  fallbackIcon = faImage,
  aspectRatio = 'auto',
  loading = 'lazy',
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div 
      className={`relative overflow-hidden bg-background-secondary ${className}`}
      style={{ aspectRatio }}
    >
      {/* Loading spinner */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      {/* Error fallback */}
      {imageError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-primary bg-background-secondary">
          <FontAwesomeIcon icon={fallbackIcon} className="w-12 h-12 mb-2" />
          <span className="text-sm text-text-secondary">Image unavailable</span>
        </div>
      ) : (
        /* Actual image */
        <motion.img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover"
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;

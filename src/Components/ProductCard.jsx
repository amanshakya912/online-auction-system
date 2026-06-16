import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faGavel, 
  faFire,
  faCheckCircle,
  faCalendarAlt 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';

const ProductCard = ({ product, onCardClick }) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isEndingSoon, setIsEndingSoon] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Calculate time remaining
  useEffect(() => {
    if (!product.endTime) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const end = new Date(product.endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeRemaining('Ended');
        setIsEndingSoon(false);
        return;
      }

      // Check if ending within 1 hour
      const oneHour = 60 * 60 * 1000;
      setIsEndingSoon(distance <= oneHour);

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [product.endTime]);

  // Status badge configuration
  const statusConfig = {
    live: {
      label: 'Live',
      color: 'bg-status-live',
      icon: faGavel,
    },
    upcoming: {
      label: 'Upcoming',
      color: 'bg-status-upcoming',
      icon: faCalendarAlt,
    },
    ended: {
      label: 'Ended',
      color: 'bg-status-ended',
      icon: faCheckCircle,
    },
  };

  const status = statusConfig[product.status] || statusConfig.live;

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(product.id);
    } else if (product.slug) {
      navigate(`/${product.slug}`);
    }
  };

  return (
    <Card
      hoverable
      padding="none"
      onClick={handleClick}
      className="group overflow-hidden"
    >
      {/* Image container with gradient overlay */}
      <div className="relative aspect-[4/3] overflow-hidden bg-background-secondary">
        {/* Image */}
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 animate-shimmer" />
            )}
            <motion.img
              src={product.image ? (product.image.startsWith('/uploads/') ? product.image : `/uploads/${product.image}`) : ''}
              alt={product.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-primary text-4xl">
            <FontAwesomeIcon icon={faGavel} />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <div className={`${status.color} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-raised`}>
            <FontAwesomeIcon icon={status.icon} className="w-3 h-3" />
            {status.label}
          </div>
        </div>

        {/* Ending soon indicator */}
        {isEndingSoon && product.status === 'live' && (
          <div className="absolute top-3 right-3">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="bg-semantic-error text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-glow"
            >
              <FontAwesomeIcon icon={faFire} className="w-3 h-3" />
              Ending Soon
            </motion.div>
          </div>
        )}

        {/* Time remaining (bottom overlay) */}
        {product.status === 'live' && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
              <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
              <span className="font-medium">{timeRemaining}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Bid information */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary mb-1">Current Bid</p>
            <p className="text-xl font-bold text-primary">
              ${product.currentBid?.toLocaleString() || '0'}
            </p>
          </div>

          {/* Bid count */}
          {product.bidCount !== undefined && (
            <div className="text-right">
              <p className="text-xs text-text-secondary mb-1">Bids</p>
              <p className="text-lg font-semibold text-text-primary flex items-center gap-1">
                <FontAwesomeIcon icon={faGavel} className="w-3 h-3 text-primary" />
                {product.bidCount}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;

import { motion } from 'framer-motion';
import Button from './Button';

const EmptyState = ({
  icon,
  title,
  description,
  action = null,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        flex flex-col items-center justify-center
        text-center py-12 px-6
        ${className}
      `}
    >
      {/* Icon */}
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="mb-4 text-primary text-5xl"
        >
          {icon}
        </motion.div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-text-secondary max-w-md mb-6">
        {description}
      </p>

      {/* Action button */}
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="primary"
            onClick={action.onClick}
            icon={action.icon}
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;

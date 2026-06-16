import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faInfoCircle, 
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';

// Custom toast icons
const ToastIcon = ({ icon, color }) => (
  <FontAwesomeIcon icon={icon} className={`w-5 h-5 ${color}`} />
);

// Toast configuration
export const toastConfig = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark',
  style: {
    background: '#212121',
    color: '#e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.4)',
  },
};

// Custom toast functions with icons
export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      icon: <ToastIcon icon={faCheckCircle} color="text-semantic-success" />,
      ...options,
    });
  },
  
  error: (message, options = {}) => {
    toast.error(message, {
      icon: <ToastIcon icon={faExclamationCircle} color="text-semantic-error" />,
      ...options,
    });
  },
  
  info: (message, options = {}) => {
    toast.info(message, {
      icon: <ToastIcon icon={faInfoCircle} color="text-semantic-info" />,
      ...options,
    });
  },
  
  warning: (message, options = {}) => {
    toast.warning(message, {
      icon: <ToastIcon icon={faExclamationTriangle} color="text-semantic-warning" />,
      ...options,
    });
  },
};

export default toastConfig;

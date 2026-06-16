const SkeletonScreen = ({
  variant = 'rectangle',
  width = '100%',
  height = '20px',
  count = 1,
  className = '',
}) => {
  // Variant styles
  const variantStyles = {
    card: 'rounded-lg h-64',
    text: 'rounded h-4',
    circle: 'rounded-full',
    rectangle: 'rounded',
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`
        bg-background-secondary
        animate-shimmer
        ${variantStyles[variant]}
        ${className}
      `}
      style={{
        width: variant === 'circle' ? height : width,
        height: height,
      }}
      aria-hidden="true"
    />
  ));

  if (count === 1) {
    return skeletons[0];
  }

  return (
    <div className="flex flex-col gap-3">
      {skeletons}
    </div>
  );
};

export default SkeletonScreen;

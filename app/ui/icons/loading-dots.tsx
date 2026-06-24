interface LoadingDotsProps {
  color?: string;
}

const LoadingDots = ({ color = '#000' }: LoadingDotsProps) => {
  return (
    <span className="inline-flex items-center">
      <span
        className="mx-px inline-block h-1.25 w-1.25 animate-[blink_1.4s_infinite_both] rounded-full"
        style={{ backgroundColor: color }}
      />
      <span
        className="mx-px inline-block h-1.25 w-1.25 animate-[blink_1.4s_0.2s_infinite_both] rounded-full"
        style={{ backgroundColor: color }}
      />
      <span
        className="mx-px inline-block h-1.25 w-1.25 animate-[blink_1.4s_0.4s_infinite_both] rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
};

export default LoadingDots;

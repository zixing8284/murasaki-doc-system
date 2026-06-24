interface LoadingTextProps {
  text?: string;
}

const LoadingText = ({ text = 'Loading' }: LoadingTextProps) => {
  return (
    <span className="inline-flex items-center">
      {text}
      <span className="inline-block h-[1em] w-auto overflow-hidden align-[-0.25em] leading-none after:block after:whitespace-pre-wrap after:content-['...\\A..\\A.'] after:animate-[loading-text_3s_infinite_step-start_both]" />
    </span>
  );
};

export default LoadingText;

import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export default function SubmitButton({
  text,
  isValid,
  className,
}: {
  text: string;
  isValid?: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={`item-center flex justify-center ${className}`}
      aria-disabled={pending}
      disabled={pending || (isValid !== undefined ? !isValid : false)}
    >
      <span>{text}</span>
      {pending ? <LoaderCircle className="ml-1 h-4 w-4 animate-spin" /> : null}
    </Button>
  );
}

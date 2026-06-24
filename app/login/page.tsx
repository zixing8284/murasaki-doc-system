import LoginForm from '@/app/ui/login-form';

export const metadata = {
  title: '登录',
};

export default function LoginPage() {
  return (
    <div className="h-screen w-full grid-cols-1 lg:grid">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-87.5 gap-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

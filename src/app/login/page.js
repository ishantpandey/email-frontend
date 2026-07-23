import LoginPageContent from '@/component/LoginPageContent';
import { Suspense } from 'react';


export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    }>
      <LoginPageContent/>
    </Suspense>
  );
}
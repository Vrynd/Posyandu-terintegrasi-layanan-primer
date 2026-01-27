import { Suspense } from 'react';

// LoginSuspenseWrapper - Wrapper suspense minimal untuk halaman login/register
export function LoginSuspenseWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={null}>
            {children}
        </Suspense>
    );
}

/**
 * LoginPage - Login with email or NIK and password
 * 
 * UI-only component - all logic handled by useLogin hook
 * Uses extracted components for better maintainability
 */

import { useLogin } from '../../hooks/useLogin';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { AuthBrandingPanel, LoadingOverlay, MobileLogo, LoginForm } from '../../components/auth';

export function LoginPage() {
    useDocumentTitle('Masuk');
    const {
        identifier,
        password,
        showPassword,
        identifierError,
        passwordError,
        generalError,
        isLoading,
        setIdentifier,
        setPassword,
        toggleShowPassword,
        handleSubmit,
    } = useLogin();

    return (
        <div className="min-h-screen bg-slate-100 flex relative">
            {isLoading && <LoadingOverlay message="Memproses login..." />}
            
            <AuthBrandingPanel />

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-md">
                    <MobileLogo />
                    
                    <LoginForm
                        identifier={identifier}
                        password={password}
                        showPassword={showPassword}
                        identifierError={identifierError}
                        passwordError={passwordError}
                        generalError={generalError}
                        isLoading={isLoading}
                        onIdentifierChange={setIdentifier}
                        onPasswordChange={setPassword}
                        onTogglePassword={toggleShowPassword}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}

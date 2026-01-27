import { useLogin } from "../hooks/useLogin";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { LoginForm } from "../components/auth";
import { FullPageLoading } from "../components/common";

export function LoginPage() {
  useDocumentTitle("Masuk");
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
    <>
      {isLoading && <FullPageLoading message="Memproses login..." />}

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
    </>
  );
}

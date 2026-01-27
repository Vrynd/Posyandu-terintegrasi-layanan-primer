import { useState } from "react";
import toast from "react-hot-toast";
import { useRegister } from "../hooks/useRegister";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { RegisterForm } from "../components/auth";
import { FullPageLoading } from "../components/common";

export function RegisterPage() {
  useDocumentTitle("Daftar");
  const {
    name,
    email,
    password,
    passwordConfirmation,
    nik,
    phoneNumber,
    setName,
    setEmail,
    setPassword,
    setPasswordConfirmation,
    setNik,
    setPhoneNumber,
    fieldErrors,
    generalError,
    isLoading,
    passwordStrength,
    handleSubmit,
  } = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    try {
      await handleSubmit(e);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return (
    <>
      {isLoading && <FullPageLoading message="Memproses pendaftaran..." />}

      <RegisterForm
        name={name}
        email={email}
        password={password}
        passwordConfirmation={passwordConfirmation}
        nik={nik}
        phoneNumber={phoneNumber}
        showPassword={showPassword}
        showPasswordConfirmation={showPasswordConfirmation}
        fieldErrors={fieldErrors}
        generalError={generalError}
        isLoading={isLoading}
        passwordStrength={passwordStrength}
        onNameChange={setName}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onPasswordConfirmationChange={setPasswordConfirmation}
        onNikChange={setNik}
        onPhoneNumberChange={setPhoneNumber}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onTogglePasswordConfirmation={() =>
          setShowPasswordConfirmation(!showPasswordConfirmation)
        }
        onSubmit={onSubmit}
      />
    </>
  );
}

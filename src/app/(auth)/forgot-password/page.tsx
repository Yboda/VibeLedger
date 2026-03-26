'use client';

import { useState } from 'react';
import ResetPassword from './_components/resetPassword';
import CheckEmail from './_components/checkEmail';

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const handleSuccess = (email: string) => {
    setSentEmail(email);
    setEmailSent(true);
  };

  if (emailSent) {
    return <CheckEmail email={sentEmail} />;
  }

  return <ResetPassword onSuccess={handleSuccess} />;
}

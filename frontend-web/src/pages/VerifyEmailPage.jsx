import { useEffect, useState } from "react";
import authAPI from "../api/authAPI";

export default function VerifyEmailPage({ onVerified }) {
  const [email, setEmail] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const [resending, setResending] = useState(false);
    const [checking, setChecking] = useState(true);

useEffect(() => {
  let active = true;

  const checkStatus = async () => {
    if (!active) return;

    const res = await authAPI.getAuthStatus();
    setChecking(false);

    if (res.email) {
      setEmail(res.email);
    }

    if (res.emailVerified === true) {
      const refreshed = await authAPI.refreshToken();
      if (refreshed.refreshed) {
        onVerified();
      }
    }
  };

  //  check immediately
  checkStatus();

  //  then poll faster
  const interval = setInterval(checkStatus, 1500);

  return () => {
    active = false;
    clearInterval(interval);
  };
}, [onVerified]);


//   const resend = async () => {
//     setResending(true);
//     setResendMsg("");

//     const res = await fetch("/api/auth/resend-verification", {
//       method: "POST",
//       credentials: "include",
//     });

//     setResendMsg(
//       res.ok
//         ? "Verification email resent. Please check your inbox."
//         : "Failed to resend email. Try again later."
//     );

//     setResending(false);
//   };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-xl font-semibold mb-4">
          Verify your email
        </h1>

        <p className="text-gray-600 mb-6">
          A verification email has been sent to{" "}
          <span className="font-medium text-gray-900">
            {email || "your email address"}
          </span>.
          <br />
          Please verify to continue.
        </p>

        {/* {resendMsg && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
            {resendMsg}
          </div>
        )}

        <button
          onClick={resend}
          disabled={resending}
          className="text-sm text-blue-600 underline"
        >
          {resending ? "Resending..." : "Didn’t receive the email? Resend"}
        </button> */}

        <div className="mt-6 text-xs text-gray-400">
          You may need to Log In again after verification in order continue.
        </div>

<button
  onClick={() => window.location.reload()}
  className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  Go to Login
</button>
      </div>
    </div>
  );
}

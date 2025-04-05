import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth/AuthContext';
// import { CredentialResponse, GoogleLogin } from '@react-oauth/google'; // Commented out GoogleLogin import

// Define the schema for login
const LoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .nonempty('Password is required'),
});

type LoginFormData = z.infer<typeof LoginSchema>;

const LoginForm: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const { login } = useAuth(); // Removed googleSignIn from destructuring

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setSuccessMessage(null);

      // Send the login request
      await login(data.email, data.password);
      navigate('/home');

      // Reset the form after successful login
      reset();
      setServerError(null);

    } catch (error: unknown) {
      reset();

      if (error instanceof Error) {
        setServerError(error.message || 'An error occurred. Please try again.');
      } else {
        setServerError('An error occurred. Please try again.');
      }
    }
  };

  // Commented out Google login-related functions
  // const onGoogleLoginSuccess = async (response: CredentialResponse) => {
  //   await googleSignIn(response);
  //   navigate('/home');
  // };

  // const onGoogleLoginFailure = () => {
  //   console.log("Google Login Failed");
  // };

  return (
    <div>
      {successMessage && <div>{successMessage}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            {...register('email')}
            type="email"
            id="email"
            placeholder="Enter your email"
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            {...register('password')}
            type="password"
            id="password"
            placeholder="Enter your password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {serverError && <div>{serverError}</div>}

        <button type="submit">Login</button>

        <div>
          <p>
            Don't have an account?{' '}
            <a href="/register">Register here</a>
          </p>
        </div>
      </form>

      {/* Commented out Google login section */}
      {/* <div></div>
      <p>Login with Google</p>
      <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} type='standard' /> */}
    </div>
  );
};

export default LoginForm;

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import logo from '../../assets/ wai-logo.svg';
import loginImage from '../../assets/images/wedTable.svg.webp';
import userService from '../../services/auth-service';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import type { AxiosError } from 'axios';


export default function AuthForm() {
  const LoginSchema = z.object({
    email: z.string().email('Invalid email address').nonempty('Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long').nonempty('Password is required'),
  });

  const RegisterSchema = z.object({
    firstPartner: z.string().nonempty('First partner name is required'),
    secondPartner: z.string().nonempty('Second partner name is required'),
    email: z.string().email('Invalid email address').nonempty('Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long').nonempty('Password is required'),
    confirmPassword: z.string().nonempty('Please confirm your password'),
  }).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords don't match",
      });
    }
  });
  
  type LoginFormData = z.infer<typeof LoginSchema>;
  type RegisterFormData = z.infer<typeof RegisterSchema>;
  

  const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const { login, googleSignIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverRegisterError, setServerRegisterError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    }
  }, [location.search]);

  useEffect(() => {
    if (location.state?.successMessage) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      navigate('/home');
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

  const onSubmitRegister = async (data: RegisterFormData) => {
    setServerRegisterError(null);
    const user = {
      firstPartner: data.firstPartner,
      secondPartner: data.secondPartner,
      email: data.email,
      password: data.password,
      avatar: "",
    };

    try {
      const { request: registerRequest } = userService.register(user);
      const registerResponse = await registerRequest;
      console.log('User registered:', registerResponse.data);
      await login(data.email, data.password);
      navigate('/home');
    } catch (error: unknown) {
      if ((error as AxiosError).response) {
        setServerRegisterError((error as AxiosError).response?.data?.message || 'An error occurred');
      } else {
        setServerRegisterError('An error occurred');
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };


  const onGoogleLoginSuccess = async (response: CredentialResponse) => {
    try {
      await googleSignIn(response);
      navigate('/home');
      setServerError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setServerError(error.message || 'Google login failed. Please try again.');
      } else {
        setServerError('Google login failed. Please try again.');
      }
    }
  };

  const onGoogleLoginFailure = () => {
    console.log("Google Login Failed");
  }

  
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authBox}>
        {isLogin ? (
          <>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.loginFormWrapper}>
              <img src={logo} alt="WAI" className={styles.logo} />
                <input className={styles.input}
                  {...register('email')}
                  type="email"
                  placeholder="Enter your email"
                />
                {errors.email && <p className={styles.error}>{errors.email.message}</p>}

                <input
                  {...register('password')}
                  type="password"
                  placeholder="Enter your password"
                />
                {errors.password && <p className={styles.error}>{errors.password.message}</p>}

                {serverError && <p className={styles.error}>{serverError}</p>}

                <button type="submit" className={styles.loginButton}>LOGIN</button>
                <p>Login with Google</p>
                <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} type='standard' />

                <p className={styles.chnageForm}>
                  Don't have an account?{' '}
                  <span className={styles.toggle} onClick={toggleForm}>
                    Sign up
                  </span>
                </p>
              </form>
            <div className={styles.imageWrapper}>
              <img src={loginImage} alt="Login visual" />
            </div>
          </>
        ) : (
          <>
            <div className={styles.imageWrapper}>
              <img src={loginImage} alt="Signup visual" />
            </div>
              <form onSubmit={handleSubmitRegister(onSubmitRegister)} className={styles.registerFormWrapper}>
              <img src={logo} alt="WAI" className={styles.logo} />
                <input
                  {...registerRegister('firstPartner')}
                  type="text"
                  placeholder="First partner name"
                />
                {errorsRegister.firstPartner && <p className={styles.error}>{errorsRegister.firstPartner.message}</p>}

                <input
                  {...registerRegister('secondPartner')}
                  type="text"
                  placeholder="Second partner name"
                />
                {errorsRegister.secondPartner && <p className={styles.error}>{errorsRegister.secondPartner.message}</p>}

                <input
                  {...registerRegister('email')}
                  type="email"
                  placeholder="Enter your email"
                />
                {errorsRegister.email && <p className={styles.error}>{errorsRegister.email.message}</p>}

                <input
                  {...registerRegister('password')}
                  type="password"
                  placeholder="Enter your password"
                />
                {errorsRegister.password && <p className={styles.error}>{errorsRegister.password.message}</p>}

                <input
                  {...registerRegister('confirmPassword')}
                  type="password"
                  placeholder="Confirm your password"
                />
                {errorsRegister.confirmPassword && <p className={styles.error}>{errorsRegister.confirmPassword.message}</p>}

                {serverRegisterError && <p className={styles.error}>{serverRegisterError}</p>}

                <button type="submit" className={styles.loginButton}>SIGNUP</button>

                <p className={styles.chnageForm}>
                  Already have an account?{' '}
                  <span className={styles.toggle} onClick={toggleForm}>
                    Login
                  </span>
                </p>
              </form>
          </>
        )}
      </div>
    </div>
  );
};

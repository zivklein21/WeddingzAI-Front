import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import userService, { User } from '../../services/auth-service';
import { AxiosError } from 'axios';

// Define the schema for registration
const RegisterSchema = z.object({
  firstPartner: z.string().nonempty('First partner name is required'),
  secondPartner: z.string().nonempty('Second partner name is required'),
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .nonempty('Password is required'),
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

type RegisterFormData = z.infer<typeof RegisterSchema>;

const RegisterForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    // Reset server error before submitting
    setServerError(null);

    const user = {
      firstPartner: data.firstPartner,
      secondPartner: data.secondPartner,
      email: data.email,
      password: data.password,
      avatar: null, // Adjust if avatar is needed in the future
    };

    try {
      // Step 1: Register the user
      const { request: registerRequest } = userService.register(user);
      const registerResponse = await registerRequest;
      console.log('User registered:', registerResponse.data);

      // Redirect to login page with success message
      navigate('/login', { state: { successMessage: 'Registered Successfully!' } });

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setServerError(error.response?.data?.message || 'An error occurred');
      } else {
        setServerError('An error occurred');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* First partner input */}
        <div>
          <label htmlFor="firstPartner">First Partner</label>
          <input
            {...register('firstPartner')}
            type="text"
            id="firstPartner"
            placeholder="Enter first partner's name"
          />
          {errors.firstPartner && <p>{errors.firstPartner.message}</p>}
        </div>

        {/* Second partner input */}
        <div>
          <label htmlFor="secondPartner">Second Partner</label>
          <input
            {...register('secondPartner')}
            type="text"
            id="secondPartner"
            placeholder="Enter second partner's name"
          />
          {errors.secondPartner && <p>{errors.secondPartner.message}</p>}
        </div>

        {/* Email input */}
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

        {/* Password input */}
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

        {/* Confirm password input */}
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit">Register</button>
        {serverError && <div>{serverError}</div>}
      </form>

      <div>
        <p>
          Already have an account?{' '}
          <a href="/ui/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;

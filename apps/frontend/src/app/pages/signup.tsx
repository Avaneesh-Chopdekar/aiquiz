import {
  Form,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Link,
} from '@heroui/react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink } from 'react-router-dom';
import EyeSlashFilledIcon from '../components/icons/eye-slashed-filled-icon';
import EyeFilledIcon from '../components/icons/eye-filled-icon';
import { useState } from 'react';

export default function Signup() {
  const passwordSchema = z
    .string()
    .min(8, { error: 'Password must be at least 8 characters long.' })
    .max(128, { error: 'Password must not exceed 128 characters.' })
    .regex(/[a-z]/, {
      error: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[A-Z]/, {
      error: 'Password must contain at least one uppercase letter.',
    })
    .regex(/\d/, { error: 'Password must contain at least one number.' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      error: 'Password must contain at least one special character.',
    });

  const signupSchema = z
    .object({
      username: z
        .string()
        .min(3, { error: 'Username must be at least 3 characters long.' })
        .max(50, { error: 'Username must not exceed 50 characters.' }),
      email: z
        .email()
        .max(50, { error: 'Email must not exceed 50 characters.' }),
      password: passwordSchema,
      confirmPassword: passwordSchema,
      role: z.enum(['STUDENT', 'TEACHER', 'ADMIN'], {
        error: 'Please select a role.',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: 'Passwords do not match.',
      path: ['confirmPassword'],
    });

  type SignupSchema = z.infer<typeof signupSchema>;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignupSchema>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'STUDENT',
    },
    resolver: zodResolver(signupSchema),
  });

  function onSubmit(data: SignupSchema) {
    console.log(data);
  }

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <main className="flex mt-4 justify-center items-center">
      <Card className="max-w-md w-full">
        <CardHeader className="font-bold">Create Account</CardHeader>
        <CardBody>
          <Form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="username"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  label="Username"
                  labelPlacement="outside"
                  placeholder="Enter your username"
                  isRequired
                  errorMessage={error?.message}
                  validationBehavior="aria"
                  isInvalid={invalid}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  label="Email"
                  labelPlacement="outside"
                  placeholder="Enter your email"
                  isRequired
                  errorMessage={error?.message}
                  validationBehavior="aria"
                  isInvalid={invalid}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  label="Password"
                  labelPlacement="outside"
                  placeholder="Enter your password"
                  isRequired
                  errorMessage={error?.message}
                  validationBehavior="aria"
                  isInvalid={invalid}
                  type={isVisible ? 'text' : 'password'}
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-solid outline-transparent"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  label="Confirm Password"
                  labelPlacement="outside"
                  placeholder="Confirm your password"
                  isRequired
                  errorMessage={error?.message}
                  validationBehavior="aria"
                  isInvalid={invalid}
                  type={isVisible ? 'text' : 'password'}
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-solid outline-transparent"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <Select
                  {...field}
                  label="Role"
                  labelPlacement="outside"
                  placeholder="Select role"
                  isRequired
                  defaultSelectedKeys={['STUDENT']}
                  errorMessage={error?.message}
                  validationBehavior="aria"
                  isInvalid={invalid}
                  disabledKeys={['ADMIN']}
                >
                  <SelectItem key="STUDENT">Student</SelectItem>
                  <SelectItem key="TEACHER">Teacher</SelectItem>
                  <SelectItem key="ADMIN">Admin</SelectItem>
                </Select>
              )}
            />

            <Checkbox isRequired>I agree to the terms and conditions</Checkbox>

            <Button type="submit" color="primary" isLoading={isSubmitting}>
              Sign up
            </Button>
          </Form>
        </CardBody>
        <Divider />
        <CardFooter>
          Already have an account?{' '}
          <Link className="ml-2" color="primary" as={RouterLink} to={'/login'}>
            Login
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

import {
  Form,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Link,
  addToast,
} from '@heroui/react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import EyeSlashFilledIcon from '../components/icons/eye-slashed-filled-icon';
import EyeFilledIcon from '../components/icons/eye-filled-icon';
import { LoginSchema, loginSchema } from '../types/auth';
import { useAuthStore } from '../store';

export default function Login() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  const { login } = useAuthStore();

  async function onSubmit(data: LoginSchema) {
    const res = await login(data.email, data.password);
    // console.table(res);
    if (res.ok) {
      navigate('/');
      addToast({
        title: 'Login successful!',
        color: 'success',
      });
    } else {
      addToast({
        title: 'Something went wrong',
        color: 'danger',
      });
    }
  }

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <main className="flex mt-4 justify-center items-center">
      <Card className="max-w-md w-full">
        <CardHeader className="font-bold">Welcome Back!</CardHeader>
        <CardBody>
          <Form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />
              )}
            />

            <Button type="submit" color="primary" isLoading={isSubmitting}>
              Login
            </Button>
          </Form>
        </CardBody>
        <Divider />
        <CardFooter>
          Don't have an account?{' '}
          <Link className="ml-2" color="primary" as={RouterLink} to={'/signup'}>
            Signup
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

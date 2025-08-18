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
  addToast,
} from '@heroui/react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import EyeSlashFilledIcon from '../components/icons/eye-slashed-filled-icon';
import EyeFilledIcon from '../components/icons/eye-filled-icon';
import { signupSchema, SignupSchema } from '../types/auth';
import { signup } from '../api/auth';

export default function Signup() {
  const navigate = useNavigate();
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

  async function onSubmit(data: SignupSchema) {
    const res = await signup({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
    });
    console.table(res);
    if (res.statusCode === 201) {
      navigate('/login');
      addToast({
        title: 'Account created successfully',
        color: 'success',
      });
    } else if (res.statusCode === 409) {
      console.log({
        title: res.message,
        color: 'danger',
      });
    } else if (res.statusCode === 500) {
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
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
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
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
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

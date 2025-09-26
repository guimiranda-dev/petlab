'use client';

import Image from 'next/image';
import { login, verifyOTP } from './actions';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { useState } from 'react';
import { InputOtp } from '@heroui/input-otp';
import { Spinner } from '@heroui/spinner';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (email) {
      try {
        setLoading(true);
        const data = await login({ email });
        setLoading(false);
        if (data.error) {
          setError(data.error.message);
        } else {
          setStep(2);
        }
      } catch (error: any) {
        setError(error?.message);
        setLoading(false);
      }
    }
  };

  const validateCode = async () => {
    if (email) {
      try {
        setLoading(true);
        const data = await verifyOTP({ email, code });
        setLoading(false);
        if (data.error) {
          setError(data.error.message);
        } else {
          router.replace('/');
        }
      } catch (error: any) {
        setError(error?.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className='bg-white'>
      <div className='grid grid-cols-1 md:grid-cols-2 min-h-screen p-4'>
        <div className='relative p-4 rounded-xl overflow-hidden'>
          <Image
            src='/assets/login-banner.jpg'
            alt='Login Banner'
            fill
            sizes='100vw'
            className='object-cover'
          />
        </div>

        <div className='flex flex-col justify-center gap-4 p-4 max-w-lg mx-auto w-full'>
          <Image
            src='/assets/logo.png'
            alt='Login Banner'
            width={200}
            height={200}
            className='object-contain self-center'
          />

          <h1 className='text-lg font-bold text-slate-800 text-center self-center'>
            Entre com o e-mail cadastrado
          </h1>
          <Input
            label='E-mail'
            type='email'
            className='w-full'
            value={email}
            disabled={step === 2}
            onChange={(v) => setEmail(v.target.value)}
          />

          {step === 2 && (
            <span className='text-sm text-slate-600 mt-4 mb-2'>
              Você recebeu um código de 6 dígitos no seu e-mail. Insira-o abaixo.
            </span>
          )}

          {step === 2 && (
            <div className='w-full flex justify-center items-center'>
              <InputOtp
                length={6}
                value={code}
                onValueChange={setCode}
                size='lg'
                variant='bordered'
                isInvalid={error !== ''}
              />
            </div>
          )}

          {error !== '' && <span className='mt-2 text-red-500 text-sm'>{error}</span>}

          {loading && (
            <div className='flex w-full items-center justify-center'>
              <Spinner size='lg' />
            </div>
          )}

          {step === 1 && !loading && (
            <Button color='primary' onPress={handleLogin}>
              Enviar código por e-mail
            </Button>
          )}

          {step === 2 && !loading && (
            <Button color='primary' onPress={validateCode}>
              Validar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal';
import { Tooltip } from '@heroui/tooltip';
import { addToast } from '@heroui/toast';
import { Spinner } from '@heroui/spinner';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { ExamInterface } from '@/types/exam';
import { ExamTypeMap } from '@/types/exam_types';

export function UploadExamButton({ exam }: { exam: ExamInterface }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const inFlight = useRef(false);

  async function handleUpload() {
    if (inFlight.current) return;
    inFlight.current = true;
    setIsPending(true);
    try {
      const response = await fetch(`/api/exams/${encodeURIComponent(exam.id)}/upload`, {
        method: 'POST',
      });
      if (response.redirected) throw new Error('Sessão expirada. Entre novamente.');
      const result = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(result?.error || 'Não foi possível enviar o exame. Tente novamente.');
      addToast({ description: 'Exame enviado com sucesso ao SimplesVet!', color: 'success' });
      setIsOpen(false);
    } catch (error) {
      addToast({
        description:
          error instanceof Error
            ? error.message
            : 'Não foi possível enviar o exame. Tente novamente.',
        color: 'danger',
      });
    } finally {
      inFlight.current = false;
      setIsPending(false);
    }
  }

  return (
    <>
      <Tooltip content='Enviar ao SimplesVet'>
        <button
          type='button'
          aria-label='Enviar exame ao SimplesVet'
          className='text-lg text-primary cursor-pointer active:opacity-50 disabled:opacity-50'
          disabled={isPending}
          onClick={() => setIsOpen(true)}
        >
          {isPending ? <Spinner size='sm' /> : <AiOutlineCloudUpload />}
        </button>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (!inFlight.current) setIsOpen(false);
        }}
        isDismissable={!isPending}
        isKeyboardDismissDisabled={isPending}
        hideCloseButton={isPending}
        backdrop='blur'
        placement='center'
      >
        <ModalContent>
          <ModalHeader>Enviar exame ao SimplesVet?</ModalHeader>
          <ModalBody>
            <p>
              O laudo de {ExamTypeMap[exam.exam_type].label} de {exam.pet.name} será gerado em PDF e
              enviado ao SimplesVet.
            </p>
            <p className='text-sm text-default-500'>
              Código do animal: {exam.pet.external_id || 'Não cadastrado'}. Tutor:{' '}
              {exam.pet.owner.name}.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant='light' isDisabled={isPending} onPress={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button color='primary' isLoading={isPending} onPress={handleUpload}>
              Confirmar envio
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

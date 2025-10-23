import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop='blur' placement='center'>
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1 mt-6'>{title}</ModalHeader>
        <ModalBody>
          <div className='flex items-start gap-3'>
            <div>
              <p className='text-sm text-gray-500'>Esta ação não pode ser desfeita.</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='default' variant='light' onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color='danger'
            onPress={() => {
              onConfirm();
              onClose();
            }}
          >
            Deletar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

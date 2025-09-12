"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import NewsletterForm from "@/app/_components/NewsletterForm";

interface NewsletterModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const NewsletterModal = ({ isOpen, onOpenChange }: NewsletterModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      size="2xl"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="text-2xl font-semibold text-center">
              Stay Connected
            </ModalHeader>
            <ModalBody className="pb-6">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-400">
                    Join our newsletter to receive updates about upcoming yoga
                    events, workshops, and classes.
                  </p>
                  <ul className="text-sm space-y-2 text-gray-500 dark:text-gray-500">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Early access to event registration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Exclusive retreat announcements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Monthly yoga insights & tips</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <NewsletterForm />
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NewsletterModal;

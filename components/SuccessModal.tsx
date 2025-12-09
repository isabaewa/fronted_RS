"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
          >

            <h2 className="text-2xl font-bold text-[#0B004B] mb-2">
              Бронирование прошло успешно!
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Спасибо за вашу бронь. Мы свяжемся с вами для подтверждения.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-[#0B004B] text-white py-2 rounded-lg hover:bg-[#120070] transition"
            >
              Отлично
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
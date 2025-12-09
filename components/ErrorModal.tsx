"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function ErrorModal({ isOpen, onClose, message }: ErrorModalProps) {
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
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-red-300"
                  >
                      
            <h2 className="text-2xl font-bold text-[#0B004B] mb-2">
              Ошибка бронирования
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {message || "Проверьте правильность заполнения полей и попробуйте снова."}
            </p>

            <button
              onClick={onClose}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Понятно
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
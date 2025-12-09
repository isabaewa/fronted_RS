import { Suspense } from 'react';
import VerifyClient from './components/VerifyClient'; // Убедитесь, что путь верный

// Дополнительно можно добавить эту строку, чтобы избежать статического рендеринга
// export const dynamic = 'force-dynamic';

export default function VerifyPageWrapper() {
  return (
    // Обертка в Suspense - обязательна для компонентов, использующих useSearchParams
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center text-white bg-[#0E0042]">
        <div className="text-center text-xl">Загрузка параметров...</div>
      </main>
    }>
      <VerifyClient />
    </Suspense>
  );
}
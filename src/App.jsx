import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./AppRoutes";
import useOfflineSync from "./hooks/useOfflineSync";
import { LanguageProvider } from "./providers/language-provider";

// 1. إعداد الـ Query Client مع إعدادات الـ Offline للـ Mutations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // الحفاظ على الكاش لمدة 24 ساعة
      staleTime: 1000 * 60 * 5, // البيانات تعتبر طازجة لمدة 5 دقائق
      networkMode: "offlineFirst", // أهم خاصية: خليه يقرا الكاش الأول حتى لو مفيش نت
    },
    mutations: {
      networkMode: "offlineFirst", // عشان يسمح بالـ Mutation تشتغل وتتحط في الطابور وأنت أوفلاين
    },
  },
});

// 2. عمل الـ Persister باستخدام IndexedDB
const idbPersister = {
  persistClient: async (client) => {
    await set("reactQueryClientCache", client);
  },
  restoreClient: async () => {
    return await get("reactQueryClientCache");
  },
  removeClient: async () => {
    await del("reactQueryClientCache");
  },
};

function OfflineSyncInitializer() {
  useOfflineSync();
  return null;
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: idbPersister,
          maxAge: 1000 * 60 * 60 * 24, // 24 hours
        }}>
        <OfflineSyncInitializer />
        <LanguageProvider>
          <AppRoutes />
        </LanguageProvider>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
        <Toaster
          position="top-center"
          gutter={12}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            duration: 4000,
          }}
        />
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

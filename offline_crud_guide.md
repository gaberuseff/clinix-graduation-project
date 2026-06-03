# دليل تصميم وتنفيذ نظام العمليات الموفّرة للإنترنت (Offline-First CRUD) باستخدام React Query و IndexedDB

يوضح هذا الدليل بالتفصيل البنية الفنية البرمجية التي قمنا ببنائها لتوفير نظام إدارة بيانات (إضافة، تعديل، حذف) يدعم العمل بشكل كامل دون اتصال بالإنترنت (Offline)، ثم يقوم بمزامنة العمليات تلقائياً فور عودة الاتصال، وذلك للحفاظ على استقرار النظام وسرعة استجابة واجهة المستخدم.

---

## 1. ما هي التقنيات الأساسية المستخدمة؟
1. **React Query (`@tanstack/react-query`)**: لإدارة الكاش في الواجهة الأمامية وتحديث البيانات تلقائياً.
2. **IndexedDB (عبر مكتبة `idb-keyval`)**: مكتبة خفيفة وسريعة لتخزين طابور العمليات (Mutation Queue) بشكل دائم في المتصفح حتى لو تم إغلاقه أو إعادة تحميله.

> **لماذا اخترنا IndexedDB وليس localStorage؟**
> - **غير متزامن (Asynchronous)**: لا يسبب جموداً في الصفحة أثناء القراءة والكتابة.
> - **سعة تخزينية أكبر بكثير**: الـ localStorage محدود بـ 5MB فقط.
> - **حفظ الكائنات مباشرة**: يحفظ الـ Objects والمصفوفات مباشرة دون الحاجة لـ `JSON.stringify` و `JSON.parse`.

### تثبيت مكتبة التخزين:
لتثبيت المكتبة في أي مشروع جديد، قم بتشغيل الأمر التالي:
```bash
npm install idb-keyval
```

---

## 2. الخطوة الأولى: بناء مدير التزامن وطابور العمليات (Offline Queue Manager)
نقوم بإنشاء ملف خدمات لتخزين العمليات محلياً ومزامنتها بالتسلسل لحماية ترابط البيانات (مثلاً: لا يجب تشغيل تعديل المريض قبل انتهاء عملية إضافته).

قم بإنشاء ملف `src/services/offlineSync.js`:
```javascript
import { get, set } from "idb-keyval";
import { createPatient, updatePatient, deletePatient } from "./apiPatients";

const QUEUE_KEY = "offlinePatientActions";

// جلب طابور العمليات المخزن محلياً
export async function getOfflineQueue() {
  const queue = await get(QUEUE_KEY);
  return queue || [];
}

// إضافة عملية جديدة إلى الطابور
export async function addToOfflineQueue(action) {
  const queue = await getOfflineQueue();
  queue.push({
    id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    ...action,
  });
  await set(QUEUE_KEY, queue);
}

// حذف عملية من الطابور بعد نجاح تزامنها
export async function removeFromOfflineQueue(actionId) {
  const queue = await getOfflineQueue();
  const updated = queue.filter((item) => item.id !== actionId);
  await set(QUEUE_KEY, updated);
}

// تشغيل التزامن الخلفي لجميع العمليات المعلقة
export async function syncOfflineActions(queryClient) {
  const queue = await getOfflineQueue();
  if (queue.length === 0) return;

  // خريطة لربط المعرفات المؤقتة بالمعرفات الحقيقية من قاعدة البيانات
  const idMap = {};

  for (const action of queue) {
    try {
      const { type, patientData, patientId } = action;
      
      // إذا كان للمريض معرف مؤقت وتمت مزامنته وحصل على معرف حقيقي، نستخدم الحقيقي
      const resolvedPatientId = idMap[patientId] || patientId;

      if (type === "CREATE") {
        const dataToInsert = { ...patientData };
        // إزالة المعرف المؤقت قبل الإرسال لـ Supabase ليقوم بتوليد معرف حقيقي تلقائياً
        if (dataToInsert.id && String(dataToInsert.id).startsWith("temp-")) {
          delete dataToInsert.id;
        }

        const newPatient = await createPatient(dataToInsert);
        // حفظ العلاقة بين المعرف المؤقت والمعرف الحقيقي الجديد
        if (patientId && String(patientId).startsWith("temp-")) {
          idMap[patientId] = newPatient.id;
        }
      } 
      else if (type === "UPDATE") {
        const updatedFields = { ...patientData };
        if (updatedFields.id) delete updatedFields.id;

        await updatePatient({ id: resolvedPatientId, updatedFields });
      } 
      else if (type === "DELETE") {
        await deletePatient({ id: resolvedPatientId });
      }

      // إزالة العملية بنجاح من الطابور المحلي
      await removeFromOfflineQueue(action.id);
    } catch (error) {
      console.error("فشل تزامن العملية المعلقة:", action, error);
      // إيقاف المعالجة فوراً لتفادي تداخل البيانات (مثل تعديل مريض فشلت عملية إضافته)
      break;
    }
  }

  // تحديث الكاش بالبيانات الصحيحة والحديثة من قاعدة البيانات
  queryClient.invalidateQueries({ queryKey: ["patients"] });
}
```

---

## 3. الخطوة الثانية: الاستماع التلقائي لحالة الشبكة (Network Monitor Hook)
نقوم بإنشاء Hook للاستماع لحدث العودة للإنترنت ومزامنة البيانات في الخلفية بدون تدخل المستخدم.

قم بإنشاء ملف `src/hooks/useOfflineSync.js`:
```javascript
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getOfflineQueue, syncOfflineActions } from "@/services/offlineSync";
import { toast } from "react-hot-toast";

export default function useOfflineSync() {
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    async function checkAndSync() {
      if (!navigator.onLine) return;
      const queue = await getOfflineQueue();
      if (queue.length === 0) return;

      setIsSyncing(true);
      toast.loading("جاري مزامنة العمليات المحلية...", { id: "offline-sync" });

      try {
        await syncOfflineActions(queryClient);

        const remainingQueue = await getOfflineQueue();
        if (remainingQueue.length === 0) {
          toast.success("تم مزامنة جميع البيانات بنجاح!", { id: "offline-sync" });
        } else {
          toast.error("فشلت مزامنة بعض العمليات، سيتم المحاولة لاحقاً.", { id: "offline-sync" });
        }
      } catch (err) {
        console.error("خطأ في المزامنة:", err);
        toast.error("فشلت عملية المزامنة التلقائية.", { id: "offline-sync" });
      } finally {
        setIsSyncing(false);
      }
    }

    // فحص المزامنة عند فتح التطبيق
    checkAndSync();

    // الاستماع لحدث العودة للإنترنت
    const handleOnline = () => checkAndSync();
    window.addEventListener("online", handleOnline);

    return () => window.removeEventListener("online", handleOnline);
  }, [queryClient]);

  return { isSyncing };
}
```

### تفعيل الـ Hook في جذر التطبيق:
في ملف `src/App.jsx` قم باستدعاء الـ Hook داخل مكون يقع تحت الـ `QueryClientProvider` لضمان عمله طوال وقت تشغيل التطبيق:

```javascript
import useOfflineSync from "./hooks/useOfflineSync";

function OfflineSyncInitializer() {
  useOfflineSync();
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OfflineSyncInitializer />
      <AppRoutes />
    </QueryClientProvider>
  );
}
```

---

## 4. الخطوة الثالثة: صياغة دوال الـ CRUD التفاعلية (Optimistic Offline Mutations)

لكي تكون التجربة سلسة، نستخدم تقنية **التحديث التفاؤلي (Optimistic Updates)**، حيث نقوم بتحديث كاش React Query محلياً فوراً وكأن العملية نجحت، ثم نرسلها في الخلفية.

كما نستخدم `mutateAsync` مع محاولة صيد الأخطاء `try/catch` لضمان التقاط أي فشل في الشبكة حتى لو كانت خاصية `navigator.onLine` ترجع `true`.

### أ. الإضافة (Create)
في ملف `src/features/patients/useCreatePatient.js`:
```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPatient as createPatientApi } from "@/services/apiPatients";
import { toast } from "react-hot-toast";
import { addToOfflineQueue } from "@/services/offlineSync";

function useCreatePatient() {
  const queryClient = useQueryClient();

  const { mutateAsync: createPatientMutation, isPending: isCreating } = useMutation({
    mutationFn: createPatientApi,
    onSuccess: () => {
      toast.success("تم إضافة المريض بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  async function createPatient(newPatient, options = {}) {
    const performOfflineCreate = async () => {
      const tempId = `temp-${Date.now()}`;
      const offlinePatient = {
        id: tempId,
        is_active: true,
        ...newPatient,
      };

      // 1. الحفظ في الطابور المحلي لـ IndexedDB
      await addToOfflineQueue({
        type: "CREATE",
        patientId: tempId,
        patientData: newPatient,
      });

      // 2. تحديث الكاش التفاؤلي الفوري بالواجهة
      queryClient.setQueriesData({ queryKey: ["patients"] }, (old) => {
        return old ? [offlinePatient, ...old] : [offlinePatient];
      });

      toast.success("حفظ محلي: تم حفظ المريض محلياً، سيتم المزامنة عند توفر الإنترنت.", {
        id: "create_patient_offline",
      });

      if (options.onSuccess) options.onSuccess(offlinePatient);
    };

    if (!navigator.onLine) {
      await performOfflineCreate();
      return;
    }

    try {
      const data = await createPatientMutation(newPatient);
      if (options.onSuccess) options.onSuccess(data);
    } catch (err) {
      // إذا فشل نتيجة انقطاع الشبكة، تحول للعمل المحلى
      const isNetworkError = !navigator.onLine || err.message?.includes("Failed to fetch") || err.message?.includes("network");
      if (isNetworkError) {
        await performOfflineCreate();
      } else {
        toast.error(err.message || "فشلت إضافة المريض");
      }
    }
  }

  return { createPatient, isCreating };
}
```

---

### ب. التعديل (Update)
في ملف `src/features/patients/useUpdatePatient.js`:
```javascript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePatient as updatePatientApi } from "@/services/apiPatients";
import { toast } from "react-hot-toast";
import { addToOfflineQueue } from "@/services/offlineSync";

function useUpdatePatient() {
  const queryClient = useQueryClient();

  const { mutateAsync: updatePatientMutation, isPending: isUpdating } = useMutation({
    mutationFn: updatePatientApi,
    onSuccess: () => {
      toast.success("تم تحديث بيانات المريض بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  async function updatePatient({ id, updatedFields }, options = {}) {
    const performOfflineUpdate = async () => {
      // 1. الحفظ في طابور التعديل المحلي
      await addToOfflineQueue({
        type: "UPDATE",
        patientId: id,
        patientData: updatedFields,
      });

      // 2. تحديث بيانات المريض في كاش المتصفح فوراً
      queryClient.setQueriesData({ queryKey: ["patients"] }, (old) => {
        if (!old) return old;
        return old.map((patient) =>
          patient.id === id ? { ...patient, ...updatedFields } : patient
        );
      });

      toast.success("حفظ محلي: تم تحديث البيانات محلياً وسيتم المزامنة لاحقاً.", {
        id: "update_patient_offline",
      });

      if (options.onSuccess) options.onSuccess();
    };

    if (!navigator.onLine) {
      await performOfflineUpdate();
      return;
    }

    try {
      await updatePatientMutation({ id, updatedFields });
      if (options.onSuccess) options.onSuccess();
    } catch (err) {
      const isNetworkError = !navigator.onLine || err.message?.includes("Failed to fetch") || err.message?.includes("network");
      if (isNetworkError) {
        await performOfflineUpdate();
      } else {
        toast.error(err.message || "فشل تحديث البيانات");
      }
    }
  }

  return { updatePatient, isUpdating };
}
```

---

### ج. الحذف (Delete)
في ملف `src/features/patients/useDeletePatient.js`:
```javascript
import { deletePatient as deletePatientApi } from "@/services/apiPatients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addToOfflineQueue } from "@/services/offlineSync";

function useDeletePatient() {
  const queryClient = useQueryClient();

  const { mutateAsync: deletePatientMutation, isPending: isDeletingPatient } = useMutation({
    mutationFn: deletePatientApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("تم حذف المريض بنجاح!");
    },
  });

  async function deletePatient({ id }, options = {}) {
    const performOfflineDelete = async () => {
      // 1. إضافة العملية لطابور الحذف المحلي
      await addToOfflineQueue({
        type: "DELETE",
        patientId: id,
      });

      // 2. إزالة المريض فوراً من القائمة المحلية المعروضة للمستخدم
      queryClient.setQueriesData({ queryKey: ["patients"] }, (old) => {
        if (!old) return old;
        return old.filter((patient) => patient.id !== id);
      });

      toast.success("حفظ محلي: تم حذف المريض محلياً وسيتم التزامن مع السيرفر لاحقاً.", {
        id: "delete_patient_offline",
      });

      if (options.onSuccess) options.onSuccess();
    };

    if (!navigator.onLine) {
      await performOfflineDelete();
      return;
    }

    try {
      await deletePatientMutation({ id });
      if (options.onSuccess) options.onSuccess();
    } catch (err) {
      const isNetworkError = !navigator.onLine || err.message?.includes("Failed to fetch") || err.message?.includes("network");
      if (isNetworkError) {
        await performOfflineDelete();
      } else {
        toast.error(err.message || "فشلت عملية الحذف");
      }
    }
  }

  return { deletePatientMutation: deletePatient, isDeletingPatient };
}
```

---

## 5. الخلاصة والقواعد الذهبية لتطبيقها في مشاريع أخرى:
1. **استخدم مفتاح كاش عام للواجهات التفاؤلية**: تجنب استخدام مفاتيح فرعية تعتمد على قيم قد يتم تحميلها متأخراً (مثل معرف العيادة أو قيم البحث) عند تحديث الكاش عبر `setQueriesData`. يفضل استهداف المفتاح الأب الرئيسي مثل `["patients"]`.
2. **افصل كود قاعدة البيانات عن الكود المحلي**: اجعل دوال API (مثل الدوال داخل `apiPatients.js`) نقية وبسيطة ومستقلة فقط لإجراء الاتصال بقاعدة البيانات، وضع منطق فحص حالة الاتصال والطابور والكاش داخل الـ React Hooks المخصصة لسهولة الصيانة وإعادة الاستخدام.
3. **التسلسل في طابور المزامنة**: المزامنة يجب أن تكون خطوة تلو خطوة للتأكد من ربط المعرفات الناتجة حديثاً من السيرفر بالعمليات التي تليها.

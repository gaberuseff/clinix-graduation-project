# دليل نظام الترجمة (i18n) في مشروع Clinix

هذا المستند يشرح بالتفصيل كيفية إعداد وتشغيل نظام الترجمة داخل المشروع، والملفات المعنية بكتابة وإدارة الترجمات، وتدفق البيانات (Workflow) من البداية وحتى تغيير اللغة وحفظها.

---

## 1. المكتبات المستخدمة (Packages)
يعتمد المشروع على المكتبات التالية لخدمة الترجمة:
- **`i18next`**: المكتبة الأساسية لإدارة الترجمات وحالة اللغة.
- **`react-i18next`**: مكتبة الربط (Bindings) مع React لتوفير Hooks ومكونات تسهل الترجمة داخل مكونات React.

---

## 2. هيكل ملفات الترجمة (File Structure)
توجد ملفات الترجمة والتهيئة في المجلد `src/i18n/` كالتالي:

```text
src/
├── i18n/
│   ├── en/
│   │   └── patients.json        # ملف الترجمات باللغة الإنجليزية لموديل المرضى
│   ├── ar/
│   │   └── patients.json        # ملف الترجمات باللغة العربية لموديل المرضى
│   ├── index.js                  # ملف تهيئة وإعداد i18next (Configuration)
│   └── use-app-translation.js    # Custom Hook لتسهيل استدعاء الترجمة في المكونات
```

---

## 3. شرح تدفق العمل (Workflow Steps)

### الخطوة الأولى: ملف الإعداد وتهيئة اللغة (`src/i18n/index.js`)
في هذا الملف نقوم بـ:
1. استيراد ملفات الترجمة الخاصة بكل لغة (مثل ملفات الـ `json`).
2. تحديد اللغة النشطة بالترتيب التالي:
   - التحقق من وجود لغة محفوظة مسبقاً في متصفح المستخدم عبر الـ `localStorage` بالاسم `"language"`.
   - إذا لم يجد لغة محفوظة، يتم استخدام اللغة الإنجليزية `"en"` كحالة افتراضية.
3. تهيئة `i18n` وتمرير الترجمات والمفتاح الافتراضي.

**كود التهيئة الحالي:**
```javascript
const savedLanguage = typeof window !== "undefined" ? localStorage.getItem("language") || "en" : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { patients: patientsEn },
    ar: { patients: patientsAr },
  },
  lng: savedLanguage, // تحديد اللغة البدئية من الـ localStorage
  fallbackLng: "en",  // اللغة الاحتياطية في حال تعثر العثور على ترجمة
  interpolation: {
    escapeValue: false,
  },
});
```

---

### الخطوة الثانية: تشغيل نظام الترجمة مع انطلاق التطبيق (`src/main.jsx`)
لكي يعمل نظام الترجمة بمجرد فتح الموقع، نقوم باستيراد ملف الإعداد مباشرة في نقطة دخول التطبيق الرئيسية `src/main.jsx`:
```javascript
import "./i18n"; // تهيئة واستدعاء الإعدادات فوراً
```

---

### الخطوة الثالثة: مزامنة اتجاه الصفحة واللغة في المتصفح (`src/providers/language-provider.jsx`)
لدينا مكون يُدعى `LanguageProvider` يغلف التطبيق، وظيفته مراقبة اللغة النشطة وتحديث خصائص الـ `HTML` تلقائياً لتدعم الاتجاه الصحيح:
- **العربية (`ar`)**: يغير اتجاه الصفحة إلى `rtl` (Right to Left) ويضع `lang="ar"`.
- **الإنجليزية (`en`)**: يغير اتجاه الصفحة إلى `ltr` (Left to Right) ويضع `lang="en"`.

```javascript
useEffect(() => {
  document.documentElement.lang = i18n.language;
  document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
}, [i18n.language]);
```

---

### الخطوة الرابعة: تبديل اللغة وحفظها (`LanguageSwitcher.jsx`)
عندما يرغب المستخدم في تغيير اللغة، يتم استدعاء مكون `LanguageSwitcher` الذي يقوم بـ:
1. حفظ اللغة المحددة في الـ `localStorage` عبر `localStorage.setItem("language", language)`.
2. تغيير لغة الواجهة الحالية فوراً باستخدام `i18n.changeLanguage(language)`.

```javascript
const changeLanguage = (language) => {
  localStorage.setItem("language", language); // للحفظ الدائم
  i18n.changeLanguage(language);             // للتغيير اللحظي في الواجهة
};
```

---

### الخطوة الخامسة: استخدام الترجمات داخل المكونات (`useAppTranslation`)
لتسهيل استخدام الترجمة وتجنب كتابة استدعاءات طويلة، تم عمل كاستم هوك `useAppTranslation` في ملف `use-app-translation.js`:

```javascript
import { useTranslation } from "react-i18next";

export const useAppTranslation = (namespace) => {
  return useTranslation(namespace); // namespace هو اسم ملف الترجمة مثل "patients"
};
```

**مثال على الاستخدام العملي في مكون `PatientsLayout.jsx`:**
```javascript
import { useAppTranslation } from "@/i18n/use-app-translation";

function PatientsLayout() {
  const { t } = useAppTranslation("patients"); // تحديد ملف patients.json

  return (
    <h1>{t("title")}</h1> // سيتم عرض "Patients" بالإنجليزية أو "المرضى" بالعربية
  );
}
```

---

## 4. ملخص سريع لكيفية إضافة ترجمات جديدة
إذا أردت إضافة ترجمة لصفحة جديدة (مثلاً صفحة الإعدادات `settings`):
1. قم بإنشاء ملف `settings.json` داخل مجلد `src/i18n/en/` واكتب فيه النصوص بالإنجليزية.
2. قم بإنشاء ملف `settings.json` داخل مجلد `src/i18n/ar/` واكتب فيه النصوص بالعربية.
3. قم باستيراد الملفين داخل `src/i18n/index.js` وضعهما في الـ `resources` تحت المفتاح المناسب:
   ```javascript
   import settingsEn from "./en/settings.json";
   import settingsAr from "./ar/settings.json";
   
   // داخل init:
   resources: {
     en: {
       patients: patientsEn,
       settings: settingsEn,
     },
     ar: {
       patients: patientsAr,
       settings: settingsAr,
     }
   }
   ```
4. في أي مكون خاص بالإعدادات، استدعِ الترجمة كالتالي:
   ```javascript
   const { t } = useAppTranslation("settings");
   return <p>{t("your_key")}</p>;
   ```

import {MenuToggle} from "@/components/menu-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/sheet";
import {Button, buttonVariants} from "@/components/ui/button";
import useUser from "@/features/auth/useUser";
import React from "react";
import {Link} from "react-router-dom";
import {PATHS} from "@/config/paths";
import {useAppTranslation} from "@/i18n/use-app-translation";
import {Languages} from "lucide-react";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const {isAuthenticated, isPending, role} = useUser();
  const {i18n} = useAppTranslation();
  const isAr = i18n.language === "ar";

  const dashboardPath = role === "secretary" ? PATHS.secretary.dashboard : PATHS.doctor.dashboard;

  const toggleLanguage = () => {
    const nextLang = isAr ? "en" : "ar";
    localStorage.setItem("language", nextLang);
    i18n.changeLanguage(nextLang);
  };

  const links = [
    {
      label: isAr ? "الرئيسية" : "Home",
      href: "/#hero",
    },
    {
      label: isAr ? "الميزات" : "Features",
      href: "/#features",
    },
    {
      label: isAr ? "أوفلاين أولاً" : "Offline Support",
      href: "/#about",
    },
  ];

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <p className="text-xl font-extrabold tracking-tight text-foreground">
            {isAr ? "عيان" : "Eyan"}
            <span className="text-sky-600">.</span>
          </p>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              className={buttonVariants({variant: "ghost", className: "text-sm font-medium hover:text-sky-600 transition-colors"})}
              href={link.href}>
              {link.label}
            </a>
          ))}
          
          <div className="h-4 w-px bg-border/65 mx-2" />

          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 rounded-xl hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-xs font-semibold cursor-pointer">
            <Languages className="size-4" />
            <span>{isAr ? "English" : "العربية"}</span>
          </Button>

          <div className="h-4 w-px bg-border/65 mx-2" />

          {!isPending &&
            (isAuthenticated ? (
              <Link to={dashboardPath}>
                <Button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl">
                  {isAr ? "لوحة التحكم" : "Dashboard"}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="rounded-xl font-medium">
                    {isAr ? "تسجيل الدخول" : "Sign In"}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl">
                    {isAr ? "انضم إلينا" : "Get Started"}
                  </Button>
                </Link>
              </>
            ))}
        </div>

        {/* Mobile Menu Toggle */}
        <Sheet open={open} onOpenChange={setOpen}>
          <Button size="icon" variant="outline" className="lg:hidden rounded-xl">
            <MenuToggle
              strokeWidth={2.5}
              open={open}
              onOpenChange={setOpen}
              className="size-5"
            />
          </Button>
          <SheetContent
            className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg"
            showClose={false}
            side="left">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Mobile navigation links for Eyan portal.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
              {links.map((link) => (
                <a
                  key={link.href}
                  className={buttonVariants({
                    variant: "ghost",
                    className: "justify-start text-base font-semibold",
                  })}
                  href={link.href}
                  onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              ))}
              
              {/* Mobile Language Switcher */}
              <button
                onClick={() => {
                  toggleLanguage();
                  setOpen(false);
                }}
                className={buttonVariants({
                  variant: "ghost",
                  className: "justify-start text-base font-semibold text-primary gap-2",
                })}>
                <Languages className="size-5" />
                <span>{isAr ? "English" : "العربية"}</span>
              </button>
            </div>
            <SheetFooter className="flex-col gap-2 p-4 pt-0">
              {!isPending &&
                (isAuthenticated ? (
                  <Link
                    to={dashboardPath}
                    onClick={() => setOpen(false)}
                    className="w-full">
                    <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl">
                      {isAr ? "لوحة التحكم" : "Dashboard"}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="w-full">
                      <Button variant="outline" className="w-full rounded-xl">
                        {isAr ? "تسجيل الدخول" : "Sign In"}
                      </Button>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="w-full">
                      <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl">
                        {isAr ? "انضم إلينا" : "Get Started"}
                      </Button>
                    </Link>
                  </>
                ))}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

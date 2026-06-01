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

export function Header() {
  const [open, setOpen] = React.useState(false);
  const {isAuthenticated, isPending} = useUser();

  const links = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ];

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-lg">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <p className="text-lg font-bold">
            Clinix
            <span className="text-primary">.</span>
          </p>
        </Link>
        <div className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              className={buttonVariants({variant: "ghost"})}
              to={link.href}>
              {link.label}
            </Link>
          ))}
          {!isPending &&
            (isAuthenticated ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            ))}
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <Button size="icon" variant="outline" className="lg:hidden">
            <MenuToggle
              strokeWidth={2.5}
              open={open}
              onOpenChange={setOpen}
              className="size-6"
            />
          </Button>
          <SheetContent
            className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg"
            showClose={false}
            side="left">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Mobile navigation links for Clinix dashboard and portal.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  className={buttonVariants({
                    variant: "ghost",
                    className: "justify-start",
                  })}
                  to={link.href}
                  onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>
            <SheetFooter className="flex-col gap-2 p-4 pt-0">
              {!isPending &&
                (isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="w-full">
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="w-full">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="w-full">
                      <Button className="w-full">Get Started</Button>
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

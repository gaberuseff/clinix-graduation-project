import {useNavigate} from "react-router-dom";
import {RiArrowRightLine, RiHome4Line} from "@remixicon/react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      <main className="max-w-2xl w-full mx-auto my-auto py-12 md:py-20 text-left space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 text-primary font-sans text-xs font-semibold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Page not found</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-heading font-semibold tracking-tight text-foreground leading-tight">
          Sorry, we couldn't find this page.
        </h1>

        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg font-normal">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable. Let's get you back on track.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground rounded-full text-sm font-semibold transition-all active:scale-95 duration-200 cursor-pointer">
            <span>Go Back</span>
            <RiArrowRightLine className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default NotFound;

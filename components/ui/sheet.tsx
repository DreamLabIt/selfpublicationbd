"use client";

import * as React from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";


const SheetContext = React.createContext<{
  isOpen: boolean;
  onClose: () => void;
  setOpen: (open: boolean) => void;
  side: "left" | "right" | "top" | "bottom";
} | null>(null);

function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be wrapped within a <Sheet />");
  }
  return context;
}

interface SheetProps {
  isOpen?: boolean;
  onClose?: () => void;
  side?: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
}

export function Sheet({ isOpen: controlledOpen, onClose: controlledClose, side = "right", children }: SheetProps) {
  const [localOpen, setLocalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : localOpen;

  const onClose = React.useCallback(() => {
    if (controlledClose) {
      controlledClose();
    } else {
      setLocalOpen(false);
    }
  }, [controlledClose]);

  const setOpen = React.useCallback((open: boolean) => {
    if (!isControlled) {
      setLocalOpen(open);
    }
  }, [isControlled]);

  return (
    <SheetContext.Provider value={{ isOpen, onClose, setOpen, side }}>
      {children}
    </SheetContext.Provider>
  );
}

interface SheetTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export function SheetTrigger({ asChild, children }: SheetTriggerProps) {
  const { setOpen } = useSheet();

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: React.MouseEventHandler<HTMLElement> }>;

    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        if (child.props.onClick) {
          child.props.onClick(e);
        }
        setOpen(true);
      },
    });
  }

  return (
    <button type="button" onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function SheetContent({ className, children, ...props }: SheetContentProps) {
  const { isOpen, onClose, side } = useSheet();

  const sideClasses = {
    right: "right-0 h-full w-full max-w-md border-l",
    left: "left-0 h-full w-full max-w-md border-r",
    top: "top-0 left-0 w-full h-1/3 border-b",
    bottom: "bottom-0 left-0 w-full h-1/3 border-t",
  };

  const transitionClasses = {
    right: {
      enterFrom: "translate-x-full",
      enterTo: "translate-x-0",
      leaveFrom: "translate-x-0",
      leaveTo: "translate-x-full",
    },
    left: {
      enterFrom: "-translate-x-full",
      enterTo: "translate-x-0",
      leaveFrom: "translate-x-0",
      leaveTo: "-translate-x-full",
    },
    top: {
      enterFrom: "-translate-y-full",
      enterTo: "translate-y-0",
      leaveFrom: "translate-y-0",
      leaveTo: "-translate-y-full",
    },
    bottom: {
      enterFrom: "translate-y-full",
      enterTo: "translate-y-0",
      leaveFrom: "translate-y-0",
      leaveTo: "translate-y-full",
    },
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop overlay */}
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden flex">
            <TransitionChild
              as={React.Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom={transitionClasses[side].enterFrom}
              enterTo={transitionClasses[side].enterTo}
              leave="transform transition ease-in-out duration-200"
              leaveFrom={transitionClasses[side].leaveFrom}
              leaveTo={transitionClasses[side].leaveTo}
            >
              <DialogPanel
                className={cn(
                  "pointer-events-auto relative w-screen bg-white shadow-xl flex flex-col focus:outline-none",
                  sideClasses[side],
                  className
                )}
                {...props}
              >
                {/* Close Button */}
                <div className="absolute right-4 top-4 z-50">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md text-slate-400 hover:text-slate-500 focus:outline-none p-1"
                  >
                    <span className="sr-only">Close panel</span>
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold text-slate-950", className)}
      {...props}
    />
  );
}

export function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-slate-500", className)}
      {...props}
    />
  );
}
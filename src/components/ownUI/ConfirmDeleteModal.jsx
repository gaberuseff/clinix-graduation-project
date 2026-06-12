import React from "react";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {RiAlertLine} from "@remixicon/react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import {useAppTranslation} from "@/i18n/use-app-translation";

function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = "",
  isDeleting = false,
}) {
  const {t} = useAppTranslation("patients");

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      dismissible={!isDeleting}>
      <DrawerContent className="max-w-md mx-auto">
        <div className="mx-auto w-full p-6 pb-8 flex flex-col gap-6">
          {/* Header with Alert Icon */}
          <div className="flex gap-4 items-start text-left">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
              <RiAlertLine className="size-5" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <DrawerTitle className="text-lg font-bold tracking-tight text-foreground">
                {title}
              </DrawerTitle>
              <DrawerDescription className="text-sm text-muted-foreground leading-relaxed">
                {description}
                {itemName && (
                  <span className="font-semibold text-foreground block mt-1.5 break-all">
                    "{itemName}"
                  </span>
                )}
              </DrawerDescription>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1">
              {t("buttons.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-2">
              {isDeleting && <Spinner className="size-4" />}
              <span>{t("buttons.delete")}</span>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ConfirmDeleteModal;

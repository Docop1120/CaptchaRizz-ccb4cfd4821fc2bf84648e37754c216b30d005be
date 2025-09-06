import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

type Props = {
  url: string;              // e.g. "http://localhost:5000"
  title?: string;           // modal title
  children: React.ReactNode; // your existing <Button> as the trigger
};

export function OtherSiteWidget({ url, title = "Widget", children }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[85vh] p-0">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>
        {/* iframe fills the modal */}
        <div className="h-[calc(85vh-3rem)]">
          <iframe
            src={url}
            className="w-full h-full"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
            allow="clipboard-read; clipboard-write; fullscreen; geolocation; camera; microphone"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { ArrowUpRight, InfoIcon, ShieldIcon } from "lucide-react";
import Link from "next/link";

export function EmailAliasMessage() {
  return (
    <div className="bg-muted/50 px-5 py-3 border rounded-md flex gap-4">
      <ShieldIcon size={16} className="mt-0.5" />
      <div className="flex flex-col gap-1">
        <small className="text-sm text-secondary-foreground">
          <strong>Protect your privacy</strong> by using an email alias. See more Awesome Privacy tips.
        </small>
        <div>
          <Link
            href="https://awesome-privacy.xyz/communication/mail-forwarding"
            target="_blank"
            className="text-primary/50 hover:text-primary flex items-center text-sm gap-1"
          >
            Learn more <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

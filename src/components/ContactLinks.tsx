"use client";

import { useId } from "react";
import { FileText, Linkedin, Mail } from "lucide-react";
import { CONTACT_EMAIL, LINKEDIN_URL, RESUME_URL } from "@/lib/contact";
import { cn } from "@/lib/utils";

export default function ContactLinks({ includeEmail = true, placement = "above" }: {
    includeEmail?: boolean;
    placement?: "above" | "below";
}) {
    const id = useId();
    const links = [
        ...(includeEmail ? [{ label: `Email ${CONTACT_EMAIL}`, href: `mailto:${CONTACT_EMAIL}`, Icon: Mail, external: false }] : []),
        { label: "LinkedIn Profile", href: LINKEDIN_URL, Icon: Linkedin, external: true },
        { label: "View Master Resume / CV", href: RESUME_URL, Icon: FileText, external: true },
    ];

    return (
        <div className="flex shrink-0 items-center gap-1">
            {links.map(({ label, href, Icon, external }, index) => (
                <div key={href} className="group/contact relative">
                    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
                        aria-label={external ? `${label} (opens in a new tab)` : label}
                        aria-describedby={`${id}-${index}`}
                        className={cn("flex h-11 items-center justify-center rounded-full bg-surface text-muted-foreground transition-colors duration-150 hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60", href === RESUME_URL ? "gap-2 px-3" : "w-11")}>
                        <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                        {href === RESUME_URL && <span className="text-xs font-medium">Resume</span>}
                    </a>
                    <span id={`${id}-${index}`} role="tooltip"
                        className={cn("pointer-events-none invisible absolute z-50 whitespace-nowrap rounded-md bg-foreground px-3 py-2 text-[11px] leading-none text-background opacity-0 shadow-elevation transition-[opacity,translate,visibility] duration-150 group-hover/contact:visible group-hover/contact:translate-y-0 group-hover/contact:opacity-100 group-focus-within/contact:visible group-focus-within/contact:translate-y-0 group-focus-within/contact:opacity-100 motion-reduce:transition-none",
                            placement === "below" ? "right-0 top-full mt-2 -translate-y-1" : "bottom-full left-0 mb-2 translate-y-1")}>
                        {label}
                    </span>
                </div>
            ))}
        </div>
    );
}

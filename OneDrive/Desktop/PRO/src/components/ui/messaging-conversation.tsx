"use client";

import {
    Copy,
    Flag,
    MoreHorizontal,
    MoreVertical,
    Reply,
    Trash2,
    UserMinus2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type StatusType = "online" | "dnd" | "offline";

const STATUS_COLORS: Record<StatusType, string> = {
    online: "bg-green-500",
    dnd: "bg-red-500",
    offline: "bg-gray-400",
};

export function StatusBadge({ status }: { status: StatusType }) {
    return (
        <span
            aria-label={status}
            className={cn(
                "inline-block size-3 rounded-full border-2 border-background",
                STATUS_COLORS[status]
            )}
            title={status.charAt(0).toUpperCase() + status.slice(1)}
        />
    );
}

// User actions menu (for conversation header — block, delete, report)
export function UserActionsMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-label="User actions"
                    className="border-muted-foreground/30"
                    size="icon"
                    type="button"
                    variant="outline"
                >
                    <MoreVertical
                        aria-hidden="true"
                        className="size-4"
                        focusable="false"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-36 rounded-lg bg-popover p-1 shadow-xl">
                <div className="flex flex-col gap-1">
                    <Button
                        className="w-full justify-start gap-2 rounded bg-transparent text-rose-600 hover:bg-accent"
                        size="sm"
                        type="button"
                        variant="ghost"
                    >
                        <UserMinus2
                            aria-hidden="true"
                            className="size-4"
                            focusable="false"
                        />
                        <span className="font-medium text-xs">Block User</span>
                    </Button>
                    <Button
                        className="w-full justify-start gap-2 rounded bg-transparent text-destructive hover:bg-accent"
                        size="sm"
                        type="button"
                        variant="ghost"
                    >
                        <Trash2 aria-hidden="true" className="size-4" focusable="false" />
                        <span className="font-medium text-xs">Delete Conversation</span>
                    </Button>
                    <Button
                        className="w-full justify-start gap-2 rounded bg-transparent text-yellow-600 hover:bg-accent"
                        size="sm"
                        type="button"
                        variant="ghost"
                    >
                        <Flag aria-hidden="true" className="size-4" focusable="false" />
                        <span className="font-medium text-xs">Report User</span>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Message actions (hover menu for individual messages — reply, copy, delete, report)
export function MessageActions({ isMe }: { isMe: boolean }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-label="Message actions"
                    className="size-7 rounded bg-background hover:bg-accent"
                    size="icon"
                    type="button"
                    variant="ghost"
                >
                    <MoreHorizontal
                        aria-hidden="true"
                        className="size-3.5"
                        focusable="false"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="center"
                className="w-40 rounded-lg bg-popover p-1 shadow-xl"
            >
                <div className="flex flex-col gap-1">
                    <Button
                        aria-label="Reply"
                        className="w-full justify-start gap-2 rounded px-2 py-1 text-xs"
                        size="sm"
                        type="button"
                        variant="ghost"
                    >
                        <Reply aria-hidden="true" className="size-3" focusable="false" />
                        <span>Reply</span>
                    </Button>
                    <Button
                        aria-label="Copy"
                        className="w-full justify-start gap-2 rounded px-2 py-1 text-xs"
                        size="sm"
                        type="button"
                        variant="ghost"
                    >
                        <Copy aria-hidden="true" className="size-3" focusable="false" />
                        <span>Copy</span>
                    </Button>
                    {isMe ? (
                        <Button
                            aria-label="Delete"
                            className="w-full justify-start gap-2 rounded px-2 py-1 text-destructive text-xs"
                            size="sm"
                            type="button"
                            variant="ghost"
                        >
                            <Trash2 aria-hidden="true" className="size-3" focusable="false" />
                            <span>Delete</span>
                        </Button>
                    ) : null}
                    <Button
                        aria-label="Report"
                        className="w-full justify-start gap-2 rounded px-2 py-1 text-xs text-yellow-600"
                        size="sm"
                        type="button"
                        variant="ghost"
                    >
                        <Flag aria-hidden="true" className="size-3" focusable="false" />
                        <span>Report</span>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export { type StatusType };

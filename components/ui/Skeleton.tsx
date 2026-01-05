import React from 'react';
import { cn } from "../../src/lib/utils"
// --> otimizado: Componente leve e funcional para Skeletons (UI Feedback)

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted", className)}
            {...props}
        />
    )
}

export { Skeleton }

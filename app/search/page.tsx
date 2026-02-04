import { Suspense } from "react"
import SearchContent from "./SearchContent"

export const dynamic = "force-dynamic"

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    )
}

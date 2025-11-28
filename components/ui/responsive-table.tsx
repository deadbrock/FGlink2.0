import { cn } from '@/lib/utils'

interface ResponsiveTableProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className="w-full overflow-x-auto -mx-4 md:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className={cn("min-w-full divide-y divide-slate-300", className)}>
            {children}
          </table>
        </div>
      </div>
    </div>
  )
}

export function ResponsiveTableWrapper({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0", className)}>
      {children}
    </div>
  )
}


/**
 * PengaduanPageHeader Component
 * Shared header for complaint pages (List and Detail)
 */

import { Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    path?: string;
    isCurrent?: boolean;
}

interface PengaduanPageHeaderProps {
    title: string;
    description: string;
    breadcrumbs: BreadcrumbItem[];
}

export function PengaduanPageHeader({ title, description, breadcrumbs }: PengaduanPageHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-500 text-sm mt-1">{description}</p>
            </div>
            <nav className="hidden md:flex items-center gap-2 text-sm">
                <Link to="/dashboard" className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                </Link>
                {breadcrumbs.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        {item.isCurrent || !item.path ? (
                            <span className={`font-medium text-gray-900 truncate max-w-[200px]`}>
                                {item.label}
                            </span>
                        ) : (
                            <Link to={item.path} className="text-gray-500 hover:text-gray-700 transition-colors">
                                {item.label}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
}

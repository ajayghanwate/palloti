import { HiOutlineChevronUp, HiOutlineChevronDown } from 'react-icons/hi';
import { useState } from 'react';

export default function StudentListTable({ students = [], columns = [] }) {
    const [sortField, setSortField] = useState(null);
    const [sortDir, setSortDir] = useState('asc');

    const defaultColumns = [
        { key: 'name', label: 'Student Name' },
        { key: 'score', label: 'Score' },
        { key: 'grade', label: 'Grade' },
        { key: 'status', label: 'Status' },
    ];

    const cols = columns.length > 0 ? columns : defaultColumns;

    const handleSort = (key) => {
        if (sortField === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(key);
            setSortDir('asc');
        }
    };

    const sortedStudents = [...students].sort((a, b) => {
        if (!sortField) return 0;
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return sortDir === 'asc'
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
    });

    const getStatusBadge = (status) => {
        const statusMap = {
            excellent: 'badge-green',
            good: 'badge-blue',
            average: 'badge-amber',
            'at-risk': 'badge-rose',
            poor: 'badge-rose',
        };
        return statusMap[status?.toLowerCase()] || 'badge-blue';
    };

    if (students.length === 0) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-slate-500">No student data available. Upload a CSV to get started.</p>
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="w-12">#</th>
                            {cols.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    className="cursor-pointer select-none hover:text-blue-400 transition-colors"
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {sortField === col.key && (
                                            sortDir === 'asc'
                                                ? <HiOutlineChevronUp className="w-3 h-3" />
                                                : <HiOutlineChevronDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStudents.map((student, idx) => (
                            <tr key={idx} className="border-b border-white/5">
                                <td className="text-slate-500 text-xs">{idx + 1}</td>
                                {cols.map((col) => (
                                    <td key={col.key}>
                                        {col.key === 'status' ? (
                                            <span className={`badge ${getStatusBadge(student[col.key])}`}>
                                                {student[col.key]}
                                            </span>
                                        ) : (
                                            student[col.key]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

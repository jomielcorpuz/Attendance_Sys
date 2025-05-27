
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

type DomainRow = string[];
interface DomainData {
    [key: string]: string;
}

export function SheetTracker() {
    const [url, setUrl] = useState('');
    const [headers, setHeaders] = useState<string[]>([]);
    const [dataRows, setDataRows] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const extractSheetId = (url: string): string | null => {
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        return match ? match[1] : null;
    };

    const fetchSheetData = async () => {
        setError(null);
        setLoading(true);

        const sheetId = extractSheetId(url);
        if (!sheetId) {
            setError("Invalid Google Sheet URL");
            setLoading(false);
            return;
        }

        const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

        try {
            const response = await fetch(sheetUrl);
            const text = await response.text();

            const json = JSON.parse(text.substring(47, text.length - 2));
            const { rows } = json.table;

            // Convert rows into 2D array of strings
            const allRows = rows.map((row: any) =>
                row.c.map((cell: any) => (cell?.v ?? '').toString().trim())
            );

            // Find the row index that contains "DOMAIN" as header
            const headerIndex = allRows.findIndex((row: string[]) => row.includes('DOMAIN'));

            if (headerIndex === -1) {
                setError("No valid header found (no 'DOMAIN' column).");
                setLoading(false);
                return;
            }

            const headers = allRows[headerIndex];
            const dataRows = allRows.slice(headerIndex + 1).map((row: { [x: string]: string; }) =>
                headers.reduce((acc: { [x: string]: any; }, header: string | number, i: string | number) => {
                    acc[header] = row[i] ?? '';
                    return acc;
                }, {} as Record<string, string>)
            );

            setHeaders(headers);
            setDataRows(dataRows);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch or parse sheet data.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Paste Google Sheet URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <Button onClick={fetchSheetData} disabled={loading}>
                    {loading ? "Loading..." : "Load Sheet"}
                </Button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {dataRows.length > 0 && (
                <div className="overflow-auto border rounded p-2">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr>
                                {headers.map((header) => (
                                    <th key={header} className="px-2 py-1 text-left font-semibold border-b">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dataRows.map((row, i) => (
                                <tr key={i}>
                                    {headers.map((header) => (
                                        <td key={header} className="px-2 py-1 border-b">{row[header]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default SheetTracker;

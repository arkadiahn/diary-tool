import { Spinner, Table, TableBody, TableColumn, TableHeader, type TableRowProps } from "@heroui/react";
import { Button } from "@heroui/react";

interface CustomInsideTableProps {
    children: React.ReactElement<TableRowProps<unknown>>[];
    loading: boolean;
    emptyContent: React.ReactNode;
    title: string;
    header: string[];
    onAdd?: () => void;
}
export default function CustomInsideTable<_T>({
    children,
    loading,
    emptyContent,
    title,
    header,
    onAdd,
}: CustomInsideTableProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
                <h2>{title}</h2>
                {onAdd && (
                    <Button color="primary" variant="light" size="sm" onPress={onAdd}>
                        Add
                    </Button>
                )}
            </div>
            <Table aria-label="Accounts">
                <TableHeader>
                    {header.map((h) => (
                        <TableColumn key={h}>{h}</TableColumn>
                    ))}
                </TableHeader>
                <TableBody isLoading={loading} emptyContent={emptyContent} loadingContent={<Spinner />}>
                    {children}
                </TableBody>
            </Table>
        </div>
    );
}

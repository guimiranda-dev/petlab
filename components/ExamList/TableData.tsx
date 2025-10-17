import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table';
import { Pagination } from '@heroui/pagination';
import { RowItem } from './row-item';
import { ExamInterface } from '@/types/exam';

interface Props {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  data: ExamInterface[];
}

interface ColumnsProps {
  name: string;
  uid: string;
  alignment?: 'center' | 'end' | 'start';
}

const columns: ColumnsProps[] = [
  // { name: 'Protocolo', uid: 'id' },
  { name: 'Tipo do Exame', uid: 'exam_type' },
  { name: 'Data', uid: 'date', alignment: 'center' },
  { name: 'Espécie/Raça', uid: 'specie' },
  { name: 'Nome do animal', uid: 'pet_name' },
  { name: 'Proprietário', uid: 'owner' },
  { name: 'Veterinário', uid: 'vet' },
  { name: 'Ações', uid: 'actions', alignment: 'center' },
];

export function ExamTableData({ page, setPage, totalPages, data }: Props) {
  return (
    <Table
      aria-label='Exames'
      isStriped
      bottomContent={
        <div className='flex w-full justify-center'>
          <Pagination
            isCompact
            showControls
            showShadow
            color='secondary'
            page={page}
            total={totalPages}
            onChange={(page: number) => setPage(page)}
          />
        </div>
      }
      classNames={{
        wrapper: 'min-h-[222px]',
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.alignment || 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className='p-4'>
                <RowItem exam={item} columnKey={columnKey} />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

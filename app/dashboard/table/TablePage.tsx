"use client";

import { useSearchParams } from "next/navigation";
import DynamicTable from "../../components/DynamicTable";

const TablePage = () => {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");
  const sheetId = searchParams.get("sheetId");

  return (
    <div>
      {tableId && <DynamicTable tableId={tableId} />}
      {sheetId && <DynamicTable sheetId={sheetId} />}
        {!tableId && !sheetId && <DynamicTable />}
    </div>
  );
};

export default TablePage;
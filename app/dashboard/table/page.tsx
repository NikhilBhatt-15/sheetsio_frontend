import { Suspense } from "react";
import TablePage from "./TablePage";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TablePage />
    </Suspense>
  );
};

export default Page;
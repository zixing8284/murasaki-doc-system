import UpdateAccountForm from './_components/update-account-form';
import CreateDepartmentForm from './_components/create-department-form';
import { checkSuperAdmin } from '@/lib/dal';
import prisma from '@/prisma/client';

const getDepartment = async (departmentId: number | undefined) => {
  if (!departmentId) return;
  return await prisma.department.findUnique({
    where: { id: departmentId },
  });
};

const getAllDepartments = async () => {
  return await prisma.department.findMany();
};

export default async function AccountPage() {
  const [admin, allDepartments] = await Promise.all([
    checkSuperAdmin(),
    getAllDepartments(),
  ]);
  const department = await getDepartment(admin?.departmentId);

  const departmentName = department?.name || '未知组织';

  return (
    <>
      <div className="relative overflow-hidden rounded-md bg-next shadow-sunlight dark:bg-night dark:shadow-hairo">
        <UpdateAccountForm
          currentUser={admin}
          departmentName={departmentName}
        />
      </div>
      <div className="relative overflow-hidden rounded-md bg-next shadow-sunlight dark:bg-night dark:shadow-hairo">
        <CreateDepartmentForm allDepartments={allDepartments} />
      </div>
    </>
  );
}

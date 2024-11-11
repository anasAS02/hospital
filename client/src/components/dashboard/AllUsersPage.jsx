import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allUsers, deleteUser } from "../../store/reducers/usersSlice";
import { toast } from "react-toastify";
import { Table, Button, Modal, Alert } from "flowbite-react";
import { HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import Loading from "../Loading";
import AddUserModal from "../admin/AddUserModal";
import EditUserModal from "../admin/EditUserModal";

function AllUsersPage() {
  const dispatch = useDispatch();
  const { loading, users, error } = useSelector((state) => state.users);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    dispatch(allUsers());
  }, [dispatch]);

  // Handle Edit Click
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Handle Delete Click
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    try {
      await dispatch(deleteUser(selectedUser?._id)).unwrap();
      toast.success("تم حذف المستخدم بنجاح", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(`فشل في الحذف: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
        <Button
          color="success"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-500"
        >
          <HiPlus className="mr-2" /> إضافة مستخدم
        </Button>
      </div>

      {/* Error Handling */}
      {error && (
        <Alert color="failure" className="mb-4">
          خطأ: {error}
        </Alert>
      )}

      {/* Users Table */}
      <Table
        hoverable={true}
        className="w-full shadow-md rounded-lg overflow-hidden border"
      >
        <Table.Head className="bg-gray-100 border-b">
          <Table.HeadCell className="px-4 py-2 text-right font-semibold text-gray-600">
            الترتيب
          </Table.HeadCell>
          <Table.HeadCell className="px-4 py-2 text-right font-semibold text-gray-600">
            الاسم
          </Table.HeadCell>
          <Table.HeadCell className="px-4 py-2 text-right font-semibold text-gray-600">
            الوظيفة
          </Table.HeadCell>
          <Table.HeadCell className="px-4 py-2 text-right font-semibold text-gray-600">
            إجراءات
          </Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {users &&
            users?.length > 0 &&
            users?.map((user, index) => (
              <Table.Row
                key={user?._id}
                className="bg-white border-b hover:bg-gray-50"
              >
                <Table.Cell className="px-4 py-3 text-right">
                  {index + 1}
                </Table.Cell>
                <Table.Cell className="px-4 py-3 text-right">
                  {user?.name}
                </Table.Cell>
                <Table.Cell className="px-4 py-3 text-right">
                  {user?.role}
                </Table.Cell>
                <Table.Cell className="px-4 py-3 text-right flex gap-2">
                  <Button
                    color="info"
                    size="sm"
                    onClick={() => handleEditClick(user)}
                    className="flex items-center px-3 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-600"
                  >
                    <HiPencil className="mr-1 text-blue-600" /> تعديل
                  </Button>
                  <Button
                    color="failure"
                    size="sm"
                    onClick={() => handleDeleteClick(user)}
                    className="flex items-center px-3 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-600"
                  >
                    <HiTrash className="mr-1 text-red-600" /> حذف
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Confirm Delete Modal */}
      <Modal
        show={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        size="md"
        popup={true}
      >
        <Modal.Header>تأكيد الحذف</Modal.Header>
        <Modal.Body>
          <p>هل أنت متأكد أنك تريد حذف المستخدم {selectedUser?.name}؟</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button color="gray" onClick={() => setIsDeleteModalOpen(false)}>
              إلغاء
            </Button>
            <Button
              color="failure"
              onClick={confirmDelete}
              className="bg-green-500"
            >
              تأكيد الحذف
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AllUsersPage;

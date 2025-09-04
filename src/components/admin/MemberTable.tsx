import { updateMemberAPI } from "@/services2/operations/auth";
import { toast } from "react-toastify";

interface Member {
  id: number;
  name?: string;
  phone: string;
  email: string;
  isOrder: boolean;
  isProduct: boolean;
}

const MembersTable = ({ members, loading, fetchMembers }) => {
  const handlePermissionUpdate = async (
    id: number,
    field: "isOrder" | "isProduct",
    value: boolean
  ) => {
    const updatedData = { [field]: value };

    try {
      await updateMemberAPI(id, updatedData);
      fetchMembers();
      //   toast.success("Permission Update Successfully!");
    } catch (error) {
      toast.error("Permission Update Successfully!");
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Members List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full overflow-hidden rounded-lg shadow-md">
          <table className="w-full border-collapse border border-gray-300 text-left">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                <th className="border p-3">Email</th>
                <th className="border p-3">Phone</th>
                <th className="border p-3 text-center">Order Permission</th>
                <th className="border p-3 text-center">Product Permission</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-100">
                    <td className="border p-3">{member?.email}</td>
                    <td className="border p-3">{member?.phone}</td>
                    <td className="border p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            handlePermissionUpdate(member.id, "isOrder", true)
                          }
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all shadow-md border 
        ${member.isOrder
                              ? "bg-green-500 text-white border-green-600"
                              : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
                            }`}
                        >
                          ON
                        </button>
                        <button
                          onClick={() =>
                            handlePermissionUpdate(member.id, "isOrder", false)
                          }
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all shadow-md border 
        ${!member.isOrder
                              ? "bg-red-500 text-white border-red-600"
                              : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
                            }`}
                        >
                          OFF
                        </button>
                      </div>
                    </td>

                    <td className="border p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            handlePermissionUpdate(member.id, "isProduct", true)
                          }
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all shadow-md border 
        ${member.isProduct
                              ? "bg-green-500 text-white border-green-600"
                              : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
                            }`}
                        >
                          ON
                        </button>
                        <button
                          onClick={() =>
                            handlePermissionUpdate(
                              member.id,
                              "isProduct",
                              false
                            )
                          }
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all shadow-md border 
        ${!member.isProduct
                              ? "bg-red-500 text-white border-red-600"
                              : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
                            }`}
                        >
                          OFF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="border p-3 text-center">
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MembersTable;

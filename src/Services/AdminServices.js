import requests from "./api";

const AdminServices = {
    adminLogin:  async (body) => {
        return requests.post("/admin/login", body);
      },
      addUser: async(body) => {
        return requests.post("/admin/signup", body);
      },

}
export default AdminServices;

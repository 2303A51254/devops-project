import { useEffect, useState } from 'react';
import { adminApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const AdminCustomersPage = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    adminApi.customers(token).then((response) => setCustomers(response.customers)).catch(() => {});
  }, [token]);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Guests</span>
        <h1>Customer directory</h1>
      </div>

      <div className="card table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || '-'}</td>
                  <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomersPage;

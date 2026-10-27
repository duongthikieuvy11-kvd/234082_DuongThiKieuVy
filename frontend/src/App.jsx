import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    gender: 'Nam',
    dateOfBirth: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    hireDate: '',
    status: 'Đang làm việc'
  });

  // Fetch danh sách nhân viên / Tìm kiếm
  const fetchEmployees = async (keyword = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}${keyword ? `?search=${keyword}` : ''}`);
      setEmployees(res.data);
    } catch (err) {
      setMessage('Lỗi khi tải dữ liệu nhân viên!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Thêm mới hoặc Cập nhật nhân viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.employeeId || !formData.fullName || !formData.email) {
      setMessage('Vui lòng điền các trường bắt buộc (Mã, Họ tên, Email)!');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setMessage('Cập nhật thông tin nhân viên thành công!');
      } else {
        await axios.post(API_URL, formData);
        setMessage('Thêm nhân viên mới thành công!');
      }
      resetForm();
      fetchEmployees();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  // Xem thông tin để chỉnh sửa
  const handleEdit = (emp) => {
    setEditingId(emp.employeeId);
    setFormData(emp);
  };

  // Xóa nhân viên có yêu cầu xác nhận
  const handleDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên có mã ${id}?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage('Xóa nhân viên thành công!');
        fetchEmployees();
      } catch (err) {
        setMessage('Lỗi khi xóa nhân viên!');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      employeeId: '',
      fullName: '',
      gender: 'Nam',
      dateOfBirth: '',
      department: '',
      position: '',
      email: '',
      phone: '',
      hireDate: '',
      status: 'Đang làm việc'
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: 'auto' }}>
      <h2>Quản Lý Nhân Sự</h2>

      {/* Thông báo */}
      {message && <div style={{ padding: '10px', background: '#e0f7fa', marginBottom: '15px' }}>{message}</div>}

      {/* Form tìm kiếm */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Tìm theo Mã NV hoặc Họ tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', width: '250px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 15px' }}>Tìm kiếm</button>
        <button type="button" onClick={() => { setSearch(''); fetchEmployees(); }} style={{ padding: '8px 15px', marginLeft: '5px' }}>Reset</button>
      </form>

      {/* Form Thêm/Sửa */}
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>{editingId ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên Mới'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input name="employeeId" placeholder="Mã NV (*)" value={formData.employeeId} onChange={handleChange} disabled={!!editingId} required />
          <input name="fullName" placeholder="Họ và Tên (*)" value={formData.fullName} onChange={handleChange} required />
          <input name="email" placeholder="Email (*)" value={formData.email} onChange={handleChange} required />
          <input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} />
          <input name="department" placeholder="Phòng ban" value={formData.department} onChange={handleChange} />
          <input name="position" placeholder="Chức vụ" value={formData.position} onChange={handleChange} />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Đang làm việc">Đang làm việc</option>
            <option value="Nghỉ việc">Nghỉ việc</option>
          </select>
        </div>
        <div style={{ marginTop: '10px' }}>
          <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
            {editingId ? 'Cập Nhật' : 'Thêm Mới'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ padding: '8px 15px', marginLeft: '10px' }}>Hủy</button>
          )}
        </div>
      </form>

      {/* Danh sách Nhân viên */}
      <h3>Danh Sách Nhân Viên</h3>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f2f2f2' }}>
              <th>Mã NV</th>
              <th>Họ Tên</th>
              <th>Phòng Ban</th>
              <th>Chức Vụ</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp._id || emp.employeeId}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.fullName}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.status}</td>
                  <td>
                    <button onClick={() => handleEdit(emp)} style={{ marginRight: '5px' }}>Sửa</button>
                    <button onClick={() => handleDelete(emp.employeeId)} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none' }}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>Không có dữ liệu nhân viên</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
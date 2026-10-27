const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET /api/employees - Lấy danh sách hoặc tìm kiếm
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/employees/:id - Lấy chi tiết
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.id });
    if (!employee) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/employees - Thêm nhân viên
router.post('/', async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;
    if (!employeeId || !fullName || !email) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Mã nhân viên đã tồn tại' });
    }

    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/employees/:id - Cập nhật nhân viên
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.params.id },
      req.body,
      { new: true }
    );
    if (!employee) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/employees/:id - Xóa nhân viên
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({ employeeId: req.params.id });
    if (!employee) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json({ message: 'Đã xóa nhân viên' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint kiểm tra trạng thái
app.get('/health', (req, res) => {
  res.json({ status: 'Backend đang hoạt động bình tahường' });
});

// Kết nối Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Đã kết nối MongoDB Atlas'))
  .catch(err => console.error('Lỗi kết nối database:', err));

// Khai báo Routes
app.use('/api/employees', employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server chạy tại cổng ${PORT}`);
});
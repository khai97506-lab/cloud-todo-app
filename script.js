const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Lấy các element từ HTML (đảm bảo id khớp với code HTML của bạn)
const taskInput = document.querySelector('input[type="text"]');
const addBtn = document.querySelectorAll('button')[0]; // Nút "Thêm"
const taskListArea = document.body; // Hoặc container chứa danh sách task

// 1. Tải danh sách công việc từ Supabase
async function fetchTasks() {
  const { data, error } = await _supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Lỗi lấy dữ liệu:', error);
    return;
  }
  renderTasks(data);
}

// 2. Thêm công việc mới vào database
async function addTask() {
  const title = taskInput.value.trim();
  if (!title) return;

  const { error } = await _supabase
    .from('tasks')
    .insert([{ title, completed: false }]);

  if (error) {
    console.error('Lỗi khi thêm công việc:', error);
  } else {
    taskInput.value = '';
    fetchTasks();
  }
}

// 3. Hiển thị dữ liệu ra giao diện
function renderTasks(tasks) {
  let existingContainer = document.getElementById('todo-container');
  if (!existingContainer) {
    existingContainer = document.createElement('div');
    existingContainer.id = 'todo-container';
    document.body.appendChild(existingContainer);
  }

  if (!tasks || tasks.length === 0) {
    existingContainer.innerHTML = '<p style="margin-top: 15px;">Chưa có công việc nào.</p>';
    return;
  }

  existingContainer.innerHTML = tasks.map(task => `
    <div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
      <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id}, ${!task.completed})">
      <span style="${task.completed ? 'text-decoration: line-through;' : ''}">${task.title}</span>
      <button onclick="deleteTask(${task.id})">Xóa</button>
    </div>
  `).join('');
}

// 4. Đánh dấu hoàn thành / chưa hoàn thành
async function toggleTask(id, completed) {
  await _supabase.from('tasks').update({ completed }).eq('id', id);
  fetchTasks();
}

// 5. Xóa công việc
async function deleteTask(id) {
  await _supabase.from('tasks').delete().eq('id', id);
  fetchTasks();
}

// Gán sự kiện click cho nút Thêm và gọi hàm lấy dữ liệu ban đầu
if (addBtn) addBtn.onclick = addTask;
fetchTasks();

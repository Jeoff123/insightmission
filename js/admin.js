// DOM Elements
let classModal = null;
let classForm = null;
let addClassBtn = null;
let classesTableBody = null;
let modalTitle = null;
let submitBtn = null;

// Initialize DOM elements
function initDOM() {
    classModal = document.getElementById('classModal');
    classForm = document.getElementById('classForm');
    addClassBtn = document.getElementById('addClassBtn');
    classesTableBody = document.querySelector('.admin-classes-table tbody');
    modalTitle = document.getElementById('modalTitle');
    submitBtn = document.querySelector('.submit-btn');

    // Add event listeners
    if (addClassBtn) {
        addClassBtn.addEventListener('click', () => openModal());
    }
    if (classForm) {
        classForm.addEventListener('submit', handleFormSubmit);
    }
}

// Load all classes from Supabase
async function loadClasses() {
    try {
        // Wait for Supabase client to be ready
        await window.supabaseClientReady;
        
        console.log('Fetching classes from Supabase...');
        const { data, error } = await window.supabaseClient
            .from('classes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading classes:', error);
            console.error('Error details:', error.message);
            alert('Error loading classes. Please try again.');
            return;
        }

        console.log('Received data:', data);
        
        if (!data || data.length === 0) {
            console.log('No classes found');
            renderClasses([]);
            return;
        }

        renderClasses(data);
    } catch (error) {
        console.error('Error in loadClasses:', error);
        console.error('Stack trace:', error.stack);
        alert('Error loading classes. Please try again.');
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const classId = classForm.dataset.classId;
    if (classId) {
        await updateClass(classId);
    } else {
        await addClass();
    }
}

// Add new class
async function addClass() {
    try {
        const classData = {
            title: document.getElementById('title').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            fee: parseFloat(document.getElementById('fee').value.replace(/[^\d.-]+/g, '')),
            category: document.getElementById('category').value,
            description: document.getElementById('description').value.trim(),
            image_url: document.getElementById('image').value.trim()
        };

        console.log('Class data to be inserted:', classData);

        if (!classData.title || !classData.date || !classData.time || !classData.fee || !classData.category || !classData.description || !classData.image_url) {
            throw new Error('All fields are required');
        }

        const { data, error } = await window.supabaseClient
            .from('classes')
            .insert([classData]);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log('Class inserted successfully:', data);
        closeModal();
        loadClasses();
        alert('Class added successfully!');
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        
        let errorMessage = 'Error adding class. Please check the form and try again.';
        if (error.message) {
            errorMessage = error.message;
        }
        
        alert(errorMessage);
    }
}

// Edit class
async function editClass(id) {
    try {
        await window.supabaseClientReady;
        
        const { data, error } = await window.supabaseClient
            .from('classes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error loading class:', error);
            throw error;
        }

        if (!data) {
            console.error('Class not found');
            throw new Error('Class not found');
        }

        // Fill form with existing data
        document.getElementById('title').value = data.title;
        document.getElementById('date').value = data.date;
        document.getElementById('time').value = data.time;
        document.getElementById('fee').value = data.fee;
        document.getElementById('category').value = data.category;
        document.getElementById('description').value = data.description;
        document.getElementById('image').value = data.image_url;

        // Update UI
        modalTitle.textContent = 'Edit Class';
        submitBtn.textContent = 'Update Class';
        classForm.dataset.classId = id;
        
        openModal();
    } catch (error) {
        console.error('Error loading class:', error);
        alert('Error loading class. Please try again.');
    }
}

// Update class
async function updateClass(id) {
    try {
        const updates = {
            title: document.getElementById('title').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            fee: parseFloat(document.getElementById('fee').value.replace(/[^\d.-]+/g, '')),
            category: document.getElementById('category').value,
            description: document.getElementById('description').value.trim(),
            image_url: document.getElementById('image').value.trim()
        };

        console.log('Class updates:', updates);

        if (!updates.title || !updates.date || !updates.time || !updates.fee || !updates.category || !updates.description || !updates.image_url) {
            throw new Error('All fields are required');
        }

        const { data, error } = await window.supabaseClient
            .from('classes')
            .update(updates)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log('Class updated successfully:', data);
        closeModal();
        loadClasses();
        alert('Class updated successfully!');
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        
        let errorMessage = 'Error updating class. Please check the form and try again.';
        if (error.message) {
            errorMessage = error.message;
        }
        
        alert(errorMessage);
    }
}

// Delete class
async function deleteClass(id) {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
        const { error } = await window.supabaseClient
            .from('classes')
            .delete()
            .eq('id', id);

        if (error) throw error;

        loadClasses();
        alert('Class deleted successfully!');
    } catch (error) {
        console.error('Error deleting class:', error);
        alert('Error deleting class. Please try again.');
    }
}

// Render classes in the table
function renderClasses(classes) {
    if (!classesTableBody) {
        console.error('Classes table body not found');
        return;
    }

    classesTableBody.innerHTML = '';
    
    if (!classes || classes.length === 0) {
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 20px;">No classes found</td>
        `;
        classesTableBody.appendChild(noDataRow);
        return;
    }
    
    classes.forEach(classItem => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${classItem.title}</td>
            <td>${classItem.date}</td>
            <td>${classItem.time}</td>
            <td>${classItem.fee}</td>
            <td>${classItem.category}</td>
            <td>
                <button onclick="editClass('${classItem.id}')" class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteClass('${classItem.id}')" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        classesTableBody.appendChild(row);
    });
}

// Modal functions
function openModal(classId = null) {
    if (!classModal) return;
    classModal.style.display = 'block';
    if (classId) {
        editClass(classId);
    } else {
        clearForm();
        modalTitle.textContent = 'Add New Class';
        submitBtn.textContent = 'Add Class';
        classForm.removeAttribute('data-class-id');
    }
}

function closeModal() {
    if (!classModal) return;
    classModal.style.display = 'none';
    clearForm();
}

function clearForm() {
    if (!classForm) return;
    classForm.reset();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initDOM();
    loadClasses();
});

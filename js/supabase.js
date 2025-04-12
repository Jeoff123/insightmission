// Supabase configuration
const SUPABASE_URL = 'https://zaziwufifcxyzdreggeb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpheml3dWZpZmN4eXpkcmVnZ2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTU3NjMsImV4cCI6MjA2MDAzMTc2M30.-m8MOkwfda5V0eEMQb2c-YZ_lHQ6oV3Etoh98LvSU8s';

// Initialize Supabase
const { createClient } = supabase;
window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    },
    global: {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        fetch: async (...args) => {
            try {
                const response = await fetch(...args);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
                }
                return response;
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            }
        }
    }
});

// Function to fetch all classes
window.fetchClasses = async function() {
    try {
        console.log('Fetching classes from Supabase...');
        
        const { data, error } = await window.supabaseClient
            .from('classes')
            .select('*')
            .order('date', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log('Received classes:', data);
        return data;
    } catch (error) {
        console.error('Error fetching classes:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        throw error;
    }
}

// Function to add a new class
window.addClass = async function(classData) {
    try {
        const { data, error } = await window.supabaseClient
            .from('classes')
            .insert([classData]);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error adding class:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        throw error;
    }
}

// Function to update a class
window.updateClass = async function(id, updates) {
    try {
        const { data, error } = await window.supabaseClient
            .from('classes')
            .update(updates)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error updating class:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        throw error;
    }
}

// Function to delete a class
window.deleteClass = async function(id) {
    try {
        const { error } = await window.supabaseClient
            .from('classes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error deleting class:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        throw error;
    }
}

// Function to fetch upcoming class
window.fetchUpcomingClass = async function() {
    try {
        console.log('Fetching upcoming class...');
        
        const { data, error } = await window.supabaseClient
            .from('classes')
            .select('*')
            .order('date', { ascending: true })
            .limit(1)
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        if (!data) {
            console.log('No upcoming class found');
            return null;
        }

        // Combine date and time for display
        const startTime = new Date(data.date);
        startTime.setHours(data.time.split(':')[0]);
        startTime.setMinutes(data.time.split(':')[1]);
        
        return {
            ...data,
            date: startTime.toISOString()
        };
    } catch (error) {
        console.error('Error fetching upcoming class:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        throw error;
    }
}

// Add a test class for development
window.addTestClass = async function() {
    try {
        console.log('Adding test class...');
        
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const testClass = {
            title: "Test Class",
            date: tomorrow.toISOString().split('T')[0],
            time: "10:00",
            fee: 999,
            category: "career",
            description: "This is a test class for development purposes",
            image_url: "https://via.placeholder.com/400",
            location: "Online",
            instructor: "Test Instructor"
        };

        const { data, error } = await window.supabaseClient
            .from('classes')
            .insert([testClass]);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log('Test class added successfully:', data);
        return data;
    } catch (error) {
        console.error('Error adding test class:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        throw error;
    }
}

// Test function to verify everything is working
window.testSupabaseConnection = async function() {
    try {
        console.log('Testing Supabase connection...');
        
        // Test fetching classes
        const { data, error } = await window.supabaseClient
            .from('classes')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Test error:', error);
            throw error;
        }
        
        console.log('Supabase test successful!', data);
        return data;
    } catch (error) {
        console.error('Error in test:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        throw error;
    }
};

// Initialize Supabase client when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.supabaseClientReady = new Promise((resolve) => {
        if (window.supabaseClient) {
            resolve();
        } else {
            const checkClient = () => {
                if (window.supabaseClient) {
                    resolve();
                } else {
                    setTimeout(checkClient, 100);
                }
            };
            checkClient();
        }
    });

    // Test connection when ready
    window.supabaseClientReady.then(() => {
        console.log('Supabase client initialized');
        testSupabaseConnection().catch(error => {
            console.error('Initial test failed:', error);
            alert('Failed to connect to Supabase. Please check your network connection and try again.');
        });
    });
});

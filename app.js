// SUPABASE CONFIGURATION
// Replace these with your own Supabase project details
const SUPABASE_URL = 'https://pqvfhjmvgrzckfzwujuw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mkHFaI9DVbE2XKkA3c7IMQ_1jW5cna9';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM ELEMENTS
const form = document.getElementById('questionnaireForm');
const submitBtn = document.getElementById('submitBtn');
const statusMsg = document.getElementById('statusMsg');

// FORM SUBMISSION HANDLER
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // UI State: Loading
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    statusMsg.style.display = 'none';
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    try {
        // Send data to Supabase
        const { error } = await supabase
            .from('responses')
            .insert([data]);
            
        if (error) throw error;
        
        // Success feedback
        showStatus('¡Gracias! Tus respuestas han sido registradas.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Error saving to Supabase:', error);
        showStatus('Hubo un error al enviar tus respuestas. Por favor, verifica la configuración de Supabase.', 'error');
    } finally {
        // UI State: Reset
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

function showStatus(message, type) {
    statusMsg.textContent = message;
    statusMsg.className = `status-message ${type}`;
    statusMsg.style.display = 'block';
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            statusMsg.style.opacity = '0';
            setTimeout(() => {
                statusMsg.style.display = 'none';
                statusMsg.style.opacity = '1';
            }, 500);
        }, 5000);
    }
}

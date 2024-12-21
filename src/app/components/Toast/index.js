import Swal from 'sweetalert2';

export function Toast(status, text) {
    
    const bgColors = {
        success: '#28a745',
        error: '#dc3545',
    };

    Swal.fire({
        icon: status,
        showCloseButton: true,
        toast: true,
        html: text,
        color: '#FFFFFF',
        background: bgColors[status],
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        customClass: {
            popup: 'rounded-lg shadow-lg p-4',
            htmlContainer: 'text-sm font-medium',
            timerProgressBar: 'bg-white',
            closeButton: 'text-white hover:text-gray-300',
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
    });
}

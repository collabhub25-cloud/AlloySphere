import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const Toast = MySwal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: 'rgba(20, 20, 20, 0.95)',
  color: '#ffffff',
  customClass: {
    popup: 'backdrop-blur-md border border-white/10 rounded-xl shadow-2xl',
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const showPremiumAlert = (options: any) => {
  return MySwal.fire({
    background: 'rgba(15, 15, 15, 0.9)',
    color: '#ffffff',
    confirmButtonColor: '#2563eb', // Blue-600
    cancelButtonColor: '#3f3f46', // Zinc-700
    customClass: {
      popup: 'backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl',
      confirmButton: 'rounded-lg px-6 py-2 font-medium',
      cancelButton: 'rounded-lg px-6 py-2 font-medium',
    },
    ...options
  });
};

export default MySwal;

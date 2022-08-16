import swal from "sweetalert";

export default function confirm_alert(
  msg,
  options = {
    icon: "warning",
    title: "Atenção",
    buttons: ["Cancelar", "Confirmar"],
  },
) {
  const { icon, title, buttons } = options;
  return new Promise(resolve => {
    swal({
      title,
      text: msg,
      icon,
      buttons,
      dangerMode: true,
      closeOnClickOutside: false,
    }).then(confirmation => {
      resolve(confirmation);
    });
  });
}

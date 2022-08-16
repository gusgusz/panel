import swal from "sweetalert";

export default function message_alert(msg, options = { icon: "info", title: "Informação" }) {
  const { icon, title } = options;
  if (msg) {
    swal(title, msg, { icon });
  }
}

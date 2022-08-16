import swal from "sweetalert";

export default function error_alert(msg, title = "Erro") {
  swal(title, msg, { icon: "error" });
}

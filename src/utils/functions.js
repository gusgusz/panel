import axios from "axios";

export const toFloat = text => {
  if (isInt(text) || isFloat(text)) {
    return text;
  } else {
    return parseFloat(text.toString().replace(/\./g, "").replace(/\,/g, "."));
  }
};

const isInt = n => {
  return Number(n) === n && n % 1 === 0;
};

const isFloat = n => {
  return Number(n) === n && n % 1 !== 0;
};

export const maskRealBeautify = (int: any, includeZero = false, symbol = "") => {
  if (!int) int = 0;

  if (includeZero) int = parseFloat(int).toFixed(2);

  int = int.toString().replace(/\D/g, "");

  int = new String(Number(int));

  var len = int.length;

  if (1 == len) int = int.replace(/(\d)/, "0,0$1");
  else if (2 == len) int = int.replace(/(\d)/, "0,$1");
  else if (len > 2 && len < 6) int = int.replace(/(\d{2})$/, ",$1");
  else if (len >= 6 && len < 9) int = int.replace(/(\d{3})(\d{2})$/, ".$1,$2");
  else if (len >= 9) int = int.replace(/(\d{3})(\d{3})(\d{2})$/, ".$1.$2,$3");
  return `${symbol ? `${symbol} ` : ""}${int}`;
};

export const maskCpfCnpj = (target, type = "cpf") => {
  let targetF = clearMask(target);

  if (parseInt(target) || isInt(targetF) || isFloat(targetF)) {
    if (type.toUpperCase() === "CPF") {
      return maskCpf(targetF.toString().substr(0, 11));
    } else {
      return maskCnpj(targetF.toString().substr(0, 14));
    }
  } else {
    return target.toString().substr(0, 14);
  }
};

export const maskIntBeautify = (int: any, includeZero = false) => {
  if (!int) int = 0;

  if (includeZero) int = parseFloat(int).toFixed(2);

  int = int.toString().replace(/\D/g, "");

  int = new String(Number(int));

  var len = int.length;

  if (1 == len) int = int.replace(/(\d)/, "$1");
  else if (2 == len) int = int.replace(/(\d)/, "$1");
  else if (3 == len) int = int.replace(/(\d)/, "$1");
  else if (4 == len) int = int.replace(/(\d{1})(\d{3})$/, "$1.$2");
  else if (5 == len) int = int.replace(/(\d{2})(\d{3})$/, "$1.$2");
  else if (6 == len) int = int.replace(/(\d{3})(\d{3})$/, "$1.$2");
  else if (7 == len) int = int.replace(/(\d{1})(\d{3})(\d{3})$/, "$1.$2.$3");
  else if (8 == len) int = int.replace(/(\d{2})(\d{3})(\d{3})$/, "$1.$2.$3");
  else if (9 == len) int = int.replace(/(\d{3})(\d{3})(\d{3})$/, "$1.$2.$3");
  else if (10 == len) int = int.replace(/(\d{1})(\d{3})(\d{3})(\d{3})$/, "$1.$2.$3.$4");
  else if (11 == len) int = int.replace(/(\d{2})(\d{3})(\d{3})(\d{3})$/, "$1.$2.$3.$4");
  else if (12 == len) int = int.replace(/(\d{3})(\d{3})(\d{3})(\d{3})$/, "$1.$2.$3.$4");
  else if (len > 12) int = int.replace(/(\d)(\d{3})(\d{3})(\d{3})(\d{3})$/, "$1.$2.$3.$4.$5");
  return int;
};

export const maskPhoneOrEmail = (param: any) => {
  const v = clearMask(param);

  if (v.length >= 10 && v.length <= 11) {
    if (v.length === 10) return v.replace(/(\d{2})(\d{4})(\d{4})/g, "($1) $2-$3");
    else {
      if (testCPF(v.substr(0, 11))) {
        return maskCpf(v.substr(0, 11));
      } else if (validarCNPJ(v.substr(0, 14))) {
        return maskCpf(v.substr(0, 14));
      }
      return v.substr(0, 11).replace(/(\d{2})(\d{1})(\d{4})(\d{4})/g, "($1) $2 $3-$4");
    }
  } else {
    return param;
  }
};

export const maskPhone = (v: any) => {
  v = clearMask(v);

  if (v.length === 10) return v.replace(/(\d{2})(\d{4})(\d{4})/g, "($1) $2-$3");
  else return v.substr(0, 11).replace(/(\d{2})(\d{1})(\d{4})(\d{4})/g, "($1) $2 $3-$4");
};

export const dateToEng = (date: string) => {
  if (date) {
    const dt = date.toString().split("/");
    return `${dt[2]}-${dt[1]}-${dt[0]}`;
  } else return "";
};

export const dateToPt = (date: string) => {
  if (date) {
    const dt = date.toString().split("-");
    return `${dt[2]}/${dt[1]}/${dt[0]}`;
  } else return "";
};

export function maskDateToPt(date: string) {
  const v = clearMask(date);

  return v.replace(/(\d{2})(\d{2})(\d{4})/g, "$1/$2/$3");
}

export function clearMask(target) {
  if (typeof target !== "string") target = `${target}`;

  return target.replace(/\D/g, "");
}

function maskCpf(value) {
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
}

function maskCnpj(value) {
  return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
}

export const maskCep = (value: string) => {
  if (value)
    return clearMask(value)
      .toString()
      .substr(0, 8)
      .replace(/(\d{5})(\d{3})/g, "$1-$2");
  else "";
};

export const createAddress = item => {
  try {
    let address = "";
    if (item.address) {
      address += `${item.address}, `;
      if (item.number || item.address_number) {
        address += `nº ${item.number ?? item.address_number}, `;
      }
    }
    if (item.complement || item.address_complement) {
      address += `${item.complement ?? item.address_complement}, `;
    }
    if (item.district || item.address_district) {
      address += `${item.district ?? item.address_district}, `;
    }

    if (item.city || item.city_name) {
      address += `${item.city ?? item.city_name}`;
      if (item.state || item.state_name) {
        address += ` - ${item.state ?? item.state_name}`;
      }
    }
    if (item.cep || item.address_cep) {
      address += ` ${maskCep(item.cep ?? item.address_cep)}`;
    }

    return address;
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const queryString = params => {
  try {
    let getQuery = "";
    if (params && params !== undefined) {
      getQuery = Object.keys(params)
        .map(function (key) {
          return key + "=" + params[key];
        })
        .join("&");
    }

    return getQuery;
  } catch (err) {
    return "";
  }
};

export const arrayQueryString = params => {
  try {
    let getQuery = "";

    getQuery = params
      .map(function (item) {
        return item.name + "=" + item.value;
      })
      .join("&");

    return getQuery;
  } catch (err) {
    return "";
  }
};

export const maskTextOrCPF = param => {
  const v = clearMask(param);

  if (v.length >= 11) {
    if (v.length === 11 && testCPF(v.substr(0, 11))) {
      return maskCpfCnpj(v.substr(0, 11), "cpf");
    } else if (v.length === 14 && validarCNPJ(v.substr(0, 14))) {
      return maskCpfCnpj(v.substr(0, 14), "cnpj");
    } else {
      return param;
    }
  } else {
    return param;
  }
};

export const removeAccent = param => {
  return param.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export function testCPF(strCPF) {
  let Soma = 0;
  let Resto;

  strCPF = clearMask(strCPF);

  if (strCPF == "00000000000") return false;

  for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
}

export function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj == "") return false;

  if (cnpj.length != 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (
    cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999"
  )
    return false;

  // Valida DVs
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(1)) return false;

  return true;
}

export function hex_to_ascii(str) {
  if (!str) return "";
  /**
   * ASCII contains 127 characters.
   *
   * In JavaScript, strings is encoded by UTF-16, it means that
   * js cannot present strings which charCode greater than 2^16. Eg:
   * `String.fromCharCode(0) === String.fromCharCode(2**16)`
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMString/Binary
   */
  const reg = /[\x7f-\uffff]/g; // charCode: [127, 65535]
  const replacer = s => {
    const charCode = s.charCodeAt(0);
    const unicode = charCode.toString(16).padStart(4, "0");
    return `\\u${unicode}`;
  };

  return str.replace(reg, replacer);
}

export function convertToSlug(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaaeeeeiiiioooouuuunc------";

  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}

export const getCurrentInfo = async () => {
  try {
    const response = await axios.get("https://geolocation-db.com/json/");

    return response.data;
  } catch (error) {
    return {};
  }
};

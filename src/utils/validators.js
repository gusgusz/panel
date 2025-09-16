import { validarCNPJ, testCPF } from "utils/functions";

export const validateName = value => {
  let error;
  if (!value) {
    error = "Campo obrigatório";
  } else if (value.length < 3) {
    error = "Esse campo precisa ter no mínimo 3 caracteres";
  }
  return error;
};

export const validateEmail = value => {
  let error;
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = "Por favor, informe um e-mail válido";
  }
  return error;
};

export const validatePhone = value => {
  let error;
  if (value && !/[(]\d{2}[)][ ][\d{1}]?[ ]?\d{4}[-]\d{4}/g.test(value)) {
    error = "Por favor, informe um telefone válido";
  }
  return error;
};

export const validateState = value => {
  let error;
  if (!value) {
    error = "Por favor, informe uma UF";
  }
  return error;
};

export const validateCity = value => {
  let error;
  if (!value) {
    error = "Por favor, informe uma Cidade";
  }
  return error;
};

export const validadeCarNumber = (value, is_producer) => {
  let error;
  if (is_producer) {
    if (!value) {
      error = "Por favor, informe o número do CAR";
    }
  }
  return error;
};

export const validadeSoy = (soy_value, corn_value, is_producer) => {
  let error;
  if (is_producer) {
    if ((!soy_value || soy_value == "" || soy_value == "0") && (!corn_value || corn_value == "" || corn_value == "0")) {
      error = "Por favor, informe a área de soja ou de milho";
    }
  }
  return error;
};

export const validadeCorn = (corn_value, soy_value, is_producer) => {
  let error;
  if (is_producer) {
    if ((!soy_value || soy_value == "" || soy_value == "0") && (!corn_value || corn_value == "" || corn_value == "0")) {
      error = "Por favor, informe a área de milho ou de soja ";
    }
  }
  return error;
};

export const validateCpf = (value, type) => {
  let error = false;

  if (type === "CPF") {
    if (!value) {
      error = "CPF é obrigatório";
    } else if (!testCPF(value)) {
      error = "Por favor, informe um CPF válido";
    }
  } else {
    if (!value) {
      error = "CNPJ é obrigatório";
    } else if (!validarCNPJ(value)) {
      error = "Por favor, informe um CNPJ válido";
    }
  }
  return error;
};

export const validatePassword = value => {
  let error;
  if (!value) {
    error = "Informe sua senha";
  } else if (value.length < 3) {
    error = "Sua senha precisa ter no mínimo 3 caracteres";
  }
  return error;
};

export default {
  validateName,
  validateEmail,
  validatePhone,
  validateState,
  validateCity,
  validadeCarNumber,
  validadeSoy,
  validadeCorn,
  validateCpf,
  validatePassword,
};
